document.addEventListener('DOMContentLoaded', () => {
    // 1. スクロールアニメーション（Intersection Observer）
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一度表示されたら監視を解除
            }
        });
    }, observerOptions);

    // フェードインさせる要素を取得
    const fadeElements = document.querySelectorAll('.section-title, .console-card, .work-card, .doc-item, .skill-group');
    fadeElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 4) * 0.05}s`; // わずかな遅延でスナップ感を出す
        observer.observe(el);
    });

    // 2. スムーススクロール
    document.querySelectorAll('.nav-links a[href^="#"], .hero-buttons a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 70px はナビゲーションの高さ
                    behavior: 'smooth'
                });
            }
        });
    });



    // 4. 作品カードクリックでSteamストア風ダイアログ（モーダル）が開く演出
    const steamModal = document.getElementById('steam-modal');
    const steamModalClose = document.getElementById('steam-modal-close');
    const workCards = document.querySelectorAll('.work-card');

    function openSteamModal(card) {
        if (!card) return;

        const h3El = card.querySelector('h3');
        const title = h3El?.dataset?.fulltitle || h3El?.innerText || h3El?.innerHTML || '';
        const role = card.querySelector('.work-role')?.innerHTML || '';
        const desc = card.querySelector('.work-desc')?.innerHTML || '';
        const img = card.querySelector('.work-img');
        const bannerSrc = img ? (img.getAttribute('data-gif') || img.src) : '';
        const badge = card.querySelector('.work-badge')?.innerHTML || '';
        const awardText = card.querySelector('.award-badge')?.innerText.trim() || '';
        
        // Find action buttons container securely
        let actionsContainer = card.querySelector('.work-info div[style*="flex"]');
        if (!actionsContainer) {
            const divs = card.querySelectorAll('.work-info div');
            actionsContainer = divs[divs.length - 1];
        }
        const actionsHtml = actionsContainer ? actionsContainer.innerHTML : '';

        const titleEl = document.getElementById('steam-title');
        const bannerEl = document.getElementById('steam-banner');
        const descEl = document.getElementById('steam-desc');
        const roleEl = document.getElementById('steam-role');
        const badgeEl = document.getElementById('steam-badge');
        const actionsEl = document.getElementById('steam-actions');

        if (titleEl) titleEl.innerHTML = title;
        if (bannerEl) bannerEl.src = bannerSrc;
        if (descEl) descEl.innerHTML = desc;
        if (roleEl) roleEl.innerHTML = role;
        if (badgeEl) badgeEl.innerHTML = badge;
        if (actionsEl) actionsEl.innerHTML = actionsHtml;

        const awardBox = document.getElementById('steam-award-box');
        if (awardBox) {
            if (awardText) {
                awardBox.style.display = 'block';
                awardBox.innerHTML = `<span class="steam-meta-label">受賞実績</span><div class="steam-award-badge-ui">${awardText}</div>`;
            } else {
                awardBox.style.display = 'none';
            }
        }

        const modal = document.getElementById('steam-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSteamModal() {
        const modal = document.getElementById('steam-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    workCards.forEach(card => {
        const img = card.querySelector('img[data-gif]');
        if (img) {
            card.addEventListener('mouseenter', () => {
                if (img.dataset.gif && !img.src.endsWith(img.dataset.gif)) {
                    img.src = img.dataset.gif;
                }
            });

            card.addEventListener('mouseleave', () => {
                if (img.dataset.static && !img.src.endsWith(img.dataset.static)) {
                    img.src = img.dataset.static;
                }
            });
        }

        card.addEventListener('click', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            openSteamModal(card);
        });
    });

    if (steamModalClose) {
        steamModalClose.addEventListener('click', closeSteamModal);
    }

    if (steamModal) {
        steamModal.addEventListener('click', (e) => {
            if (e.target === steamModal) {
                closeSteamModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSteamModal();
        }
    });
});
