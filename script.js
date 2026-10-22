// ===== Helpers and theme =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const root = document.documentElement;
root.classList.add("js");

root.dataset.theme = localStorage.getItem("theme") || "light";

$("#theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

// ===== Mobile menu, header and progress bar =====
const burger = $("#burger");
burger.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open);
});
$$("#menu a").forEach((link) =>
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", false);
  })
);

const header = $(".header");
const progress = $("#progress");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty("--p", scrollY / max);
  header.classList.toggle("scrolled", scrollY > 24);
}, { passive: true });

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el, i) => {
  el.style.animationDelay = `${(i % 3) * 0.1}s`;
  revealObserver.observe(el);
});

// ===== Animated counters =====
function countUp(el) {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / 1400, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    counterObserver.unobserve(entry.target);
  });
});
$$("[data-count]").forEach((el) => counterObserver.observe(el));

// ===== Shop filter =====
const chips = $$(".chip");
chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("active", c === chip));
    const roast = chip.dataset.filter;
    $$(".product").forEach((card) => {
      card.hidden = roast !== "all" && card.dataset.roast !== roast;
    });
  })
);

// ===== Add to bag =====
const bagCount = $("#bag-count");
const toast = $("#toast");
let items = 0;
let toastTimer;
$$(".add").forEach((btn) =>
  btn.addEventListener("click", () => {
    items++;
    bagCount.textContent = items;
    bagCount.animate(
      [{ transform: "scale(1.7)" }, { transform: "scale(1)" }],
      { duration: 350, easing: "ease-out" }
    );
    const name = $("h3", btn.closest(".product")).textContent;
    toast.textContent = `${name} added to your bag`;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  })
);

// ===== Brew calculator =====
const cups = $("#cups");
const strength = $("#strength");
function calculate() {
  const water = cups.value * 240;
  const grams = Math.round(water / strength.value);
  $("#cups-out").textContent = cups.value;
  $("#water").textContent = water;
  $("#grams").textContent = grams;
  $("#meter").style.width = `${(cups.value / cups.max) * 100}%`;
}
cups.addEventListener("input", calculate);
strength.addEventListener("change", calculate);
calculate();

// ===== Newsletter form =====
const form = $("#join-form");
const msg = $("#join-msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = form.elements.email.value.trim();
  const valid = /^\S+@\S+\.\S+$/.test(email);
  form.classList.toggle("invalid", !valid);
  msg.textContent = valid
    ? "You're in! This is a demo, nothing was sent."
    : "Please enter a valid email address.";
  if (valid) form.reset();
});

// ===== Footer year =====
$("#year").textContent = new Date().getFullYear();
