/**
 * Language Selection Modal
 * Handles opening, closing, and accessibility features for the evaluation modal
 */

(function() {
    'use strict';

    // Get modal elements
    const modal = document.getElementById('evaluationModal');
    const openButtons = document.querySelectorAll('[data-modal-trigger="evaluationModal"]');
    const closeButton = document.getElementById('closeModal');
    const languageOptions = modal ? modal.querySelectorAll('.language-option') : [];

    // Store the element that opened the modal (for focus management)
    let previouslyFocusedElement = null;

    /**
     * Open the modal
     */
    function openModal() {
        if (!modal) return;

        // Store the currently focused element
        previouslyFocusedElement = document.activeElement;

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Focus on the close button for accessibility
        setTimeout(() => {
            closeButton.focus();
        }, 100);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the modal
     */
    function closeModal() {
        if (!modal) return;

        // Hide modal
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to the element that opened the modal
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }

    /**
     * Handle escape key press
     */
    function handleEscapeKey(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    }

    /**
     * Handle click on overlay (outside modal content)
     */
    function handleOverlayClick(event) {
        // Only close if clicking directly on the overlay, not on modal content
        if (event.target === modal) {
            closeModal();
        }
    }

    /**
     * Trap focus within modal for accessibility
     */
    function trapFocus(event) {
        if (!modal.classList.contains('active')) return;

        const focusableElements = modal.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If Tab key is pressed
        if (event.key === 'Tab') {
            // Shift + Tab: if focus is on first element, move to last
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } 
            // Tab: if focus is on last element, move to first
            else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    // Event listeners - attach to all open buttons
    openButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Close on escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', handleOverlayClick);
    }

    // Focus trap for accessibility
    document.addEventListener('keydown', trapFocus);

    // Close modal when language option is clicked (optional - you might want to keep it open for analytics)
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Modal will close when navigating to the URL
            // You can add analytics tracking here if needed
        });
    });

})();

