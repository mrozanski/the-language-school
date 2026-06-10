/**
 * Books Catalog
 * Renders the TLS book catalog from js/books-data.json
 */

(function () {
    'use strict';

    const FORMAT_LABELS = {
        paperback: 'Paperback',
        hardcover: 'Hardcover',
        kindle: 'Kindle',
        audiobook: 'Audible',
        workbook: 'Workbook',
        'spiral-bound': 'Spiral-bound'
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function isGenericTitle(title) {
        return /^(english|inglés|ingles|let's start talking)$/i.test(String(title || '').trim());
    }

    function getDisplayHeading(book) {
        if (isGenericTitle(book.title) && book.subtitle) {
            return {
                primary: book.subtitle,
                secondary: book.series || book.title
            };
        }

        return {
            primary: book.title,
            secondary: book.subtitle || ''
        };
    }

    function getCoverAlt(book) {
        if (book.coverImageAlt) {
            return book.coverImageAlt;
        }

        const heading = getDisplayHeading(book);
        return `Cover of ${heading.primary}`;
    }

    function countBooks(section) {
        return section.levels.reduce(function (total, level) {
            return total + level.books.length;
        }, 0);
    }

    function renderFormatTags(formats) {
        if (!formats || !formats.length) {
            return '';
        }

        return formats.map(function (format) {
            const label = FORMAT_LABELS[format] || format;
            return `<span class="book-format">${escapeHtml(label)}</span>`;
        }).join('');
    }

    function renderMetaLine(book) {
        const parts = [];

        if (book.pageCount) {
            parts.push(`${book.pageCount} pages`);
        }

        if (book.series) {
            parts.push(book.series);
        }

        if (!parts.length) {
            return '';
        }

        return `<p class="book-meta">${escapeHtml(parts.join(' · '))}</p>`;
    }

    function renderPlacementNote(book) {
        if (!book.tags || !book.tags.length) {
            return '';
        }

        return `<p class="book-note">${escapeHtml(book.tags.join(' '))}</p>`;
    }

    function renderBookCard(book) {
        const heading = getDisplayHeading(book);
        const coverMarkup = book.coverImage
            ? `<img src="${escapeHtml(book.coverImage)}" alt="${escapeHtml(getCoverAlt(book))}" class="book-cover" loading="lazy">`
            : `<div class="book-cover book-cover-placeholder" aria-hidden="true"><span>No cover</span></div>`;

        const secondaryLine = heading.secondary
            ? `<p class="book-subtitle">${escapeHtml(heading.secondary)}</p>`
            : '';

        // Layout test: formats + description hidden — restore lines below when decided
        // <div class="book-formats">${renderFormatTags(book.formats)}</div>
        // <p class="book-description">${escapeHtml(book.description)}</p>

        return `
            <article class="book-card card" id="book-${escapeHtml(book.id)}">
                <a href="${escapeHtml(book.amazonUrl)}" class="book-cover-link" target="_blank" rel="noopener noreferrer">
                    ${coverMarkup}
                </a>
                <div class="book-body">
                    <h4 class="book-title">${escapeHtml(heading.primary)}</h4>
                    ${secondaryLine}
                    ${renderMetaLine(book)}
                    ${renderPlacementNote(book)}
                    <a href="${escapeHtml(book.amazonUrl)}" class="btn btn-primary book-buy" target="_blank" rel="noopener noreferrer">
                        Buy on Amazon
                    </a>
                </div>
            </article>
        `;
    }

    function renderLevel(level) {
        if (!level.books.length) {
            return '';
        }

        const cards = level.books.map(renderBookCard).join('');

        return `
            <div class="books-level" id="${escapeHtml(level.id)}">
                <div class="books-level-header">
                    <h3>${escapeHtml(level.title)}</h3>
                    <span class="books-level-count">${level.books.length} book${level.books.length === 1 ? '' : 's'}</span>
                </div>
                <div class="books-grid">
                    ${cards}
                </div>
            </div>
        `;
    }

    function renderSection(section) {
        const bookCount = countBooks(section);
        if (!bookCount) {
            return '';
        }

        const levels = section.levels.map(renderLevel).filter(Boolean).join('');
        if (!levels) {
            return '';
        }

        return `
            <section class="books-section" id="section-${escapeHtml(section.id)}" aria-labelledby="heading-${escapeHtml(section.id)}">
                <div class="books-section-header">
                    <h2 id="heading-${escapeHtml(section.id)}">${escapeHtml(section.title)}</h2>
                    <p class="books-section-description">${escapeHtml(section.description || '')}</p>
                    <p class="books-section-count">${bookCount} book${bookCount === 1 ? '' : 's'}</p>
                </div>
                ${levels}
            </section>
        `;
    }

    function renderJumpNav(sections) {
        const links = sections
            .filter(function (section) {
                return countBooks(section) > 0;
            })
            .map(function (section) {
                const count = countBooks(section);
                return `
                    <a href="#section-${escapeHtml(section.id)}" class="books-jump-link" data-section="${escapeHtml(section.id)}">
                        ${escapeHtml(section.title)} <span class="books-jump-count">(${count})</span>
                    </a>
                `;
            })
            .join('');

        if (!links) {
            return '';
        }

        return `
            <nav class="books-jump-nav" aria-label="Browse by language">
                ${links}
            </nav>
        `;
    }

    function renderCatalog(data) {
        const sections = data.sections.map(renderSection).filter(Boolean).join('');
        const jumpNav = renderJumpNav(data.sections);

        return `
            ${jumpNav}
            <div class="books-catalog">
                ${sections}
            </div>
            <div class="books-footer-cta text-center">
                <p>Browse the full collection on Amazon or explore other TLS resources.</p>
                <div class="hero-cta">
                    <a href="${escapeHtml(data.meta.amazonAuthorUrl)}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">View All on Amazon</a>
                    <a href="products.html" class="btn btn-outline">Other Products</a>
                </div>
            </div>
        `;
    }

    function renderHero(meta) {
        const hero = document.getElementById('books-hero');
        if (!hero || !meta) {
            return;
        }

        hero.innerHTML = `
            <h1>${escapeHtml(meta.title)}</h1>
            <p class="hero-subtitle">${escapeHtml(meta.subtitle || '')}</p>
            <p>By ${escapeHtml(meta.author)} · Conversation-based workbooks aligned with TLS class levels.</p>
        `;
    }

    function setupJumpNav(container) {
        const nav = container.querySelector('.books-jump-nav');
        if (!nav) {
            return;
        }

        const links = nav.querySelectorAll('.books-jump-link');
        const sections = container.querySelectorAll('.books-section');

        function setActive(sectionId) {
            links.forEach(function (link) {
                link.classList.toggle('active', link.dataset.section === sectionId);
            });
        }

        links.forEach(function (link) {
            link.addEventListener('click', function () {
                setActive(link.dataset.section);
            });
        });

        if (!('IntersectionObserver' in window) || !sections.length) {
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActive(entry.target.id.replace('section-', ''));
                }
            });
        }, {
            rootMargin: '-30% 0px -55% 0px',
            threshold: 0
        });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function renderError(container, message) {
        container.innerHTML = `
            <div class="books-error card">
                <h2>Unable to load books</h2>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }

    function initBooksCatalog() {
        const container = document.getElementById('books-catalog-widget');
        if (!container) {
            return;
        }

        fetch('js/books-data.json')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Could not load book catalog.');
                }
                return response.json();
            })
            .then(function (data) {
                renderHero(data.meta);
                container.innerHTML = renderCatalog(data);
                setupJumpNav(container);
            })
            .catch(function (error) {
                console.error('Books catalog:', error);
                renderError(container, error.message || 'Please try again later.');
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBooksCatalog);
    } else {
        initBooksCatalog();
    }
})();
