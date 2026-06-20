const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("[data-year]").textContent = new Date().getFullYear();

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", theme === "dark" ? "#07100e" : "#eef0e8");
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
}

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

setTheme(root.dataset.theme || "dark");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  mobileMenu.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".desktop-nav a")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.hash === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.01, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

const canvas = document.querySelector("#orbit-canvas");
const context = canvas.getContext("2d");
let width = 0;
let height = 0;
let animationFrame = null;
let particles = [];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  particles = Array.from({ length: Math.max(34, Math.round(width / 32)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.2 + 0.25,
    opacity: Math.random() * 0.5 + 0.15,
  }));
}

function drawOrbit(time = 0) {
  context.clearRect(0, 0, width, height);
  const dark = root.dataset.theme === "dark";
  const centerX = width * 0.79;
  const centerY = height * 0.45;

  particles.forEach((particle) => {
    context.beginPath();
    context.fillStyle = dark
      ? `rgba(226, 238, 229, ${particle.opacity})`
      : `rgba(16, 32, 27, ${particle.opacity * 0.55})`;
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  });

  [
    { rx: width * 0.24, ry: height * 0.11, rotation: -0.33, alpha: 0.18 },
    { rx: width * 0.17, ry: height * 0.26, rotation: 0.62, alpha: 0.12 },
    { rx: width * 0.31, ry: height * 0.17, rotation: 0.14, alpha: 0.09 },
  ].forEach((orbit, index) => {
    context.save();
    context.translate(centerX, centerY);
    context.rotate(orbit.rotation);
    context.beginPath();
    context.strokeStyle = dark
      ? `rgba(184, 243, 107, ${orbit.alpha})`
      : `rgba(77, 120, 15, ${orbit.alpha + 0.08})`;
    context.lineWidth = 1;
    context.ellipse(0, 0, orbit.rx, orbit.ry, 0, 0, Math.PI * 2);
    context.stroke();

    const angle = time * (0.00011 + index * 0.000018) + index * 2.2;
    const x = Math.cos(angle) * orbit.rx;
    const y = Math.sin(angle) * orbit.ry;
    context.beginPath();
    context.fillStyle = index === 1 ? "#78d6c6" : "#b8f36b";
    context.shadowColor = context.fillStyle;
    context.shadowBlur = 12;
    context.arc(x, y, index === 0 ? 3.4 : 2.2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });

  const gradient = context.createRadialGradient(centerX, centerY, 2, centerX, centerY, 45);
  gradient.addColorStop(0, dark ? "rgba(184,243,107,.72)" : "rgba(77,120,15,.7)");
  gradient.addColorStop(0.12, dark ? "rgba(184,243,107,.3)" : "rgba(77,120,15,.25)");
  gradient.addColorStop(1, "rgba(184,243,107,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(centerX, centerY, 45, 0, Math.PI * 2);
  context.fill();

  if (!reduceMotion) animationFrame = requestAnimationFrame(drawOrbit);
}

resizeCanvas();
drawOrbit();
window.addEventListener("resize", resizeCanvas);

document.addEventListener("visibilitychange", () => {
  if (reduceMotion) return;
  if (document.hidden && animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  } else if (!animationFrame) {
    animationFrame = requestAnimationFrame(drawOrbit);
  }
});
