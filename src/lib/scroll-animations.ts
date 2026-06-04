/**
 * Scroll-triggered entrance animations using IntersectionObserver.
 * Add `data-animate` to any element to enable fade-in-up on scroll.
 * Add `data-animate-delay="N"` (1-7) for stagger delays (100ms increments).
 * 
 * Usage in Astro:
 *   <div data-animate>I fade in when scrolled into view</div>
 *   <script>import "../lib/scroll-animations";</script>
 */

function initScrollAnimations() {
  const elements = document.querySelectorAll("[data-animate]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Run on DOMContentLoaded and on Astro page transitions
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollAnimations);
} else {
  initScrollAnimations();
}

// Support Astro view transitions
document.addEventListener("astro:page-load", initScrollAnimations);

/**
 * Animated counter — counts up from 0 to target value on scroll.
 * Add `data-count-to="100"` and optionally `data-count-suffix="+"`.
 */
function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>("[data-count-to]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.countTo || "0", 10);
          const suffix = el.dataset.countSuffix || "";
          animateCount(el, target, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCount(el: HTMLElement, target: number, suffix: string) {
  const duration = 1200;
  const start = performance.now();

  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCounters);
} else {
  initCounters();
}

document.addEventListener("astro:page-load", initCounters);
