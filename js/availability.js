(() => {
  const IDS = {
    calendar: "availabilityCalendar",
    legend: "availabilityLegend",
    hint: "availabilityHint",
    label: "calLabel",
    prev: "calPrev",
    next: "calNext",
    clear: "clearSelection",
    minNights: "minNightsValue",
    checkin: "checkinValue",
    checkout: "checkoutValue",
    rangeStatus: "rangeStatus",
    selectedArrival: "selectedArrival",
    selectedDeparture: "selectedDeparture",
    selectedNights: "selectedNights",
    selectedEstimate: "selectedEstimate",
    selectedDeposit: "selectedDeposit",
    periodDisplay: "periodDisplay",
    hiddenArrival: "requestArrival",
    hiddenDeparture: "requestDeparture",
    hiddenNights: "requestNights",
    hiddenEstimate: "requestEstimate",
    hiddenDeposit: "requestDeposit",
    startCheckout: "startCheckout",
    checkoutDetails: "checkoutDetails",
    estimateNote: "estimateNote",
    seasonCards: "seasonCards",
    pricingMeta: "pricingMeta",
    name: "requestName",
    email: "requestEmail",
    phone: "requestPhone",
    guests: "requestGuests",
    message: "requestMessage",
    mailLink: "mailLink",
    waLink: "waLink",
    form: "rentalForm",
    year: "year"
  };

  const CONTACT = {
    email: "hilde.dequeecker@gmail.com",
    whatsapp: "32497170956"
  };

  const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  const MONTHS = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december"
  ];

  const state = {
    data: {
      currency: "EUR",
      timezone: "Europe/Madrid",
      checkin: "16:00",
      checkout: "10:00",
      min_nights: 4,
      pricing_disclaimer: "Indicatieve prijzen. Definitieve offerte na bevestiging.",
      pricing_rules: {
        cleaning_fee: 0,
        security_deposit: 0
      },
      seasons: [],
      blocked: []
    },
    todayISO: isoFromDate(new Date()),
    viewDate: monthStart(new Date()),
    selection: {
      start: null,
      end: null
    }
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function pad(v) {
    return String(v).padStart(2, "0");
  }

  function isoFromDate(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function dateFromIso(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function monthStart(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function monthEnd(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  function shiftMonth(d, amount) {
    return new Date(d.getFullYear(), d.getMonth() + amount, 1);
  }

  function monthLabel(d) {
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatDate(iso) {
    if (!iso) return "Nog niet gekozen";
    return new Intl.DateTimeFormat("nl-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(dateFromIso(iso));
  }

  function num(v, fallback = 0) {
    const parsed = Number(v);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function minNights() {
    return num(state.data.min_nights, 4);
  }

  function pricingRules() {
    return {
      cleaning_fee: num(state.data?.pricing_rules?.cleaning_fee, 0),
      security_deposit: num(state.data?.pricing_rules?.security_deposit, 0)
    };
  }

  function formatMoney(value) {
    const amount = num(value, NaN);
    if (!Number.isFinite(amount)) return "Op aanvraag";
    return new Intl.NumberFormat("nl-BE", {
      style: "currency",
      currency: state.data.currency || "EUR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function isPast(iso) {
    return iso < state.todayISO;
  }

  function isBlocked(iso) {
    const blocked = state.data.blocked || [];
    return blocked.some((r) => r?.start && r?.end && iso >= r.start && iso <= r.end);
  }

  function isSelectable(iso) {
    return !isPast(iso) && !isBlocked(iso);
  }

  function nightsBetween(startIso, endIso) {
    const start = dateFromIso(startIso);
    const end = dateFromIso(endIso);
    if (!start || !end || end <= start) return 0;
    return Math.round((end.getTime() - start.getTime()) / 86400000);
  }

  function rangeIsAvailable(startIso, endIso) {
    const start = dateFromIso(startIso);
    const end = dateFromIso(endIso);
    if (!start || !end || end <= start) return false;

    const cursor = new Date(start);
    while (cursor < end) {
      const iso = isoFromDate(cursor);
      if (!isSelectable(iso)) return false;
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  }

  function seasonFor(iso) {
    const seasons = state.data.seasons || [];
    return seasons.find((s) => s?.start && s?.end && iso >= s.start && iso <= s.end) || null;
  }

  function rateForDate(iso) {
    const season = seasonFor(iso);
    if (!season) return null;
    const rate = num(season.nightly_rate, NaN);
    return Number.isFinite(rate) ? rate : null;
  }

  function estimateRange(startIso, endIso) {
    if (!startIso || !endIso) return null;

    const start = dateFromIso(startIso);
    const end = dateFromIso(endIso);
    if (!start || !end || end <= start) return null;

    const rules = pricingRules();
    let subtotal = 0;
    let nights = 0;

    const cursor = new Date(start);
    while (cursor < end) {
      const iso = isoFromDate(cursor);
      const rate = rateForDate(iso);
      if (rate === null) {
        return {
          priced: false,
          nights,
          subtotal: null,
          cleaning: rules.cleaning_fee,
          deposit: rules.security_deposit,
          total: null
        };
      }
      subtotal += rate;
      nights += 1;
      cursor.setDate(cursor.getDate() + 1);
    }

    return {
      priced: true,
      nights,
      subtotal,
      cleaning: rules.cleaning_fee,
      deposit: rules.security_deposit,
      total: subtotal + rules.cleaning_fee
    };
  }

  function setHint(text) {
    const el = byId(IDS.hint);
    if (el) el.textContent = text;
  }

  function setRangeStatus(text) {
    const el = byId(IDS.rangeStatus);
    if (el) el.textContent = text;
  }

  function renderLegend() {
    const el = byId(IDS.legend);
    if (!el) return;
    el.innerHTML = `
      <span class="legend-item"><span class="legend-dot available"></span> Beschikbaar</span>
      <span class="legend-item"><span class="legend-dot blocked"></span> Bezet</span>
      <span class="legend-item"><span class="legend-dot selected"></span> Selectie</span>
      <span class="legend-item"><span class="legend-dot past"></span> Verleden</span>
    `;
  }

  function selectionClasses(iso) {
    const { start, end } = state.selection;
    let cls = "";
    if (start && iso === start) cls += " is-selected-start";
    if (end && iso === end) cls += " is-selected-end";
    if (start && end && iso > start && iso < end) cls += " is-in-range";
    return cls.trim();
  }

  function renderCalendar() {
    const cal = byId(IDS.calendar);
    const label = byId(IDS.label);
    if (!cal || !label) return;

    const start = monthStart(state.viewDate);
    const end = monthEnd(state.viewDate);
    label.textContent = monthLabel(start);

    const firstDay = start.getDay();
    const offset = (firstDay + 6) % 7;

    const cells = [];
    for (let i = 0; i < offset; i += 1) cells.push({ type: "blank" });

    for (let day = 1; day <= end.getDate(); day += 1) {
      const date = new Date(start.getFullYear(), start.getMonth(), day);
      cells.push({ type: "day", iso: isoFromDate(date), day });
    }

    while (cells.length % 7 !== 0) cells.push({ type: "blank" });

    cal.innerHTML = `
      <div class="cal-weekdays">
        ${WEEKDAYS.map((wd) => `<div class="cal-wd">${wd}</div>`).join("")}
      </div>
      <div class="cal-grid">
        ${cells
          .map((c) => {
            if (c.type === "blank") return '<div class="cal-cell"><div class="cal-blank"></div></div>';

            const classes = ["cal-day"];
            let disabled = "";
            let title = `${c.iso} - Beschikbaar`;

            if (isPast(c.iso)) {
              classes.push("is-past");
              disabled = "disabled";
              title = `${c.iso} - Verleden`;
            } else if (isBlocked(c.iso)) {
              classes.push("is-blocked");
              disabled = "disabled";
              title = `${c.iso} - Bezet`;
            } else {
              classes.push("is-available");
            }

            const inSelection = selectionClasses(c.iso);
            if (inSelection) classes.push(inSelection);

            return `
              <div class="cal-cell">
                <button type="button" class="${classes.join(" ")}" data-iso="${c.iso}" aria-label="${title}" title="${title}" ${disabled}>${c.day}</button>
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    cal.querySelectorAll(".cal-day:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => {
        const iso = btn.getAttribute("data-iso");
        if (iso) onDayClick(iso);
      });
    });
  }

  function onDayClick(iso) {
    if (!isSelectable(iso)) return;

    const { start, end } = state.selection;

    if (!start || (start && end)) {
      state.selection = { start: iso, end: null };
      setHint("Mooi, je aankomst staat vast. Kies nu je vertrek.");
      updateSummary();
      renderCalendar();
      return;
    }

    if (iso <= start) {
      state.selection = { start: iso, end: null };
      setHint("Aankomst aangepast. Kies daarna je vertrek.");
      updateSummary();
      renderCalendar();
      return;
    }

    if (!rangeIsAvailable(start, iso)) {
      setHint("Deze periode bevat een bezette datum. Kies een andere vertrekdatum.");
      return;
    }

    state.selection.end = iso;

    const nights = nightsBetween(start, iso);
    if (nights < minNights()) {
      setHint(`Deze selectie telt ${nights} nachten. Minimum is ${minNights()} nachten.`);
    } else {
      const estimate = estimateRange(start, iso);
      if (estimate?.priced) {
        setHint(`Je periode staat klaar: ${nights} nachten, indicatief ${formatMoney(estimate.total)}.`);
      } else {
        setHint(`Je periode staat klaar: ${nights} nachten. We bevestigen de prijs persoonlijk.`);
      }
    }

    updateSummary();
    renderCalendar();
  }

  function clearSelection() {
    state.selection = { start: null, end: null };
    setHint("Selectie gewist. Kies gerust opnieuw je data.");
    updateSummary();
    renderCalendar();
  }

  function renderSeasons() {
    const cards = byId(IDS.seasonCards);
    const meta = byId(IDS.pricingMeta);
    if (!cards || !meta) return;

    const seasons = Array.isArray(state.data.seasons) ? [...state.data.seasons] : [];
    seasons.sort((a, b) => String(a.start || "").localeCompare(String(b.start || "")));

    if (!seasons.length) {
      cards.innerHTML = `
        <article class="season-card">
          <h3>Prijs op aanvraag</h3>
          <p class="season-note">We bezorgen je de prijs persoonlijk op basis van periode en aantal gasten.</p>
        </article>
      `;
    } else {
      cards.innerHTML = seasons
        .map((s) => {
          const name = s?.name || "Seizoen";
          const range = `${formatDate(s.start)} - ${formatDate(s.end)}`;
          const rate = num(s?.nightly_rate, NaN);
          const rateLabel = Number.isFinite(rate) ? `${formatMoney(rate)} / nacht` : "Op aanvraag";

          return `
            <article class="season-card">
              <h3>${name}</h3>
              <p class="season-range">${range}</p>
              <p class="season-rate">${rateLabel}</p>
              <p class="season-note">Minimumverblijf ${minNights()} nachten.</p>
            </article>
          `;
        })
        .join("");
    }

    const rules = pricingRules();
    const parts = [state.data.pricing_disclaimer || "Indicatieve prijzen."];
    if (rules.cleaning_fee > 0) parts.push(`Schoonmaak: ${formatMoney(rules.cleaning_fee)} per verblijf.`);
    if (rules.security_deposit > 0) parts.push(`Waarborg: ${formatMoney(rules.security_deposit)}.`);
    parts.push(`Check-in ${state.data.checkin || "16:00"} · Check-out ${state.data.checkout || "10:00"}.`);
    meta.textContent = parts.join(" ");
  }

  function updateStaticFields() {
    const min = byId(IDS.minNights);
    if (min) min.textContent = `${minNights()} nachten`;

    const checkin = byId(IDS.checkin);
    if (checkin) checkin.textContent = state.data.checkin || "16:00";

    const checkout = byId(IDS.checkout);
    if (checkout) checkout.textContent = state.data.checkout || "10:00";

    const year = byId(IDS.year);
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function updateSummary() {
    const { start, end } = state.selection;
    const nights = start && end ? nightsBetween(start, end) : 0;

    const arrival = byId(IDS.selectedArrival);
    const departure = byId(IDS.selectedDeparture);
    const nightsEl = byId(IDS.selectedNights);
    const estimateEl = byId(IDS.selectedEstimate);
    const depositEl = byId(IDS.selectedDeposit);
    const period = byId(IDS.periodDisplay);

    const hiddenArrival = byId(IDS.hiddenArrival);
    const hiddenDeparture = byId(IDS.hiddenDeparture);
    const hiddenNights = byId(IDS.hiddenNights);
    const hiddenEstimate = byId(IDS.hiddenEstimate);
    const hiddenDeposit = byId(IDS.hiddenDeposit);

    const estimateNote = byId(IDS.estimateNote);

    if (arrival) arrival.textContent = start ? formatDate(start) : "Datum toevoegen";
    if (departure) departure.textContent = end ? formatDate(end) : "Datum toevoegen";
    if (nightsEl) nightsEl.textContent = nights > 0 ? String(nights) : "-";

    if (period) {
      if (start && end) {
        period.value = `${formatDate(start)} - ${formatDate(end)} (${nights} nachten)`;
      } else if (start) {
        period.value = `Aankomst ${formatDate(start)} - kies vertrek`;
      } else {
        period.value = "";
      }
    }

    if (hiddenArrival) hiddenArrival.value = start || "";
    if (hiddenDeparture) hiddenDeparture.value = end || "";
    if (hiddenNights) hiddenNights.value = nights > 0 ? String(nights) : "";

    let estimateText = "-";
    let depositText = "-";
    let estimateValue = "";
    let depositValue = "";

    const estimate = start && end ? estimateRange(start, end) : null;

    if (estimate?.priced) {
      estimateText = formatMoney(estimate.total);
      estimateValue = formatMoney(estimate.total);
      depositText = estimate.deposit > 0 ? formatMoney(estimate.deposit) : "Niet vereist";
      depositValue = estimate.deposit > 0 ? formatMoney(estimate.deposit) : "";

      if (estimateNote) {
        estimateNote.textContent = `Indicatie: ${formatMoney(estimate.subtotal)} huur + ${formatMoney(estimate.cleaning)} schoonmaak = ${formatMoney(estimate.total)}.`;
      }
    } else if (start && end) {
      const rules = pricingRules();
      estimateText = "Op aanvraag";
      estimateValue = "Op aanvraag";
      depositText = rules.security_deposit > 0 ? formatMoney(rules.security_deposit) : "Niet vereist";
      depositValue = rules.security_deposit > 0 ? formatMoney(rules.security_deposit) : "";

      if (estimateNote) {
        estimateNote.textContent = "Voor deze periode is nog geen vast seizoentarief ingesteld. We bevestigen de prijs persoonlijk.";
      }
    } else if (estimateNote) {
      estimateNote.textContent = "Kies je data om meteen een prijsindicatie te zien.";
    }

    if (estimateEl) estimateEl.textContent = estimateText;
    if (depositEl) depositEl.textContent = depositText;

    if (hiddenEstimate) hiddenEstimate.value = estimateValue;
    if (hiddenDeposit) hiddenDeposit.value = depositValue;

    if (!start) {
      setRangeStatus("Kies een vrije aankomstdatum om te starten.");
    } else if (!end) {
      setRangeStatus("Aankomst gekozen. Kies nu je vertrek.");
    } else if (nights < minNights()) {
      setRangeStatus(`Je selectie telt ${nights} nachten. Minimumverblijf is ${minNights()} nachten.`);
    } else if (estimate?.priced) {
      setRangeStatus(`Periode klaar: ${nights} nachten. Indicatief ${formatMoney(estimate.total)}.`);
    } else {
      setRangeStatus(`Periode klaar: ${nights} nachten. Prijs bevestigen we persoonlijk.`);
    }

    updateContactLinks();
  }

  function bindCheckoutTrigger() {
    const startBtn = byId(IDS.startCheckout);
    const checkout = byId(IDS.checkoutDetails);
    if (!startBtn || !checkout) return;

    startBtn.addEventListener("click", () => {
      const { start, end } = state.selection;
      if (!start || !end) {
        setRangeStatus("Kies eerst aankomst en vertrek in de kalender.");
        return;
      }

      const nights = nightsBetween(start, end);
      if (nights < minNights()) {
        setRangeStatus(`Je selectie telt ${nights} nachten. Minimumverblijf is ${minNights()} nachten.`);
        return;
      }

      checkout.open = true;
      const email = byId(IDS.email);
      if (email) email.focus();
    });
  }

  function getFormPayload() {
    return {
      name: byId(IDS.name)?.value?.trim() || "",
      email: byId(IDS.email)?.value?.trim() || "",
      phone: byId(IDS.phone)?.value?.trim() || "",
      guests: byId(IDS.guests)?.value || "4",
      message: byId(IDS.message)?.value?.trim() || "",
      arrival: byId(IDS.hiddenArrival)?.value || "",
      departure: byId(IDS.hiddenDeparture)?.value || "",
      nights: byId(IDS.hiddenNights)?.value || "",
      estimate: byId(IDS.hiddenEstimate)?.value || "",
      deposit: byId(IDS.hiddenDeposit)?.value || ""
    };
  }

  function buildRequestText() {
    const p = getFormPayload();
    const lines = [
      "Hallo,",
      "",
      "Ik wil graag de beschikbaarheid van het penthouse in Los Alcazares bekijken.",
      ""
    ];

    if (p.arrival && p.departure) {
      lines.push(`Periode: ${formatDate(p.arrival)} tot ${formatDate(p.departure)} (${p.nights || "?"} nachten)`);
    } else {
      lines.push("Periode: nog niet volledig geselecteerd");
    }

    lines.push(`Gasten: ${p.guests}`);
    lines.push(`Check-in: ${state.data.checkin || "16:00"} · Check-out: ${state.data.checkout || "10:00"}`);

    if (p.estimate) lines.push(`Indicatieve totaalprijs: ${p.estimate}`);
    if (p.deposit) lines.push(`Waarborg: ${p.deposit}`);

    if (p.name) lines.push(`Naam: ${p.name}`);
    if (p.email) lines.push(`E-mail: ${p.email}`);
    if (p.phone) lines.push(`Telefoon: ${p.phone}`);

    if (p.message) {
      lines.push("");
      lines.push(`Opmerking: ${p.message}`);
    }

    lines.push("");
    lines.push("Dankjewel.");

    return lines.join("\n");
  }

  function updateContactLinks() {
    const mail = byId(IDS.mailLink);
    const wa = byId(IDS.waLink);
    if (!mail || !wa) return;

    const p = getFormPayload();
    let subject = "Beschikbaarheid penthouse Los Alcazares";
    if (p.arrival && p.departure) {
      subject = `Beschikbaarheid penthouse: ${p.arrival} tot ${p.departure}`;
    }

    const body = buildRequestText();
    mail.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    wa.href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(body)}`;
  }

  function bindInputs() {
    const form = byId(IDS.form);
    if (!form) return;

    [IDS.name, IDS.email, IDS.phone, IDS.guests, IDS.message].forEach((id) => {
      const el = byId(id);
      if (!el) return;
      el.addEventListener("input", updateContactLinks);
      el.addEventListener("change", updateContactLinks);
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        updateSummary();
      }, 0);
    });
  }

  function bindCalendarControls() {
    const prev = byId(IDS.prev);
    const next = byId(IDS.next);
    const clear = byId(IDS.clear);

    if (prev) {
      prev.addEventListener("click", () => {
        state.viewDate = shiftMonth(state.viewDate, -1);
        renderCalendar();
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        state.viewDate = shiftMonth(state.viewDate, 1);
        renderCalendar();
      });
    }

    if (clear) {
      clear.addEventListener("click", clearSelection);
    }
  }

  async function loadAvailability() {
    const res = await fetch("./data/availability.json", { cache: "no-store" });
    if (!res.ok) throw new Error("availability.json kon niet geladen worden");

    const json = await res.json();
    state.data = {
      ...state.data,
      ...json,
      pricing_rules: {
        ...state.data.pricing_rules,
        ...(json.pricing_rules || {})
      },
      seasons: Array.isArray(json?.seasons) ? json.seasons : [],
      blocked: Array.isArray(json?.blocked) ? json.blocked : []
    };
  }

  async function init() {
    renderLegend();
    bindCalendarControls();
    bindInputs();
    bindCheckoutTrigger();

    try {
      await loadAvailability();
      setHint("Kies een vrije aankomstdatum en daarna je vertrek.");
    } catch (err) {
      setHint("De kalender laadt nu niet goed. Je kan ons wel meteen mailen of WhatsApp sturen.");
      console.error(err);
    }

    updateStaticFields();
    renderSeasons();
    updateSummary();
    renderCalendar();
    updateContactLinks();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
