(function () {
    const menuButton = document.querySelector('[data-menu-button]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        const search = panel.querySelector('[data-filter-search]');
        const year = panel.querySelector('[data-filter-year]');
        const region = panel.querySelector('[data-filter-region]');
        const type = panel.querySelector('[data-filter-type]');
        const scope = panel.parentElement ? panel.parentElement.querySelector('[data-card-scope]') : document;
        const cards = scope ? Array.from(scope.querySelectorAll('[data-card]')) : [];

        const applyFilter = function () {
            const q = search ? search.value.trim().toLowerCase() : '';
            const y = year ? year.value : '';
            const r = region ? region.value : '';
            const t = type ? type.value : '';

            cards.forEach(function (card) {
                const text = [
                    card.dataset.title || '',
                    card.dataset.tags || '',
                    card.dataset.region || '',
                    card.dataset.type || '',
                    card.dataset.year || ''
                ].join(' ').toLowerCase();
                const okQuery = !q || text.indexOf(q) !== -1;
                const okYear = !y || card.dataset.year === y;
                const okRegion = !r || card.dataset.region === r;
                const okType = !t || card.dataset.type === t;
                card.classList.toggle('hidden', !(okQuery && okYear && okRegion && okType));
            });
        };

        [search, year, region, type].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
    });

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
        const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
        const prev = slider.querySelector('[data-hero-prev]');
        const next = slider.querySelector('[data-hero-next]');
        let index = 0;
        let timer = null;

        const show = function (nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
        };

        const start = function () {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        };

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        show(0);
        start();
    });

    document.querySelectorAll('.rail-wrap').forEach(function (wrap) {
        const rail = wrap.querySelector('[data-rail]');
        const prev = wrap.querySelector('[data-rail-prev]');
        const next = wrap.querySelector('[data-rail-next]');

        if (!rail) {
            return;
        }

        const distance = function () {
            return Math.max(280, Math.round(rail.clientWidth * 0.82));
        };

        if (prev) {
            prev.addEventListener('click', function () {
                rail.scrollBy({ left: -distance(), behavior: 'smooth' });
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                rail.scrollBy({ left: distance(), behavior: 'smooth' });
            });
        }
    });
}());

function initMoviePlayer(sourceUrl) {
    const video = document.querySelector('.movie-video');
    const overlay = document.querySelector('.player-overlay');
    let loaded = false;
    let hlsInstance = null;

    if (!video || !sourceUrl) {
        return;
    }

    const loadVideo = function () {
        if (loaded) {
            return;
        }
        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = sourceUrl;
        }
    };

    const playVideo = function () {
        loadVideo();
        if (overlay) {
            overlay.classList.add('hidden');
        }
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {});
        }
    };

    if (overlay) {
        overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
