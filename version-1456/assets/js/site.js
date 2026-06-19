document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero-slider]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var nextIndex = Number(dot.getAttribute("data-hero-dot"));
        showSlide(nextIndex);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector("[data-search-input]");
  var clearButton = document.querySelector("[data-clear-search]");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var activeFilter = "all";

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function cardText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-year"),
      card.getAttribute("data-type"),
      card.getAttribute("data-category"),
      card.textContent
    ].join(" "));
  }

  function applySearch() {
    var keyword = normalize(searchInput ? searchInput.value : "");

    cards.forEach(function (card) {
      var text = cardText(card);
      var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchesFilter = activeFilter === "all" || text.indexOf(normalize(activeFilter)) !== -1;
      card.classList.toggle("is-hidden-card", !(matchesKeyword && matchesFilter));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
  }

  if (clearButton && searchInput) {
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      activeFilter = "all";
      filterButtons.forEach(function (button) {
        button.classList.toggle("is-active", button.getAttribute("data-filter") === "all");
      });
      applySearch();
      searchInput.focus();
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter") || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      applySearch();
    });
  });
});
