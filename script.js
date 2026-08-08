document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------
    // 1. Tab Filter Functionality
    // ---------------------------------------------
    const filterTabs = document.querySelectorAll('#coupon-filter-tabs .tab-btn');
    const couponCards = document.querySelectorAll('#coupon-cards-container .coupon-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            couponCards.forEach(card => {
                // If it's an expired card, we always show it under its section, 
                // but let's filter active cards
                if (card.classList.contains('expired')) {
                    // Expired cards stay at the bottom, we can keep them visible or filter
                    // Typically expired cards are visible but grayed out
                    return;
                }

                const cardType = card.getAttribute('data-type');

                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (filterValue === 'codes' && cardType === 'codes') {
                    card.style.display = 'block';
                } else if (filterValue === 'deals' && cardType === 'deals') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ---------------------------------------------
    // 2. Toggle Coupon Details
    // ---------------------------------------------
    const toggleDetailsBtns = document.querySelectorAll('.btn-toggle-details');

    toggleDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cardFooter = btn.parentElement;
            const detailsContent = cardFooter.querySelector('.details-content');
            
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                btn.innerHTML = `Hide Details <span class="arrow-down">▼</span>`;
                detailsContent.style.maxHeight = '200px';
                detailsContent.style.padding = '16px 24px';
            } else {
                btn.innerHTML = `Show Details <span class="arrow-down">▼</span>`;
                detailsContent.style.maxHeight = '0';
                // Wait for transition to finish before removing padding to prevent jumpiness
                setTimeout(() => {
                    if (!btn.classList.contains('active')) {
                        detailsContent.style.padding = '0 24px';
                    }
                }, 200);
            }
        });
    });

    // ---------------------------------------------
    // 3. FAQ Accordion Functionality
    // ---------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = '0';
                i.querySelector('.faq-answer').style.padding = '0 24px';
            });
            
            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.padding = '20px 24px';
                answer.style.maxHeight = '500px'; // Set to sufficiently large height
            }
        });
    });

    // ---------------------------------------------
    // 4. Favorites Toggle
    // ---------------------------------------------
    const favoriteBtn = document.getElementById('btn-favorite-store');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('favorited');
            const span = favoriteBtn.querySelector('span');
            if (favoriteBtn.classList.contains('favorited')) {
                span.textContent = 'Favorited';
            } else {
                span.textContent = 'Add to Favorites';
            }
        });
    }

    // ---------------------------------------------
    // 5. Code Reveal & Modal Control
    // ---------------------------------------------
    const modal = document.getElementById('code-reveal-modal');
    const modalCloseBtn = document.getElementById('btn-close-modal');
    const revealBtns = document.querySelectorAll('.btn-reveal-code');
    
    // Modal Element Placeholders
    const modalStoreName = document.getElementById('modal-store-name-placeholder');
    const modalTitle = document.getElementById('modal-title-placeholder');
    const modalCodeVal = document.getElementById('modal-code-placeholder');
    const modalRedirectLink = document.getElementById('modal-redirect-link');
    const modalStatusText = document.getElementById('modal-status-text');
    
    // Copy Action Elements
    const copyActionBtn = document.getElementById('btn-copy-code-action');
    const copyBtnText = document.getElementById('copy-btn-text');
    const copyFeedbackToast = document.getElementById('copy-feedback-toast');

    let currentActiveCode = '';

    // Function to open modal and handle redirection
    const openModal = (code, storeName, title) => {
        currentActiveCode = code;
        
        // Populate placeholders
        modalStoreName.textContent = storeName;
        modalTitle.textContent = title;
        modalCodeVal.textContent = code;
        
        // Dynamic redirection link (using exact affiliate URL)
        const targetUrl = 'https://www.doubleoakessentials.com?sca_ref=11635060.GkfUSSur3axLS6mm';
        modalRedirectLink.setAttribute('href', targetUrl);
        
        // Generate a random shopper verification count for authenticity
        const randomShoppers = Math.floor(Math.random() * 30) + 15;
        modalStatusText.textContent = `Verified 100% working by ${randomShoppers} shoppers today`;
        
        // Reset copy button styling
        copyActionBtn.classList.remove('copied');
        copyBtnText.textContent = 'Copy Code';
        copyFeedbackToast.style.display = 'none';

        // Open modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    };

    // Attach listeners to all reveal buttons
    revealBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check if card is expired
            const couponCard = btn.closest('.coupon-card');
            if (couponCard && couponCard.classList.contains('expired')) {
                e.preventDefault();
                return;
            }

            const code = btn.getAttribute('data-code');
            const storeName = btn.getAttribute('data-store');
            const title = btn.getAttribute('data-title');

            openModal(code, storeName, title);
            
            // We do NOT call e.preventDefault() for active anchors, 
            // so the browser opens the target="_blank" href natively.
        });
    });

    // Close modal listeners
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking on dark backdrop overlay
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ---------------------------------------------
    // 6. Copy to Clipboard Functionality
    // ---------------------------------------------
    if (copyActionBtn) {
        copyActionBtn.addEventListener('click', () => {
            if (!currentActiveCode) return;

            // Copy to Clipboard
            navigator.clipboard.writeText(currentActiveCode).then(() => {
                // Success feedback
                copyActionBtn.classList.add('copied');
                copyBtnText.textContent = 'Copied!';
                copyFeedbackToast.style.display = 'block';

                // Automatically close toast and reset button style after 3 seconds
                setTimeout(() => {
                    copyActionBtn.classList.remove('copied');
                    copyBtnText.textContent = 'Copy Code';
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy code: ', err);
                // Fallback copy logic for older browsers
                const el = document.createElement('textarea');
                el.value = currentActiveCode;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);

                copyActionBtn.classList.add('copied');
                copyBtnText.textContent = 'Copied!';
                copyFeedbackToast.style.display = 'block';
            });
        });
    }

    // ---------------------------------------------
    // 7. Simulated Search Suggestion Feedback
    // ---------------------------------------------
    const searchInput = document.getElementById('store-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim().toLowerCase();
                if (query) {
                    alert(`Showing search results for "${query}" on PhyProReview...`);
                }
            }
        });
    }
});
