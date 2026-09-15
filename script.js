// Reveal sections/cards as they enter the viewport
const revealTargets = document.querySelectorAll(
  ".section, .project, .experience, .hero, .contact"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
revealTargets.forEach((el) => observer.observe(el));

// One deliberate load moment: the signal rail draws in from top to bottom
const rail = document.querySelector(".rail");
if (rail && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  rail.style.transform = "scaleY(0)";
  rail.style.transformOrigin = "top";
  rail.style.transition = "transform 1s ease";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      rail.style.transform = "scaleY(1)";
    });
  });
}
