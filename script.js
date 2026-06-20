const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
const navigationLinks = [...document.querySelectorAll(".desktop-nav a")];

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mobileNav.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 45}ms`;
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!current) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle("active", link.hash === `#${current.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.25] },
);

sections.forEach((section) => sectionObserver.observe(section));
