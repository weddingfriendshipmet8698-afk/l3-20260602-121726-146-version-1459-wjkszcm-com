(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobile = document.querySelector('.mobile-nav');
    if (toggle && mobile) {
        toggle.addEventListener('click', function () {
            var open = mobile.classList.toggle('open');
            document.body.classList.toggle('menu-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (slides.length > 1) {
        var current = 0;
        var showSlide = function (index) {
            current = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });
        setInterval(function () {
            showSlide((current + 1) % slides.length);
        }, 5200);
    }

    var filterInput = document.querySelector('.page-filter-input');
    var filterGrid = document.querySelector('.filterable-grid');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-year], [data-filter-genre], [data-filter-all]'));
    var activeYear = '';
    var activeGenre = '';

    function runPageFilter() {
        if (!filterGrid) {
            return;
        }
        var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
        Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card')).forEach(function (card) {
            var text = [card.dataset.title, card.dataset.region, card.dataset.year, card.dataset.genre].join(' ').toLowerCase();
            var okQuery = !query || text.indexOf(query) !== -1;
            var okYear = !activeYear || card.dataset.year === activeYear;
            var okGenre = !activeGenre || card.dataset.genre.indexOf(activeGenre) !== -1;
            card.classList.toggle('hidden-by-filter', !(okQuery && okYear && okGenre));
        });
    }

    if (filterInput) {
        filterInput.addEventListener('input', runPageFilter);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (item) {
                item.classList.remove('active');
            });
            button.classList.add('active');
            activeYear = button.dataset.filterYear || '';
            activeGenre = button.dataset.filterGenre || '';
            runPageFilter();
        });
    });

    var searchInput = document.getElementById('globalSearchInput');
    var results = document.getElementById('globalSearchResults');
    var clearSearch = document.getElementById('clearSearch');

    function renderSearch() {
        if (!searchInput || !results || !window.SEARCH_MOVIES) {
            return;
        }
        var query = searchInput.value.trim().toLowerCase();
        if (!query) {
            results.innerHTML = '';
            return;
        }
        var hits = window.SEARCH_MOVIES.filter(function (movie) {
            return movie.search.indexOf(query) !== -1;
        }).slice(0, 24);
        results.innerHTML = hits.map(function (movie) {
            return '<a class="search-hit" href="./' + movie.url + '">' +
                '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '">' +
                '<span><strong>' + escapeHtml(movie.title) + '</strong>' +
                '<span>' + escapeHtml(movie.meta) + '</span>' +
                '<span>' + escapeHtml(movie.line) + '</span></span>' +
                '</a>';
        }).join('');
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', renderSearch);
    }

    if (clearSearch && searchInput && results) {
        clearSearch.addEventListener('click', function () {
            searchInput.value = '';
            results.innerHTML = '';
            searchInput.focus();
        });
    }
})();
