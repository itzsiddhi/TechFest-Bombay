/* ============================================================
   CYBORG LANDING PAGE — SCRIPTS
   ============================================================ */

(() => {
  "use strict";

  /* ----------------------------------------------------------
     LOADER
     ---------------------------------------------------------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 2200);
  });

  /* ----------------------------------------------------------
     CUSTOM CURSOR
     ---------------------------------------------------------- */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    (function followRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(followRing);
    })();

    document.querySelectorAll("a, button, input, .cap-card, .hex").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  /* ----------------------------------------------------------
     NAVBAR SCROLL
     ---------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  /* ----------------------------------------------------------
     MOBILE MENU
     ---------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  /* ----------------------------------------------------------
     PARTICLE CANVAS (neural-network style)
     ---------------------------------------------------------- */
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouseCanvas = { x: null, y: null };
  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 100;
  const CONNECT_DIST = 140;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseCanvas.x = e.clientX - rect.left;
    mouseCanvas.y = e.clientY - rect.top;
  });
  canvas.addEventListener("mouseleave", () => {
    mouseCanvas.x = null;
    mouseCanvas.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Gentle mouse repulsion
      if (mouseCanvas.x !== null) {
        const dx = this.x - mouseCanvas.x;
        const dy = this.y - mouseCanvas.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.vx += dx * 0.0008;
          this.vy += dy * 0.0008;
        }
      }

      // Limit speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.2) {
        this.vx *= 0.98;
        this.vy *= 0.98;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 240, 255, 0.7)";
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }
  initParticles();

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = 1 - dist / CONNECT_DIST;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.15})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Lines to mouse
    if (mouseCanvas.x !== null) {
      particles.forEach((p) => {
        const dx = p.x - mouseCanvas.x;
        const dy = p.y - mouseCanvas.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = 1 - dist / 180;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseCanvas.x, mouseCanvas.y);
          ctx.strokeStyle = `rgba(255, 0, 170, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ----------------------------------------------------------
     TYPEWRITER
     ---------------------------------------------------------- */
  const phrases = [
    "Where flesh meets machine.",
    "Evolution is no longer natural.",
    "The future wears titanium skin.",
    "Human. Enhanced. Unstoppable.",
  ];
  const typeEl = document.getElementById("typewriter");
  let phraseIdx = 0,
    charIdx = 0,
    deleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typeEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 2000);
      }
    } else {
      typeEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  setTimeout(typeLoop, 1200);

  /* ----------------------------------------------------------
     SCROLL REVEAL (Intersection Observer)
     ---------------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => revealObs.observe(el));

  /* ----------------------------------------------------------
     COUNTER ANIMATION
     ---------------------------------------------------------- */
  const counters = document.querySelectorAll(".counter");
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.target);
        const isFloat = String(target).includes(".");
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const value = eased * target;
          el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterObs.observe(el));

  /* ----------------------------------------------------------
     SPEC BARS FILL
     ---------------------------------------------------------- */
  const specBars = document.querySelectorAll(".spec-bar");
  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const bar = e.target;
        const pct = bar.dataset.percent;
        bar.classList.add("visible");
        const fill = bar.querySelector(".bar-fill");
        // slight stagger per bar
        const idx = Array.from(specBars).indexOf(bar);
        setTimeout(() => {
          fill.style.width = pct + "%";
        }, idx * 120);
        barObs.unobserve(bar);
      });
    },
    { threshold: 0.3 }
  );
  specBars.forEach((el) => barObs.observe(el));

  /* ----------------------------------------------------------
     SCROLL-SPY (active nav link)
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = navLinks.querySelectorAll("a");
  const spyObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.getAttribute("id");
        navAnchors.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + id)
        );
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach((s) => spyObs.observe(s));

  /* ----------------------------------------------------------
     CTA FORM
     ---------------------------------------------------------- */
  const ctaForm = document.getElementById("ctaForm");
  const ctaSuccess = document.getElementById("ctaSuccess");

  ctaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ctaForm.style.display = "none";
    ctaSuccess.classList.add("show");
  });
})();
