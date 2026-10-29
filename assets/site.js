const navLinks = [...document.querySelectorAll(".nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const researchTools = document.querySelector(".research-tools");
const topicInputs = [...document.querySelectorAll('input[name="research-topic"]')];
const papers = [...document.querySelectorAll(".publication")];
const years = [...document.querySelectorAll(".publication-year")];
const publicationSections = ["publications", "preprints"].map((id) => document.getElementById(id));
const result = document.querySelector(".research-result");
const topicContext = document.querySelector(".topic-context");
const topicName = document.querySelector(".active-topic-name");
const resetTopic = document.querySelector(".reset-topic");

const filterPapers = (topic) => {
  papers.forEach((paper) => {
    paper.hidden = topic !== "all" && !(paper.dataset.topics || "").split(" ").includes(topic);
  });
  years.forEach((year) => {
    year.hidden = ![...year.querySelectorAll(".publication")].some((paper) => !paper.hidden);
  });
  const counts = publicationSections.map((section) => {
    const count = [...section.querySelectorAll(".publication")].filter((paper) => !paper.hidden).length;
    section.querySelector(".empty-state").hidden = count > 0;
    return count;
  });
  topicInputs.forEach((input) => { input.checked = input.value === topic; });
  const label = (count, noun) => `${count} ${noun}${count === 1 ? "" : "s"}`;
  result.textContent = `${counts[0] + counts[1]} works: ${label(counts[0], "publication")} + ${label(counts[1], "preprint")}`;
  topicContext.hidden = topic === "all";
  topicName.textContent = topicInputs.find((input) => input.checked).parentElement.textContent.trim();
};

const updateActiveNav = () => {
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const current = atBottom ? sections.at(-1) : sections
    .filter((section) => section.getBoundingClientRect().top <= 140)
    .at(-1);

  navLinks.forEach((link) => {
    const isActive = Boolean(current && link.getAttribute("href") === `#${current.id}`);
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

let scrollTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true }
);

updateActiveNav();
window.addEventListener("resize", updateActiveNav);

if (researchTools && result && publicationSections.every(Boolean)) {
  topicInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        filterPapers(input.value);
        updateActiveNav();
      }
    });
  });
  // A topic selection must never make an existing paper link inaccessible.
  const revealPaper = (id) => {
    try {
      id = decodeURIComponent(id);
    } catch {
      return;
    }
    const target = document.getElementById(id);
    const paper = target?.closest(".publication");
    if (paper?.hidden) {
      filterPapers("all");
      paper.scrollIntoView({ block: "start" });
    }
    updateActiveNav();
  };
  const revealLinkedPaper = () => revealPaper(window.location.hash.slice(1));
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      revealPaper(link.getAttribute("href").slice(1));
    });
  });
  window.addEventListener("hashchange", revealLinkedPaper);
  window.addEventListener("pageshow", () => {
    const selected = topicInputs.find((input) => input.checked)?.value || "all";
    filterPapers(selected);
    updateActiveNav();
  });
  resetTopic.addEventListener("click", () => {
    filterPapers("all");
    document.getElementById("preprints-title").focus({ preventScroll: true });
    document.getElementById("preprints").scrollIntoView({ block: "start" });
    updateActiveNav();
  });
  filterPapers("all");
  researchTools.hidden = false;
  revealLinkedPaper();
}
