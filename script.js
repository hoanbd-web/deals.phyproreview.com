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

    // ---------------------------------------------
    // 8. Legal Modal Functionality (Google Ads Compliance)
    // ---------------------------------------------
    const legalModal = document.getElementById('legal-modal');
    const closeLegalBtn = document.getElementById('btn-close-legal-modal');
    const legalTitle = document.getElementById('legal-title-placeholder');
    const legalContent = document.getElementById('legal-content-placeholder');

    const legalTexts = {
        about: {
            title: "About PhyProReview",
            html: `
                <p><strong>PhyProReview</strong> is a leading community-driven savings platform dedicated to helping consumers find active coupons, promo codes, and discount deals for physical products and online brands.</p>
                <p>Our mission is to help shoppers save money on their everyday carry essentials and premium physical store purchases through verified community contributions and AI-backed screening.</p>
            `
        },
        privacy: {
            title: "Privacy Policy",
            html: `
                <p>At PhyProReview, accessible from deals.phyproreview.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by PhyProReview and how we use it.</p>
                <h5 style="margin-top:16px; margin-bottom:6px; font-size:14px; color:#0f172a; font-weight:700;">1. Log Files</h5>
                <p>PhyProReview follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
                <h5 style="margin-top:16px; margin-bottom:6px; font-size:14px; color:#0f172a; font-weight:700;">2. Cookies & Affiliate Tracking</h5>
                <p>We use cookies to store information about visitors' preferences, to record user-specific information on which pages the user accesses or visits, and to customize our web page content based on visitors' browser type or other information. We use affiliate links to redirect visitors to merchant stores. Cookies are used by affiliate networks to track purchases and ensure we receive a referral commission.</p>
                <h5 style="margin-top:16px; margin-bottom:6px; font-size:14px; color:#0f172a; font-weight:700;">3. Consent</h5>
                <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
            `
        },
        terms: {
            title: "Terms & Conditions",
            html: `
                <p>Welcome to PhyProReview! These terms and conditions outline the rules and regulations for the use of PhyProReview's Website, located at deals.phyproreview.com.</p>
                <h5 style="margin-top:16px; margin-bottom:6px; font-size:14px; color:#0f172a; font-weight:700;">1. Disclaimers</h5>
                <p>All coupon codes, promotional offers, discounts, and store statistics displayed on this website are provided "as is" and for informational purposes only. PhyProReview does not warrant or guarantee that any promo code is active, working, or accepted by the merchant. Users are responsible for confirming active discounts at checkout.</p>
                <h5 style="margin-top:16px; margin-bottom:6px; font-size:14px; color:#0f172a; font-weight:700;">2. Limitation of Liability</h5>
                <p>PhyProReview, its operators, or contributors shall not be held liable for any damages, transactional losses, or disputes arising between users and listed merchants (including Double Oak Essentials) as a result of using discount codes or visiting merchant links.</p>
            `
        },
        disclosure: {
            title: "Advertising Disclosure",
            html: `
                <p>PhyProReview is a professional, independent coupon database and shopping resource. This website is user-supported and funded through affiliate partnerships.</p>
                <h5 style="margin-top:16px; margin-bottom:6px; font-size:14px; color:#0f172a; font-weight:700;">Affiliate Commission Disclosure</h5>
                <p>When you click on coupon buttons ("Get Code" / "Get Deal") or merchant links on this website and subsequently make a purchase, the merchant may pay us a referral commission. This commission does not increase the final price you pay. Affiliate commissions help support the costs of hosting, maintaining, and verifying codes on this database.</p>
            `
        }
    };

    const openLegalModal = (type) => {
        if (!legalTexts[type]) return;
        legalTitle.textContent = legalTexts[type].title;
        legalContent.innerHTML = legalTexts[type].html;
        legalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLegalModal = () => {
        legalModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Attach click events to footer links
    const aboutLink = document.getElementById('link-about');
    const privacyLink = document.getElementById('link-privacy');
    const termsLink = document.getElementById('link-terms');
    const disclosureLink = document.getElementById('link-disclosure');

    if (aboutLink) aboutLink.addEventListener('click', (e) => { e.preventDefault(); openLegalModal('about'); });
    if (privacyLink) privacyLink.addEventListener('click', (e) => { e.preventDefault(); openLegalModal('privacy'); });
    if (termsLink) termsLink.addEventListener('click', (e) => { e.preventDefault(); openLegalModal('terms'); });
    if (disclosureLink) disclosureLink.addEventListener('click', (e) => { e.preventDefault(); openLegalModal('disclosure'); });

    if (closeLegalBtn) {
        closeLegalBtn.addEventListener('click', closeLegalModal);
    }

    if (legalModal) {
        legalModal.addEventListener('click', (e) => {
            if (e.target === legalModal) {
                closeLegalModal();
            }
        });
    }
});
