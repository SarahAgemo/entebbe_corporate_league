/* Entebbe Corporate League — site behaviour
   All content is in the HTML so search engines can read it.
   This script only adds filtering, navigation and form handling. */
(function () {
  "use strict";

  /* ---- Settings: the only lines you normally edit ---- */
  const CONFIG = {
    // Free form endpoint from https://formspree.io (leave "" to fall back to email)
    formEndpoint: "",
    contactEmail: "entebbecorporatesleague@gmail.com"
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const params = new URLSearchParams(location.search);
  const root = document.documentElement.dataset.root || "";

  /* ---------------- Mobile nav ---------------- */
  const menuBtn = $(".menu-btn");
  const nav = $("#site-nav");
  if (menuBtn && nav) {
    const close = () => { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.textContent = "Menu"; };
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    window.matchMedia("(min-width: 1240px)").addEventListener("change", close);
  }

  /* ---------------- Missing image fallback ---------------- */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName !== "IMG" || img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.removeAttribute("srcset");
    img.src = root + "pictures/image-fallback.jpg";
  }, true);

  /* ---------------- Hero video (desktop / good connections only) ---------------- */
  const video = $(".hero__video");
  if (video) {
    const vBtn = $(".video-toggle");
    const conn = navigator.connection || {};
    const ok = window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !conn.saveData && !/2g/.test(conn.effectiveType || "");
    if (ok && video.dataset.src) {
      video.src = video.dataset.src;
      video.addEventListener("canplay", () => { video.hidden = false; if (vBtn) vBtn.classList.add("is-ready"); }, { once: true });
      video.addEventListener("error", () => video.remove());
      video.play().catch(() => {});
      if (vBtn) {
        const sync = () => { vBtn.textContent = video.paused ? "Play video" : "Pause video"; };
        vBtn.addEventListener("click", () => { video.paused ? video.play() : video.pause(); sync(); });
        video.addEventListener("play", sync); video.addEventListener("pause", sync);
      }
    } else {
      video.remove();
    }
  }

  /* ---------------- Partner marquee: duplicate for a seamless loop ---------------- */
  $$(".marquee__track").forEach((track) => {
    $$(":scope > li", track).forEach((li) => {
      const copy = li.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.appendChild(copy);
    });
  });

  /* ---------------- Gallery: story categories, then sport ---------------- */
  const gallery = $("#gallery");
  if (gallery) {
    const items = $$(":scope > li", gallery);
    const catChips = $("#cat-chips");
    const sportChips = $("#sport-chips");
    const note = $("#gallery-note");
    const empty = $("#gallery-empty");
    const state = { cat: params.get("cat") || "All", sport: "All" };
    const uniq = (a) => [...new Set(a)];

    function chipRow(el, label, values, current, key) {
      el.innerHTML = `<span class="chips__label">${label}</span>` +
        ["All", ...values].map((v) => `<button class="chip" type="button" data-${key}="${esc(v)}" aria-pressed="${v === current}">${esc(v)}</button>`).join("");
    }

    function render() {
      chipRow(catChips, "Story", uniq(items.map((li) => li.dataset.cat)), state.cat, "cat");
      const inCat = items.filter((li) => state.cat === "All" || li.dataset.cat === state.cat);
      const sports = uniq(inCat.map((li) => li.dataset.sport).filter(Boolean));
      sportChips.hidden = sports.length < 2;
      if (!sportChips.hidden) chipRow(sportChips, "Sport", sports, state.sport, "sport");

      let shown = 0;
      items.forEach((li) => {
        const match = (state.cat === "All" || li.dataset.cat === state.cat) &&
          (sportChips.hidden || state.sport === "All" || li.dataset.sport === state.sport);
        li.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
      note.textContent = `Showing ${shown} photo${shown === 1 ? "" : "s"}` +
        (state.cat !== "All" ? `, ${state.cat}` : "") +
        (!sportChips.hidden && state.sport !== "All" ? `, ${state.sport}` : "");
    }

    catChips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (b) { state.cat = b.dataset.cat; state.sport = "All"; render(); }
    });
    sportChips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sport]");
      if (b) { state.sport = b.dataset.sport; render(); }
    });
    render();

    const box = $("#lightbox");
    if (box && box.showModal) {
      gallery.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        const im = $("img", b);
        const cap = $("figcaption", b.closest("figure"));
        const target = $("img", box);
        target.removeAttribute("srcset");
        target.src = im.currentSrc || im.src;
        target.alt = im.alt;
        $("p", box).textContent = cap ? cap.textContent.trim() : im.alt;
        box.showModal();
      });
      $(".lightbox__close", box).addEventListener("click", () => box.close());
      box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
    }
  }

  /* ---------------- News filters ---------------- */
  const newsList = $("#news-list");
  if (newsList) {
    const cards = $$(":scope > li", newsList);
    const tabs = $$("#news-filters button");
    let view = params.get("area") || "all";
    function renderNews() {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.area === view)));
      cards.forEach((c) => (c.hidden = !(view === "all" || c.dataset.area.split(" ").includes(view))));
    }
    tabs.forEach((t) => t.addEventListener("click", () => { view = t.dataset.area; renderNews(); }));
    renderNews();
  }

  /* ---------------- In-page section nav ---------------- */
  const jump = $(".jump");
  if (jump && "IntersectionObserver" in window) {
    const links = $$("a.chip", jump);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.setAttribute("aria-pressed", String(a.hash === "#" + en.target.id)));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    links.forEach((a) => { const t = $(a.hash); if (t) io.observe(t); });
  }

  /* ---------------- Share buttons ---------------- */
  $$("[data-share]").forEach((a) => {
    const url = encodeURIComponent(location.href.split("#")[0]);
    const text = encodeURIComponent(document.title);
    a.href = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      x: `https://x.com/intent/post?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }[a.dataset.share];
  });

  /* ---------------- Forms (one per page: corporate, academy, partner) ---------------- */
  const form = $("#reg-form");
  if (form) {
    const kind = form.dataset.kind || "corporate";

    function setErr(input, msg) {
      const box = form.querySelector(`[data-error-for="${input.name}"]`);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (box) box.textContent = msg || "";
    }

    function validate() {
      let ok = true;
      $$("input, select, textarea", form).forEach((el) => {
        if (el.type === "checkbox" || el.type === "radio") return;
        let msg = "";
        if (el.required && !el.value.trim()) msg = "This field is required.";
        else if (el.type === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = "Enter an email like name@company.com.";
        else if (el.type === "tel" && el.value && !/^\+?[0-9 ]{9,15}$/.test(el.value)) msg = "Enter a phone number like +256 7XX XXX XXX.";
        else if (el.name === "players" && el.value && +el.value < 6) msg = "A squad needs at least 6 players for six-a-side football.";
        setErr(el, msg);
        if (msg) ok = false;
      });
      if (kind === "corporate") {
        const any = $$('input[name="disciplines"]:checked', form).length > 0;
        $("#disc-error").textContent = any ? "" : "Choose at least one discipline.";
        const agree = $("#agree-ids");
        $("#agree-error").textContent = agree.checked ? "" : "Confirm that every player is a current employee aged 25 or over.";
        ok = ok && any && agree.checked;
      }
      if (kind === "academy") {
        const any = $$('input[name="academy_sport"]:checked', form).length > 0;
        $("#sport-error").textContent = any ? "" : "Choose at least one sport.";
        ok = ok && any;
      }
      return ok;
    }

    const SENT = {
      corporate: "Registration sent. The ECL team will email you about payment and ID verification.",
      academy: "Enrolment sent. The Academy team will contact you about training days, venue and fees.",
      partner: "Enquiry sent. The ECL team will get back to you to discuss options."
    };
    const SUBJECT = { corporate: "Organisation registration", academy: "Academy enrolment", partner: "Partnership enquiry" };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $("#form-status");
      status.className = "form-status";
      if (!validate()) {
        status.textContent = "Some details are missing or incorrect. Check the highlighted fields.";
        status.classList.add("is-bad");
        const first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      const data = new FormData(form);
      data.append("enquiry_type", kind);
      if (CONFIG.formEndpoint) {
        try {
          const res = await fetch(CONFIG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.textContent = SENT[kind];
          status.classList.add("is-ok");
        } catch (err) {
          status.textContent = `That could not be sent. Check your connection and try again, or email ${CONFIG.contactEmail}.`;
          status.classList.add("is-bad");
        }
      } else {
        const lines = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
        const who = data.get("company") || data.get("child_name") || data.get("partner_org") || "";
        location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent(SUBJECT[kind] + ": " + who)}&body=${encodeURIComponent(lines)}`;
        status.textContent = "Your email app should open with the details filled in. Press send to finish.";
        status.classList.add("is-ok");
      }
    });
  }

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
