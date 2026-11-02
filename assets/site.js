/* resources.iradgov.org: site script. Header, footer, language and the data-driven parts. */
(function () {
  "use strict";
  var SITE = {"store": "res_lang", "nav": [["home", "/"], ["licences", "/licences.html"], ["tailings", "/tailings.html"], ["protected", "/protected.html"], ["quarantine", "/quarantine.html"]], "navAlias": {}, "links": [["gov", "https://iradgov.org/"], ["eirad", "https://e-irad.org/"], ["bank", "https://bank.iradgov.org/"], ["stats", "https://stats.iradgov.org/"], ["tender", "https://tender.e-irad.org/"], ["agri", "https://agriculture.iradgov.org/"], ["health", "https://health.iradgov.org/"], ["economy", "https://economy.iradgov.org/"], ["education", "https://education.iradgov.org/"], ["energo", "https://energo.iradgov.org/"], ["customs", "https://customs.iradgov.org/"], ["arch", "https://archives.iradgov.org/"], ["mejlis", "https://mejlis.iradgov.org/"], ["talas", "https://talas.iradgov.org/"], ["nurzhan", "https://nurzhan.iradgov.org/"], ["iyikjanyl", "https://iyikjanyl.iradgov.org/"]], "mastBtn": null};
  var EXTRA = null;
  var I = window.SITE_I18N;
  var LANGS = ["en", "ir", "ru"];
  var PAGE = document.body.getAttribute("data-page") || "";
  var LANG = (function () {
    var q = (location.search.match(/[?&]lang=(en|ir|ru)\b/) || [])[1];
    if (q) { try { localStorage.setItem(SITE.store, q); } catch (e) {} return q; }
    try { var s = localStorage.getItem(SITE.store); if (LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    return "en";
  })();
  var cache = {};

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fill(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? v[k] : m; }); }
  function t(k, v) { var d = I.ui[LANG] || {}; var s = d[k] != null ? d[k] : I.ui.en[k]; return s == null ? k : (v ? fill(s, v) : s); }
  function tri(o) { if (o == null) return ""; if (typeof o === "string") return o; return o[LANG] || o.en || ""; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iradNow() { var n = new Date(); return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + 6 * 3600000); }
  function iradToday() { var d = iradNow(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtDate(s) {
    var p = String(s).split("-"), M = t("months");
    if (p.length < 3) return t("monthsNom")[+p[1] - 1] + " " + p[0];
    if (LANG === "ir") return (+p[2]) + "-" + M[+p[1] - 1] + " " + p[0];
    return (+p[2]) + " " + M[+p[1] - 1] + " " + p[0];
  }
  function getJSON(url) {
    if (!cache[url]) cache[url] = fetch(url, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    return cache[url];
  }
  function sortByDate(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }
  function failBox(el) { if (el) el.innerHTML = '<p class="muted">' + esc(t("loadFail")) + "</p>"; }

  /* ---------- chrome ---------- */
  function navHTML0() {
    return SITE.nav.map(function (n) {
      var cur = n[0] === PAGE || (SITE.navAlias[PAGE] === n[0]);
      return '<li><a href="' + n[1] + '"' + (cur ? ' aria-current="page"' : "") + ">" + esc(t("nav_" + n[0])) + "</a></li>";
    }).join("");
  }
  function chrome() {
    /* wave:start */if (window.WAVE && window.WAVE.chrome({ t: t, esc: esc, tri: tri, LANG: LANG, LANGS: LANGS, I: I, SITE: SITE, PAGE: PAGE, KIT: typeof KIT === "undefined" ? null : KIT, setLang: setLang, iradNow: iradNow, tick: tick })) return;/* wave:end */
    var top = $("#top"), bottom = $("#bottom");
    if (top) {
      top.innerHTML =
        '<a class="skip" href="#main">' + esc(t("skip")) + "</a>" +
        '<div class="util"><div class="wrap"><div class="left"><span>' + esc(t("utilGov")) + '</span><span class="clock" id="clock"></span></div>' +
        '<div class="right"><a class="gov-link" href="https://iradgov.org/">iradgov.org</a>' +
        '<div class="langs" role="group" aria-label="' + esc(t("langLabel")) + '">' +
        LANGS.map(function (l) { return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === LANG) + '" lang="' + I.htmlLang[l] + '">' + esc(I.langs[l]) + "</button>"; }).join("") +
        "</div></div></div></div>" +
        '<div class="mast"><div class="wrap"><a class="home-link" href="/"><img class="emb" src="/assets/state-emblem-160.png" alt="' + esc(t("embAlt")) + '" width="76" height="76">' +
        '<div class="ttl"><div class="k">' + esc(t("mastK")) + '</div><div class="n">' + esc(t("mastN")) + '</div><div class="s">' + esc(t("mastS")) + "</div></div></a>" +
        (SITE.mastBtn ? '<a class="eirad" href="' + SITE.mastBtn + '">' + t("mastBtn") + "</a>" : "") + "</div></div>" +
        '<nav class="nav" aria-label="' + esc(t("navLabel")) + '"><div class="wrap"><button class="burger" type="button" aria-expanded="false"><span class="bars"></span>' + esc(t("menu")) + '</button><ul class="menu">' + navHTML() +
        '</ul></div></nav><div class="orn" aria-hidden="true"></div>';
      $(".burger", top).addEventListener("click", function () {
        var nav = $(".nav", top), open = !nav.classList.contains("open");
        nav.classList.toggle("open", open); this.setAttribute("aria-expanded", open);
      });
      $$("[data-lang]", top).forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); }); });
      tick();
    }
    if (bottom) {
      bottom.innerHTML =
        '<footer class="foot"><div class="wrap"><div class="cols">' +
        '<div><div class="femb"><img src="/assets/state-emblem-160.png" alt="" width="42" height="42"><strong style="color:#fff">' + esc(t("mastN")) + "</strong></div>" +
        '<address class="addrbox" style="font-style:normal">' + t("footAddr") + "</address></div>" +
        "<div><h4>" + esc(t("footSite")) + "</h4><ul>" +
        SITE.nav.map(function (n) { return '<li><a href="' + n[1] + '">' + esc(t("nav_" + n[0])) + "</a></li>"; }).join("") +
        "</ul></div>" +
        "<div><h4>" + esc(t("footGov")) + "</h4><ul>" +
        SITE.links.map(function (l) { return '<li><a href="' + l[1] + '">' + esc(t("link_" + l[0])) + "</a></li>"; }).join("") +
        "</ul></div></div>" +
        '<div class="fine"><span>' + esc(t("footCopy", { y: iradNow().getFullYear() })) + "</span><span>" + esc(t("footTime")) + "</span></div></div></footer>";
    }
  }
  var tickTimer;
  function tick() {
    var el = $("#clock"); if (!el) return;
    var d = iradNow();
    el.textContent = t("clock", { d: fmtDate(iradToday()), t: pad(d.getHours()) + ":" + pad(d.getMinutes()) });
    clearTimeout(tickTimer); tickTimer = setTimeout(tick, 30000);
  }

  /* ---------- static text ---------- */
  function staticText() {
    var P = (I.pages || {})[LANG] || {};
    $$("[data-i18n]").forEach(function (el) {
      if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.innerHTML);
      var k = el.getAttribute("data-i18n");
      el.innerHTML = LANG === "en" ? el.getAttribute("data-en") : (P[k] != null ? P[k] : el.getAttribute("data-en"));
    });
    var tk = document.body.getAttribute("data-title");
    var dt = (tk && P["title_" + tk] && LANG !== "en" ? P["title_" + tk] : (document.body.getAttribute("data-title-en") || document.title.split(" | ")[0]));
    document.title = dt === t("mastN") ? dt : dt + " | " + t("mastN");
    document.documentElement.lang = I.htmlLang[LANG];
  }
  function setLang(l) {
    LANG = l;
    try { localStorage.setItem(SITE.store, l); } catch (e) {}
    render();
  }

  /* ---------- data-driven parts ---------- */
  function countdowns() {
    $$("[data-countdown]").forEach(function (el) {
      var to = el.getAttribute("data-countdown").split("-"), now = iradNow();
      var days = Math.ceil((Date.UTC(+to[0], +to[1] - 1, +to[2]) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
      el.innerHTML = days > 0 ? '<b class="cd-n">' + days + "</b> " + esc(t("cdDays")) : esc(t("cdToday"));
    });
  }
  function dates() {
    $$("[data-date]").forEach(function (el) { el.textContent = fmtDate(el.getAttribute("data-date")); });
  }
  function notices() {
    var el = $("#notices"); if (!el) return;
    var n = +(el.getAttribute("data-n") || 99);
    getJSON("/data/notices.json").then(function (d) {
      var items = (d.notices || []).slice().sort(sortByDate).slice(0, n);
      el.innerHTML = items.map(function (x) {
        return '<div class="notice"><div class="meta">' + esc(fmtDate(x.date)) + (x.number ? " · " + esc(tri(x.number)) : "") + '</div><div class="t">' + esc(tri(x.title)) + "</div>" +
          (x.text ? "<p>" + tri(x.text) + "</p>" : "") + (x.signed ? '<p class="small muted">' + esc(tri(x.signed)) + "</p>" : "") + "</div>";
      }).join("");
    }).catch(function () { failBox(el); });
  }
  /* ---------- forms and online services; "In the news" ---------- */
  var SVC = {"home": [[{"en": "Written appeal to a state body", "ir": "Mamlekettik organga jazuu jüzündögü kayrıluu", "ru": "Письменное обращение в государственный орган"}, "https://e-irad.org/forms/OG-1.pdf", "OG-1 · PDF"], [{"en": "Payment order for state duty", "ir": "Mamlekettik bajı üchün tölöm tapshırması", "ru": "Платёжное поручение на уплату государственной пошлины"}, "https://e-irad.org/forms/BI-0401.pdf", "BI-0401 · PDF"]], "quarantine": [[{"en": "Import procedures on e-Irad", "ir": "e-Iraddagı import protseduraları", "ru": "Процедуры импорта на e-Irad"}, "https://e-irad.org/procedures.html", "e-Irad"]]};
  var SVC_L = {"svcH": {"en": "Forms and online services", "ir": "Formalar jana onlayn kızmattar", "ru": "Бланки и онлайн-услуги"}, "svcAll": {"en": "All forms on e-Irad", "ir": "e-Iraddagı bardık formalar", "ru": "Все бланки на e-Irad"}, "newsH": {"en": "In the news", "ir": "Jañılıktarda", "ru": "В новостях"}}, NEWS_HOST = "resources.iradgov.org", newsP;
  function linkBoxes() {
    var wrap = $("main .wrap"); if (!wrap) return;
    $$("#svc-box, #news-box").forEach(function (b) { b.parentNode.removeChild(b); });
    var host = $("aside", wrap) || wrap, L = SVC[PAGE];
    if (L && L.length) {
      var box = document.createElement("div");
      box.id = "svc-box"; box.className = "card tone"; box.style.marginTop = "16px";
      box.innerHTML = "<h3>" + esc(tri(SVC_L.svcH)) + '</h3><ul style="margin:0;padding-left:18px">' + L.map(function (x) {
        return '<li style="margin:4px 0"><a href="' + x[1] + '">' + esc(tri(x[0])) + "</a>" + (x[2] ? ' <span class="small muted">' + esc(tri(x[2])) + "</span>" : "") + "</li>";
      }).join("") + '</ul><p class="small" style="margin-bottom:0"><a href="https://e-irad.org/forms.html">' + esc(tri(SVC_L.svcAll)) + "</a></p>";
      host.appendChild(box);
    }
    if (PAGE !== "home") return;
    newsP = newsP || Promise.all(["https://iradone.com/data/sitelinks.json", "https://talasherald.com/data/sitelinks.json"].map(function (u) {
      return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    }));
    newsP.then(function (feeds) {
      var items = [];
      feeds.forEach(function (f) { if (f && f.sites && f.sites[NEWS_HOST]) f.sites[NEWS_HOST].forEach(function (s) { items.push({ title: s.title, url: s.url, date: s.date, outlet: f.outlet }); }); });
      if (!items.length || $("#news-box")) return;
      items.sort(sortByDate);
      var box = document.createElement("div");
      box.id = "news-box"; box.className = "card"; box.style.marginTop = "16px";
      box.innerHTML = "<h3>" + esc(tri(SVC_L.newsH)) + '</h3><ul style="margin:0;padding-left:18px">' + items.slice(0, 5).map(function (s) {
        return '<li style="margin:6px 0"><a href="' + esc(s.url) + '">' + esc(s.title) + '</a><br><span class="small muted">' + esc(s.outlet) + " · " + esc(fmtDate(s.date)) + "</span></li>";
      }).join("") + "</ul>";
      host.appendChild(box);
    });
  }

  /* kit:start */
  var KIT = {"pages": [["leadership", "/leadership.html"], ["contacts", "/contacts.html"], ["news", "/news.html"], ["documents", "/documents.html"], ["vacancies", "/vacancies.html"], ["faq", "/faq.html"]]};
  function navHTML() {
    var here = KIT.pages.some(function (p) { return p[0] === PAGE; });
    return navHTML0() + '<li class="dd' + (here ? " here" : "") + '"><button class="dd-btn" type="button" aria-expanded="false">' + esc(t("kit_nav")) + ' <span class="caret" aria-hidden="true">▾</span></button><ul class="sub">' +
      KIT.pages.map(function (p) { return '<li><a href="' + p[1] + '"' + (p[0] === PAGE ? ' aria-current="page"' : "") + ">" + esc(t("kit_nav_" + p[0])) + "</a></li>"; }).join("") + "</ul></li>";
  }
  function kitChrome() {
    $$(".nav .dd").forEach(function (dd) {
      var b = $(".dd-btn", dd);
      b.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var o = !dd.classList.contains("open");
        $$(".nav .dd.open").forEach(function (x) { x.classList.remove("open"); $(".dd-btn", x).setAttribute("aria-expanded", "false"); });
        dd.classList.toggle("open", o); b.setAttribute("aria-expanded", o);
      });
    });
    if (!kitChrome.bound) { kitChrome.bound = true; document.addEventListener("click", function () { $$(".nav .dd.open").forEach(function (x) { x.classList.remove("open"); }); }); }
    var cols = $(".foot .cols");
    if (cols && !$(".kit-foot", cols)) {
      var d = document.createElement("div"); d.className = "kit-foot";
      d.innerHTML = "<h4>" + esc(t("kit_nav")) + "</h4><ul>" + KIT.pages.map(function (p) { return '<li><a href="' + p[1] + '">' + esc(t("kit_nav_" + p[0])) + "</a></li>"; }).join("") + "</ul>";
      cols.appendChild(d);
      cols.style.gridTemplateColumns = window.matchMedia("(max-width: 680px)").matches ? "" : "1.4fr 1fr 1fr 1fr";
    }
    var today = iradToday();
    $$("[data-closes]").forEach(function (v) {
      if (v.getAttribute("data-closes") < today && !$(".kit-cl", v)) {
        v.classList.add("is-closed");
        var h = $("header", v); if (h) h.insertAdjacentHTML("beforeend", '<span class="tag grey kit-cl">' + esc(t("kit_isclosed")) + "</span>");
      }
    });
  }
  /* kit:end */

  function render() {
    chrome();
    kitChrome();
    staticText();
    dates();
    countdowns();
    notices();
    if (EXTRA) EXTRA();
    linkBoxes();
  }
  render();
})();

/* holiday, half-mast, pass and power notices shared by the state sites (iradgov.org/assets/irad-bar.js) */
(function () {
  var s = document.createElement("script");
  s.src = "https://iradgov.org/assets/irad-bar.js"; s.defer = true; s.setAttribute("data-kind", "gov");
  document.head.appendChild(s);
})();
