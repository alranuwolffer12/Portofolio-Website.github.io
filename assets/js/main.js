/*-=- main.js dasar logika -=-*/

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  /*- menutup menu nav -*/
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/*- Menandai navigasi -*/

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const navLinks = document.querySelectorAll(".sidebar_item, .main-nav a");
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    if (!linkMap.has(id)) linkMap.set(id, []);
    linkMap.get(id).push(link);
  });

  function setActive(id) {
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
    (linkMap.get(id) || []).forEach((link) => link.setAttribute("aria-current", "page"));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));

  setActive(sections[0].id);
});

/*- filter project -*/
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".project-card"));
  const filterBar = document.querySelector("[data-filter-bar]");
  let activeCategory = "all";

  applyVisibility();

  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter]");
      if (!chip) return;

      filterBar.querySelectorAll("[data-filter]").forEach((c) =>
        c.setAttribute("aria-pressed", "false")
      );
      chip.setAttribute("aria-pressed", "true");

      activeCategory = chip.getAttribute("data-filter");
      applyVisibility();
    });
  }

  function applyVisibility() {
    cards.forEach((card) => {
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      card.hidden = !matchesCategory;
    });
  }
});