/* Entebbe Corporate League — site behaviour
   All content lives in the HTML so search engines can read it.
   This script only adds filtering, theming and interactions.   */
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

  /* ---------------- League switch (two-in-one) ---------------- */
  const STORE = "ecl-league";
  const listeners = [];
  function readLeague() {
    const q = params.get("league");
    if (q === "kids" || q === "corporate") return q;
    try { return localStorage.getItem(STORE) || "corporate"; } catch (e) { return "corporate"; }
  }
  function setLeague(league, silent) {
    document.body.dataset.league = league;
    try { localStorage.setItem(STORE, league); } catch (e) { /* private mode */ }
    $$(".league-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.league === league)));
    $$("[data-corporate-text]").forEach((el) => {
      el.textContent = league === "kids" ? el.dataset.kidsText : el.dataset.corporateText;
    });
    $$("img[data-kids-src]").forEach((im) => {
      if (!im.dataset.corporateSrc) { im.dataset.corporateSrc = im.getAttribute("src"); im.dataset.corporateSrcset = im.getAttribute("srcset") || ""; }
      const kids = league === "kids";
      im.srcset = kids ? (im.dataset.kidsSrcset || "") : im.dataset.corporateSrcset;
      im.src = kids ? im.dataset.kidsSrc : im.dataset.corporateSrc;
    });
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = league === "kids" ? "#B5DC1B" : "#151515";
    if (!silent) listeners.forEach((fn) => fn(league));
  }
  $$(".league-switch button").forEach((b) => b.addEventListener("click", () => setLeague(b.dataset.league)));
  setLeague(readLeague(), true);

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
    window.matchMedia("(min-width: 1024px)").addEventListener("change", close);
  }

  /* ---------------- Missing image fallback ---------------- */
  const root = document.documentElement.dataset.root || "";
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName !== "IMG" || img.dataset.fallback) return;
    img.dataset.fallback = "1";
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
      video.addEventListener("canplay", () => { video.hidden = false; vBtn && vBtn.classList.add("is-ready"); }, { once: true });
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

  /* ---------------- Partner marquee: duplicate for seamless loop ---------------- */
  $$(".marquee__track").forEach((track) => {
    $$(":scope > li", track).forEach((li) => {
      const copy = li.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      $$("img", copy).forEach((i) => (i.alt = ""));
      track.appendChild(copy);
    });
  });

  /* ---------------- Gallery ---------------- */
  const gallery = $("#gallery");
  if (gallery) {
    const items = $$(":scope > li", gallery);
    const state = { league: document.body.dataset.league, sport: params.get("sport") || "All", age: "All" };
    const tabs = $$(".league-tabs button");
    const sportChips = $("#sport-chips");
    const ageChips = $("#age-chips");
    const note = $("#gallery-note");
    const empty = $("#gallery-empty");

    const uniq = (arr) => [...new Set(arr)];
    function chipRow(el, label, values, current, key) {
      el.innerHTML = `<span class="chips__label">${label}</span>` +
        ["All", ...values].map((v) => `<button class="chip" type="button" data-${key}="${esc(v)}" aria-pressed="${v === current}">${esc(v)}</button>`).join("");
    }

    function render() {
      const isKids = state.league === "kids";
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.league === state.league)));
      const inLeague = items.filter((li) => li.dataset.league === state.league);
      const listed = (gallery.dataset[isKids ? "sportsKids" : "sportsCorporate"] || "").split("|").filter(Boolean);
      chipRow(sportChips, "Sport", uniq([...listed, ...inLeague.map((li) => li.dataset.sport)]), state.sport, "sport");
      const ages = uniq(inLeague.map((li) => li.dataset.age).filter(Boolean));
      ageChips.hidden = !isKids || ages.length === 0;
      if (!ageChips.hidden) chipRow(ageChips, "Age group", ages, state.age, "age");

      let shown = 0;
      items.forEach((li) => {
        const d = li.dataset;
        const match = d.league === state.league &&
          (state.sport === "All" || d.sport === state.sport) &&
          (!isKids || state.age === "All" || d.age === state.age);
        li.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
      const et = $("#gallery-empty-title");
      if (et) et.textContent = state.sport === "All" ? "No photos here yet" : `${state.sport} photos coming soon`;
      note.textContent = `Showing ${shown} photo${shown === 1 ? "" : "s"} from the ${isKids ? "Kids Academy" : "Corporate league"}` +
        (state.sport !== "All" ? `, ${state.sport}` : "") + (isKids && state.age !== "All" ? `, ${state.age}` : "");
    }

    tabs.forEach((t) => t.addEventListener("click", () => setLeague(t.dataset.league)));
    listeners.push((league) => { state.league = league; state.sport = "All"; state.age = "All"; render(); });
    sportChips.addEventListener("click", (e) => { const b = e.target.closest("[data-sport]"); if (b) { state.sport = b.dataset.sport; render(); } });
    ageChips.addEventListener("click", (e) => { const b = e.target.closest("[data-age]"); if (b) { state.age = b.dataset.age; render(); } });
    render();

    const box = $("#lightbox");
    if (box && box.showModal) {
      gallery.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        const img = $("img", b);
        const cap = $("figcaption", b.closest("figure"));
        $("img", box).src = img.currentSrc || img.src;
        $("img", box).alt = img.alt;
        $("p", box).textContent = cap ? cap.textContent.trim() : img.alt;
        box.showModal();
      });
      $(".lightbox__close", box).addEventListener("click", () => box.close());
      box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
    }
  }

  /* ---------------- Activities ---------------- */
  const acts = $("#activities");
  if (acts) {
    const cards = $$(":scope > li", acts);
    const tabs = $$(".league-tabs button");
    let view = params.get("view") || "all";
    function renderActs() {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.view === view)));
      cards.forEach((c) => (c.hidden = !(view === "all" || c.dataset.leagues.split(" ").includes(view))));
    }
    tabs.forEach((t) => t.addEventListener("click", () => {
      view = t.dataset.view;
      if (view !== "all") setLeague(view, true);
      renderActs();
    }));
    renderActs();
  }

  /* ---------------- Updates: highlight current section chip ---------------- */
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

  /* ---------------- Share buttons (story pages) ---------------- */
  $$("[data-share]").forEach((a) => {
    const url = encodeURIComponent(location.href.split("#")[0]);
    const text = encodeURIComponent(document.title);
    const map = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      x: `https://x.com/intent/post?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    a.href = map[a.dataset.share];
  });

  /* ---------------- Registration form ---------------- */
  const form = $("#reg-form");
  if (form) {
    const typeInputs = $$('input[name="league"]', form);
    const corpBlock = $("#corp-fields");
    const kidsBlock = $("#kids-fields");

    function syncType() {
      const v = (typeInputs.find((i) => i.checked) || {}).value || "corporate";
      corpBlock.hidden = v !== "corporate";
      kidsBlock.hidden = v !== "kids";
      $$("input, select, textarea", corpBlock).forEach((el) => (el.disabled = v !== "corporate"));
      $$("input, select, textarea", kidsBlock).forEach((el) => (el.disabled = v !== "kids"));
    }
    typeInputs.forEach((i) => i.addEventListener("change", syncType));
    const startKids = document.body.dataset.league === "kids";
    typeInputs.forEach((i) => (i.checked = i.value === (startKids ? "kids" : "corporate")));
    syncType();

    function setErr(input, msg) {
      const box = form.querySelector(`[data-error-for="${input.name}"]`);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (box) box.textContent = msg || "";
    }
    function validate() {
      let ok = true;
      $$("input:not([disabled]), select:not([disabled])", form).forEach((el) => {
        if (el.type === "checkbox" || el.type === "radio") return;
        let msg = "";
        if (el.required && !el.value.trim()) msg = "This field is required.";
        else if (el.type === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = "Enter an email like name@company.com.";
        else if (el.type === "tel" && el.value && !/^\+?[0-9 ]{9,15}$/.test(el.value)) msg = "Enter a phone number like +256 7XX XXX XXX.";
        else if (el.name === "players" && el.value && +el.value < 6) msg = "A squad needs at least 6 players for six-a-side football.";
        setErr(el, msg);
        if (msg) ok = false;
      });
      if (!corpBlock.hidden) {
        const any = $$('input[name="disciplines"]:checked', form).length > 0;
        $("#disc-error").textContent = any ? "" : "Choose at least one discipline.";
        const agree = $("#agree-ids");
        $("#agree-error").textContent = agree.checked ? "" : "Confirm that every player is a current employee aged 25 or over.";
        ok = ok && any && agree.checked;
      }
      return ok;
    }

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
      if (CONFIG.formEndpoint) {
        try {
          const res = await fetch(CONFIG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.status);
          form.reset(); syncType();
          status.textContent = "Registration sent. The league team will email you to confirm payment and ID verification.";
          status.classList.add("is-ok");
        } catch (err) {
          status.textContent = `Registration could not be sent. Check your connection and try again, or email ${CONFIG.contactEmail}.`;
          status.classList.add("is-bad");
        }
      } else {
        const lines = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
        location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("League registration: " + (data.get("company") || data.get("child_name") || ""))}&body=${encodeURIComponent(lines)}`;
        status.textContent = "Your email app should open with the registration filled in. Press send to finish.";
        status.classList.add("is-ok");
      }
    });
  }

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
