#!/usr/bin/env bash
#
# cache-bust.sh
#
# Stamps a short content hash onto every local CSS/JS reference in the site's
# HTML files, e.g.  href="css/styles.css"  ->  href="css/styles.css?v=ab12cd34ef"
#
# The hash is derived from the referenced file's contents, so:
#   - the URL changes ONLY when the file actually changes (forces a fresh fetch)
#   - running this repeatedly with no asset changes produces NO diff (idempotent)
#
# Run it from anywhere before committing CSS/JS changes:
#   ./scripts/cache-bust.sh
#
set -euo pipefail

# Move to the repo root (parent of this script's directory) so relative asset
# paths like "css/styles.css" resolve against the filesystem.
cd "$(dirname "$0")/.."

perl - *.html <<'PERL'
use strict;
use warnings;
use Digest::MD5 qw(md5_hex);

my %hash_cache;

# Compute (and cache) a short content hash for a local asset path.
sub asset_hash {
    my ($path) = @_;
    return $hash_cache{$path} if exists $hash_cache{$path};
    open(my $fh, '<:raw', $path) or return undef;   # skip if file is missing
    local $/;
    my $data = <$fh>;
    close $fh;
    my $h = substr(md5_hex($data), 0, 10);
    $hash_cache{$path} = $h;
    return $h;
}

my $changed_files = 0;

for my $file (@ARGV) {
    open(my $in, '<:raw', $file) or do {
        warn "skip: cannot read $file\n";
        next;
    };
    local $/;
    my $content = <$in>;
    close $in;
    my $original = $content;

    # Match href="..." or src="..." pointing at a local css/ or js/ file,
    # optionally carrying an existing ?v=... that we replace.
    $content =~ s{
        (\b(?:href|src)=")            # $1: attribute opener
        ((?:css|js)/[^"?]+\.(?:css|js)) # $2: local asset path
        (?:\?v=[^"]*)?               # existing version stamp (dropped)
        (")                          # $3: closing quote
    }{
        my ($pre, $path, $post) = ($1, $2, $3);
        my $h = asset_hash($path);
        defined $h ? "$pre$path?v=$h$post" : "$pre$path$post";
    }gex;

    next if $content eq $original;

    open(my $out, '>:raw', $file) or die "cannot write $file: $!\n";
    print $out $content;
    close $out;
    print "updated: $file\n";
    $changed_files++;
}

print $changed_files
    ? "\nDone. $changed_files file(s) updated.\n"
    : "\nNo changes needed (everything already up to date).\n";
PERL
