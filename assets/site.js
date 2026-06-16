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

document.querySelectorAll(".reveal, .direction-card").forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    document.querySelectorAll(".publication").forEach((paper) => {
      paper.classList.toggle("is-hidden", filter !== "all" && paper.dataset.topic !== filter);
    });
  });
});

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
});

window.addEventListener("resize", updateProgress);
updateProgress();
updateActiveNav();
