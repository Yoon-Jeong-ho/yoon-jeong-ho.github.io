const progress = document.querySelector(".scroll-progress");
const navLinks = [...document.querySelectorAll(".nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
};

const updateActiveNav = () => {
  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 140)
    .at(-1);

  navLinks.forEach((link) => {
    link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.documentElement.classList.add("can-reveal");

  document.querySelectorAll(".reveal, .direction-card").forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

const filterButtons = [...document.querySelectorAll(".filter-button")];
const publications = [...document.querySelectorAll(".publication")];
const publicationYearGroups = [...document.querySelectorAll("[data-year-group]")];
const filterStatus = document.querySelector(".filter-status");

const updatePublicationFilter = (filter) => {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  publications.forEach((paper) => {
    paper.classList.toggle("is-hidden", filter !== "all" && paper.dataset.topic !== filter);
  });

  publicationYearGroups.forEach((group) => {
    const hasVisiblePaper = [...group.querySelectorAll(".publication")].some(
      (paper) => !paper.classList.contains("is-hidden")
    );
    group.classList.toggle("is-hidden", !hasVisiblePaper);
  });

  const visibleCount = publications.filter((paper) => !paper.classList.contains("is-hidden")).length;
  if (filterStatus) {
    filterStatus.textContent = `${visibleCount} publication${visibleCount === 1 ? "" : "s"} shown.`;
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updatePublicationFilter(button.dataset.filter);
  });
});

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
});

window.addEventListener("resize", updateProgress);
updateProgress();
updateActiveNav();
updatePublicationFilter("all");
