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

    // 3. 「もっと見る」/「しまう」ボタンのロジック
    const loadMoreBtn = document.getElementById('load-more-btn');
    const extraWorks = document.querySelectorAll('.extra-work');
    let isExpanded = false;

    if (loadMoreBtn && extraWorks.length > 0) {
        loadMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {
                // 展開する
                extraWorks.forEach((work, index) => {
                    setTimeout(() => {
                        work.classList.add('show-work');
                    }, index * 100);
                });
                loadMoreBtn.textContent = 'しまう ▲';
                isExpanded = true;
            } else {
                // 折りたたむ
                extraWorks.forEach(work => {
                    work.classList.remove('show-work');
                });
                loadMoreBtn.textContent = 'もっと見る ▼';
                isExpanded = false;
                
                // 画面を作品一覧のトップへスムーズにスクロールして戻す
                const worksSection = document.getElementById('works');
                if (worksSection) {
                    window.scrollTo({
                        top: worksSection.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
});
