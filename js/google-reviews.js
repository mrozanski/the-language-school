/**
 * Google Reviews Widget
 * Dynamically renders Google reviews from JSON data
 */

(function() {
    'use strict';

    // SVG for stars (filled and empty)
    const STAR_SVG = {
        filled: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
        empty: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
    };

    // Google verified badge SVG
    const VERIFIED_BADGE_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="#4285F4" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.89 6.13L7.05 11.89c-.2.2-.46.3-.72.3s-.52-.1-.72-.3L3.11 9.16c-.4-.4-.4-1.04 0-1.44.4-.4 1.04-.4 1.44 0L6.33 9.9l3.52-3.52c.4-.4 1.04-.4 1.44 0 .39.4.39 1.04 0 1.44z"/></svg>';

    // Google logo - try to use official one, fallback to TrustIndex
    const GOOGLE_LOGO_SVG = '<img src="https://cdn.trustindex.io/assets/platform/Google/logo.svg" alt="Google" class="google-logo" width="110" height="35">';

    class GoogleReviewsWidget {
        constructor(containerId, reviewsData) {
            this.container = document.getElementById(containerId);
            this.reviewsData = reviewsData;
            this.currentIndex = 0;
            this.itemsPerView = this.getItemsPerView();
            
            if (!this.container || !this.reviewsData) {
                console.error('Google Reviews Widget: Container or data not found');
                return;
            }

            this.init();
            this.setupResponsive();
        }

        getItemsPerView() {
            const width = window.innerWidth;
            if (width >= 1024) return 3;  // Desktop: 3 reviews
            if (width >= 768) return 2;   // Tablet: 2 reviews
            return 1;                      // Mobile: 1 review
        }

        setupResponsive() {
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const newItemsPerView = this.getItemsPerView();
                    if (newItemsPerView !== this.itemsPerView) {
                        this.itemsPerView = newItemsPerView;
                        // Ensure currentIndex is valid for new itemsPerView
                        const maxIndex = Math.max(0, this.reviewsData.reviews.length - this.itemsPerView);
                        this.currentIndex = Math.min(this.currentIndex, maxIndex);
                    }
                    // Always update to recalculate translate on resize
                    this.updateVisibleCards();
                }, 250);
            });
        }

        init() {
            this.render();
            this.attachEventListeners();
        }

        render() {
            this.container.innerHTML = this.generateHTML();
            this.updateVisibleCards();
            this.attachExpandCollapseListeners();
        }

        updateVisibleCards() {
            const cards = this.container.querySelectorAll('.review-card');
            const totalReviews = this.reviewsData.reviews.length;
            const container = this.container.querySelector('.reviews-container-wrapper');
            
            // Calculate horizontal translate for carousel effect
            if (container && cards.length > 0) {
                // Use requestAnimationFrame to ensure layout is complete
                requestAnimationFrame(() => {
                    const firstCard = cards[0];
                    if (firstCard && firstCard.offsetWidth > 0) {
                        const cardWidth = firstCard.offsetWidth;
                        const gap = parseFloat(window.getComputedStyle(container).gap) || 16;
                        const translateX = -(this.currentIndex * (cardWidth + gap));
                        container.style.transform = `translateX(${translateX}px)`;
                    }
                });
            }
            
            cards.forEach((card, index) => {
                const isVisible = index >= this.currentIndex && index < this.currentIndex + this.itemsPerView;
                if (isVisible) {
                    card.classList.add('visible');
                } else {
                    card.classList.remove('visible');
                }
            });

            // Update controls
            const prevButton = this.container.querySelector('.review-prev');
            const nextButton = this.container.querySelector('.review-next');
            const maxIndex = Math.max(0, totalReviews - this.itemsPerView);
            
            if (prevButton) {
                prevButton.disabled = this.currentIndex === 0;
            }
            if (nextButton) {
                nextButton.disabled = this.currentIndex >= maxIndex;
            }
        }

        generateStars(rating) {
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                starsHTML += i <= rating ? STAR_SVG.filled : STAR_SVG.empty;
            }
            return starsHTML;
        }

        generateSummaryHTML() {
            const { rating, totalReviews, ratingText } = this.reviewsData.summary;
            return `
                <div class="card google-reviews-summary">
                    <div class="summary-rating-text">
                        <strong class="rating-large">${ratingText}</strong>
                    </div>
                    <div class="summary-stars">
                        ${this.generateStars(rating)}
                    </div>
                    <div class="summary-rating-text">
                        <span class="nowrap">En base a <strong>${totalReviews} reseñas</strong></span>
                    </div>
                    <div class="summary-logo">
                        ${GOOGLE_LOGO_SVG}
                    </div>
                </div>
            `;
        }

        truncateText(text, maxHeight = 87) {
            // This will be handled by CSS, but we store full text
            return text;
        }

        generateReviewHTML(review, index) {
            const starsHTML = this.generateStars(review.rating);
            const verifiedBadge = review.verified ? `<span class="verified-badge" title="Reseña verificada">${VERIFIED_BADGE_SVG}</span>` : '';
            
            return `
                <div class="review-card" data-index="${index}">
                    <div class="review-inner">
                        <div class="review-header">
                            <div class="review-profile-img">
                                <img src="${review.author.photo}" alt="${review.author.name}" loading="lazy" decoding="async">
                            </div>
                            <div class="review-profile-details">
                                <div class="review-name">${review.author.name}</div>
                                <div class="review-date">${review.date}</div>
                            </div>
                            <div class="review-google-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="review-stars">
                            ${starsHTML}
                            ${verifiedBadge}
                        </div>
                        <div class="review-text-container">
                            <div class="review-text" data-full-text="${this.escapeHtml(review.text)}">
                                ${this.escapeHtml(review.text)}
                            </div>
                        </div>
                        <button class="review-read-more" aria-label="Leer más" style="display: none;">
                            <span class="read-more-text">Leer más</span>
                            <span class="read-less-text" style="display: none;">Ocultar</span>
                        </button>
                    </div>
                </div>
            `;
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        generateControlsHTML() {
            const totalReviews = this.reviewsData.reviews.length;
            const maxIndex = Math.max(0, totalReviews - this.itemsPerView);
            const showPrev = this.currentIndex > 0;
            const showNext = this.currentIndex < maxIndex;

            return `
                <div class="reviews-controls">
                    <button class="review-prev" aria-label="Reseña anterior" ${!showPrev ? 'disabled' : ''}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button class="review-next" aria-label="Siguiente reseña" ${!showNext ? 'disabled' : ''}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                </div>
            `;
        }

        generateHTML() {
            const reviews = this.reviewsData.reviews;
            const reviewsHTML = reviews.map((review, index) => 
                this.generateReviewHTML(review, index)
            ).join('');

            return `
                <div class="google-reviews-widget-container">
                    ${this.generateSummaryHTML()}
                    <div class="google-reviews-list">
                        ${this.generateControlsHTML()}
                        <div class="reviews-container">
                            <div class="reviews-container-wrapper">
                                ${reviewsHTML}
                            </div>
                        </div>
                        <div class="reviews-controls-line"></div>
                    </div>
                </div>
            `;
        }

        attachEventListeners() {
            this.container.addEventListener('click', (e) => {
                if (e.target.closest('.review-next')) {
                    this.next();
                } else if (e.target.closest('.review-prev')) {
                    this.prev();
                }
            });
        }

        attachExpandCollapseListeners() {
            const readMoreButtons = this.container.querySelectorAll('.review-read-more');
            readMoreButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const reviewCard = button.closest('.review-card');
                    const reviewText = reviewCard.querySelector('.review-text');
                    const readMoreText = button.querySelector('.read-more-text');
                    const readLessText = button.querySelector('.read-less-text');
                    
                    if (reviewText.classList.contains('expanded')) {
                        reviewText.classList.remove('expanded');
                        readMoreText.style.display = 'inline';
                        readLessText.style.display = 'none';
                    } else {
                        reviewText.classList.add('expanded');
                        readMoreText.style.display = 'none';
                        readLessText.style.display = 'inline';
                    }
                });
            });

            // Check if text needs "Leer más" button
            this.container.querySelectorAll('.review-text').forEach(textEl => {
                if (textEl.scrollHeight > textEl.clientHeight) {
                    const button = textEl.closest('.review-card').querySelector('.review-read-more');
                    if (button) {
                        button.style.display = 'block';
                    }
                }
            });
        }

        next() {
            const totalReviews = this.reviewsData.reviews.length;
            const maxIndex = Math.max(0, totalReviews - this.itemsPerView);
            if (this.currentIndex < maxIndex) {
                this.currentIndex = Math.min(this.currentIndex + this.itemsPerView, maxIndex);
                this.updateVisibleCards();
            }
        }

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex = Math.max(0, this.currentIndex - this.itemsPerView);
                this.updateVisibleCards();
            }
        }
    }

    // Initialize widget when DOM is ready
    function initGoogleReviewsWidget() {
        // Try to get data from script tag with id="google-reviews-data"
        const dataScript = document.getElementById('google-reviews-data');
        let reviewsData = null;

        if (dataScript) {
            try {
                reviewsData = JSON.parse(dataScript.textContent);
            } catch (e) {
                console.error('Google Reviews Widget: Failed to parse JSON data', e);
            }
        }

        // Fallback: check for global variable
        if (!reviewsData && typeof window.googleReviewsData !== 'undefined') {
            reviewsData = window.googleReviewsData;
        }

        if (reviewsData) {
            new GoogleReviewsWidget('google-reviews-widget', reviewsData);
        } else {
            console.error('Google Reviews Widget: No data found. Add a script tag with id="google-reviews-data" containing JSON.');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGoogleReviewsWidget);
    } else {
        initGoogleReviewsWidget();
    }

})();
