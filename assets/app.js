/* ==========================================================
   Logique du site — pas besoin de modifier ce fichier
   ========================================================== */
(function () {
  const C = window.SITE_CONFIG || {};

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- Prix ---------- */
  $$("[data-price]").forEach(el => {
    el.textContent = C.priceUSD;
  });

  /* Devise affichée (suit automatiquement `currency`) */
  const CCY = (C.currency || "USD").toUpperCase();
  const CCY_SYM = { USD: "$", EUR: "€", GBP: "£", MGA: "Ar", CAD: "$", XOF: "FCFA", XAF: "FCFA" };
  $$("[data-ccy]").forEach(el => { el.textContent = CCY_SYM[CCY] || CCY; });
  $$("[data-ccy-code]").forEach(el => { el.textContent = CCY; });
  $$("[data-pages]").forEach(el => {    if (C.pagesCount && C.pagesCount !== "—") el.textContent = C.pagesCount + " pages";
  });
  $$("[data-guarantee]").forEach(el => {
    el.textContent = C.guaranteeDays;
  });
  $$("[data-author]").forEach(el => {
    el.textContent = C.authorName;
  });
  $$("[data-title]").forEach(el => {
    el.textContent = C.bookTitle;
  });

  /* ---------- Lien principal d'achat ---------- */
  function primaryUrl() {
    if (C.gumroadUrl) return C.gumroadUrl;        // paiement + livraison auto
    if (C.stripeUrl)  return C.stripeUrl;
    if (C.paypalClientId) return "#prix";         // boutons PayPal sur la page
    if (C.paypalUrl)  return C.paypalUrl;
    return whatsappUrl();
  }

  function whatsappUrl() {
    const msg = encodeURIComponent(
      "Bonjour, je souhaite acheter le livre « " + C.bookTitle + " » à " +
      C.priceUSD + " $. Merci de m'envoyer le lien de paiement."
    );
    return "https://wa.me/" + String(C.whatsapp).replace(/[^\d]/g, "") + "?text=" + msg;
  }

  function mailtoUrl() {    const subject = encodeURIComponent("Commande — " + C.bookTitle);
    const body = encodeURIComponent(
      "Bonjour,\n\nJe souhaite acheter « " + C.bookTitle + " » (" +
      C.priceUSD + " $).\n\nMerci de m'indiquer les modalités de paiement.\n"
    );
    return "mailto:" + C.email + "?subject=" + subject + "&body=" + body;
  }

  $$("[data-link='primary']").forEach(a => { a.href = primaryUrl(); });
  $$("[data-link='paypal']").forEach(a => {
    if (!C.paypalUrl) { a.style.display = "none"; return; }
    a.href = C.paypalUrl;
  });

  /* ---------- PayPal : boutons intelligents ---------- */
  function paypalUnavailable(msg) {
    const box = $("#paypal-button-container");
    if (box) box.innerHTML = '<p class="pay-note">' + msg + "</p>";
  }

  function renderPayPal() {
    const box = $("#paypal-button-container");
    if (!box || !window.paypal || !window.paypal.Buttons) return;

    const divider = $("#pay-divider");
    if (divider) divider.classList.add("show");

    window.paypal.Buttons({
      style: { layout: "vertical", shape: "rect", color: "gold", label: "paypal", height: 48 },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            description: C.bookTitle,
            amount: {
              value: Number(C.priceUSD).toFixed(2),
              currency_code: (C.currency || "USD").toUpperCase()
            }
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function () {
          try { sessionStorage.setItem("achat_paye", "1"); } catch (e) {}
          window.location.href = "merci.html";
        });
      },
      onCancel: function () {
        paypalUnavailable("Paiement annulé. Tu peux réessayer ou commander par WhatsApp.");
      },
      onError: function (err) {
        console.error("[PayPal]", err);
        paypalUnavailable("PayPal indisponible pour le moment. Utilise WhatsApp / Orange Money ci-dessous.");
      }
    }).render("#paypal-button-container");
  }

  if (C.paypalClientId) {
    const s = document.createElement("script");
    s.src = "https://www.paypal.com/sdk/js?client-id=" +
            encodeURIComponent(C.paypalClientId) +
            "&currency=" + encodeURIComponent((C.currency || "USD").toUpperCase()) +
            "&intent=capture&components=buttons";
    s.onload = renderPayPal;
    s.onerror = function () {
      paypalUnavailable("Impossible de charger PayPal. Utilise WhatsApp / Orange Money ci-dessous.");
    };
    document.head.appendChild(s);
  }
  $$("[data-link='whatsapp']").forEach(a => { a.href = whatsappUrl(); });

  function reviewUrl() {
    const msg = encodeURIComponent(
      "Bonjour, je souhaite laisser un avis sur le livre « " + C.bookTitle + " ». Merci !"
    );
    return "https://wa.me/" + String(C.whatsapp).replace(/[^\d]/g, "") + "?text=" + msg;
  }
  $$("[data-link='review']").forEach(a => { a.href = reviewUrl(); });
  $$("[data-link='download']").forEach(a => {
    a.href = C.downloadUrl || whatsappUrl();
    if (C.downloadUrl) { a.target = "_blank"; a.rel = "noopener"; }
  });
  $$("[data-link='email']").forEach(a => { a.href = mailtoUrl(); });

  /* Le bouton principal ouvre dans le même onglet (plus fiable sur mobile) */
  $$("[data-link='primary']").forEach(a => { a.removeAttribute("target"); });

  /* ---------- Textes de contact ---------- */
  $$("[data-whatsapp]").forEach(el => { el.textContent = C.whatsapp; });
  $$("[data-email]").forEach(el => { el.textContent = C.email; });
  $$("[data-mvola]").forEach(el => { el.textContent = C.mvola; });
  $$("[data-orange]").forEach(el => { el.textContent = C.orangeMoney; });
  $$("[data-airtel]").forEach(el => { el.textContent = C.airtelMoney; });

  /* Masque les moyens de paiement non renseignés */
  [["data-mvola", C.mvola], ["data-orange", C.orangeMoney], ["data-airtel", C.airtelMoney]]
    .forEach(pair => {
      if (pair[1]) return;
      $$("[" + pair[0] + "]").forEach(el => {
        const chip = el.closest(".pay-chip");
        if (chip) chip.style.display = "none";
      });
    });

  if (!C.paypalUrl && !C.stripeUrl && !C.gumroadUrl) {
    $$("[data-card]").forEach(el => { el.style.display = "none"; });
  }

  /* ---------- Année du footer ---------- */
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Barre CTA mobile ---------- */
  const sticky = $("#sticky-cta");
  if (sticky) {
    const hero = $("#hero");
    const onScroll = () => {
      const passed = window.scrollY > (hero ? hero.offsetHeight * 0.8 : 400);
      sticky.classList.toggle("show", passed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  (function mobileMenu() {
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");
    if (!toggle || !nav) return;
    toggle.hidden = false;

    const mq = window.matchMedia("(max-width: 940px)");
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });
    const onChange = function () { if (!mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  })();

  /* ---------- Barre de progression ---------- */
  const progress = $("#scroll-progress");
  if (progress) {
    const update = function () {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Apparition au scroll ---------- */
  (function revealOnScroll() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = $$(".section-head, .card, .step, .chapter, .price-card, " +
                       ".guarantee, .review, .cta-band, .reviews__score, .learn li");

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 6) * 70 + "ms";
    });

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Ouverture du premier chapitre ---------- */
  const first = $(".chapter");
  if (first) first.setAttribute("open", "");

  /* ---------- Avis clients ---------- */
  (function renderReviews() {
    const list = $("#reviews-list");
    const summary = $("#reviews-summary");
    const empty = $("#reviews-empty");
    const wrap = $(".reviews");
    if (!list || !summary || !empty) return;

    const items = (Array.isArray(C.reviews) ? C.reviews : [])
      .filter(r => r && Number(r.rating) > 0);

    if (items.length === 0) {
      summary.hidden = true;
      empty.style.display = "";
      if (wrap) wrap.classList.add("no-score");
      return;
    }

    empty.style.display = "none";
    summary.hidden = false;
    if (wrap) wrap.classList.remove("no-score");

    function starsEl(n) {
      const box = document.createElement("span");
      box.className = "stars";
      for (let i = 1; i <= 5; i++) {
        const s = document.createElement("span");
        s.className = "star" + (i <= Math.round(n) ? " on" : "");
        s.textContent = "★";
        box.appendChild(s);
      }
      return box;
    }

    function initials(name) {
      return String(name || "?").trim().split(/\s+/).slice(0, 2)
        .map(w => w.charAt(0)).join("").toUpperCase();
    }

    function formatDate(v) {
      const d = new Date(v);
      if (isNaN(d.getTime())) return String(v);
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    }

    let sum = 0;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    items.forEach(r => {
      const v = Math.max(1, Math.min(5, Math.round(Number(r.rating))));
      sum += v;
      counts[v]++;
    });
    const avg = sum / items.length;

    $("#reviews-avg").textContent = avg.toFixed(1).replace(".", ",");
    $("#reviews-count").textContent = items.length;

    const starsBox = $("#reviews-stars");
    starsBox.innerHTML = "";
    starsBox.appendChild(starsEl(avg));

    const bars = $("#reviews-bars");
    bars.innerHTML = "";
    [5, 4, 3, 2, 1].forEach(n => {
      const pct = Math.round(counts[n] / items.length * 100);
      const row = document.createElement("div");
      row.className = "rbar";

      const label = document.createElement("span");
      label.textContent = n + "★";

      const track = document.createElement("div");
      track.className = "rbar__track";
      const fill = document.createElement("div");
      fill.className = "rbar__fill";
      fill.style.width = pct + "%";
      track.appendChild(fill);

      const num = document.createElement("span");
      num.textContent = counts[n];

      row.append(label, track, num);
      bars.appendChild(row);
    });

    items.forEach(r => {
      const card = document.createElement("article");
      card.className = "review";

      const head = document.createElement("div");
      head.className = "review__head";

      const av = document.createElement("div");
      av.className = "review__avatar";
      av.textContent = initials(r.name);

      const who = document.createElement("div");
      who.className = "review__who";

      const nm = document.createElement("div");
      nm.className = "review__name";
      nm.textContent = r.name || "Client";

      const meta = document.createElement("div");
      meta.className = "review__meta";
      if (r.verified !== false) {
        const v = document.createElement("span");
        v.className = "review__verified";
        v.textContent = "✓ Achat vérifié";
        meta.appendChild(v);
      }
      if (r.date) {
        const d = document.createElement("span");
        d.textContent = formatDate(r.date);
        meta.appendChild(d);
      }

      who.append(nm, meta);
      head.append(av, who);

      card.append(head, starsEl(r.rating));

      const txt = document.createElement("p");
      txt.className = "review__text";
      txt.textContent = r.text || "";
      card.appendChild(txt);

      list.appendChild(card);
    });
  })();

  /* ---------- Avertissement si config non modifiée ---------- */
  const notConfigured =
    String(C.whatsapp).indexOf("261340000000") === 0 ||
    String(C.paypalUrl).indexOf("TONCOMPTE") > -1;

  if (notConfigured && location.hostname === "localhost") {
    console.warn(
      "[Site] Les liens de paiement ne sont pas encore configurés. " +
      "Modifie assets/config.js avant de publier."
    );
  }
})();
