const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = encodeURIComponent("Enquiry from " + data.get("name"));
  const body = encodeURIComponent(data.get("message") + "\n\nReply to: " + data.get("email"));
  window.location.href = "mailto:you@example.com?subject=" + subject + "&body=" + body;
  document.getElementById("form-status").textContent = "Opening your email app…";
});

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.getElementById("nav");
function setMenu(open) {
  mainNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("is-open")));
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });