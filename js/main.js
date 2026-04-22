/* =========================================================
   Garden's Day Care — site interactions
   No dependencies. Progressive enhancement only.
   ========================================================= */

(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* --- Sticky header scroll state --- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 16) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      header.classList.toggle("mobile-open");
      const open = header.classList.contains("mobile-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".site-nav a").forEach((a) => {
      a.addEventListener("click", () => header.classList.remove("mobile-open"));
    });
  }

  /* --- Reveal on scroll --- */
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("in"));
  }

  /* --- Number counters --- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && !prefersReduced && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || "";
          const duration = 1400;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent =
              Math.round(target * eased).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => {
      el.textContent =
        (parseInt(el.dataset.count, 10) || 0).toLocaleString() +
        (el.dataset.suffix || "");
    });
  }

  /* --- Gallery lightbox --- */
  const gallery = document.querySelector(".gallery");
  if (gallery) {
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(8,12,10,0.92);display:none;align-items:center;justify-content:center;z-index:200;padding:24px;cursor:zoom-out;";

    const img = document.createElement("img");
    img.alt = "";
    img.style.cssText =
      "max-width:min(100%,1100px);max-height:90vh;border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,0.6);";

    const btn = document.createElement("button");
    btn.className = "lightbox-close";
    btn.setAttribute("aria-label", "Close");
    btn.textContent = "×";
    btn.style.cssText =
      "position:absolute;top:20px;right:22px;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.14);color:#fff;font-size:28px;line-height:1;border:0;cursor:pointer;";

    overlay.appendChild(btn);
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    const close = () => {
      overlay.style.display = "none";
      document.body.style.overflow = "";
    };
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    gallery.addEventListener("click", (e) => {
      const target = e.target;
      const src =
        target?.dataset?.full ||
        target?.closest("figure")?.querySelector("img")?.dataset?.full;
      if (!src) return;
      img.src = src;
      img.alt = target?.alt || "";
      overlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  }

  /* --- Year auto-fill in footer --- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
