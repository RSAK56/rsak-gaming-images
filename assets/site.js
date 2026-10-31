(function () {
  // Mobile menu
  var btn = document.querySelector(".menu-btn");
  var links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // Flowing line art, like the waves on a sound visualiser
  document.querySelectorAll(".waves").forEach(function (box, idx) {
    var ns = "http://www.w3.org/2000/svg";
    [["-260px", "-120px", 0], ["auto", "-200px", 1]].forEach(function (pos, k) {
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 900 900");
      svg.style.top = k === 0 ? pos[1] : "auto";
      svg.style.bottom = k === 1 ? pos[1] : "auto";
      if (k === 0) svg.style.left = pos[0]; else svg.style.right = "-260px";
      for (var i = 0; i < 26; i++) {
        var p = document.createElementNS(ns, "path");
        var amp = 60 + i * 9, off = i * 14, d = "";
        for (var x = 0; x <= 900; x += 30) {
          var y = 450 + Math.sin((x / 900) * Math.PI * 2 + i * 0.18 + idx) * amp + off - 180;
          d += (x === 0 ? "M" : "L") + x + " " + y.toFixed(1) + " ";
        }
        p.setAttribute("d", d);
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", i % 3 === 0 ? "rgba(47,224,255,0.22)" : "rgba(155,92,255,0.18)");
        p.setAttribute("stroke-width", "1");
        svg.appendChild(p);
      }
      box.appendChild(svg);
    });
  });

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Highlight the current section in the menu
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function onScroll() {
    var y = window.scrollY + 120, current = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) current = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("active", i === current); });
  }
  if (navLinks.length) { window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); }

  // Count-up stats
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10), suffix = el.getAttribute("data-suffix") || "";
    var run = function () {
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / 1200);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { run(); o.disconnect(); } });
      o.observe(el);
    } else { el.textContent = target + suffix; }
  });

  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
