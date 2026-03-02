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
    selectedPeriod: "selectedPeriod",
    arrivalTrigger: "arrivalTrigger",
    departureTrigger: "departureTrigger",
    calendarPopover: "calendarPopover",
    closeCalendar: "closeCalendar",
    guestTrigger: "guestTrigger",
    selectedGuests: "selectedGuests",
    guestPopover: "guestPopover",
    closeGuests: "closeGuests",
    guestAdultsValue: "guestAdultsValue",
    guestChildrenValue: "guestChildrenValue",
    guestAdultsMinus: "guestAdultsMinus",
    guestAdultsPlus: "guestAdultsPlus",
    guestChildrenMinus: "guestChildrenMinus",
    guestChildrenPlus: "guestChildrenPlus",
    guestPopoverTotal: "guestPopoverTotal",
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
    stripeCheckout: "stripeCheckout",
    paymentStatus: "paymentStatus",
    form: "rentalForm",
    navToggle: "navToggle",
    navPanel: "navPanel",
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

  const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

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
    todayISO: dateToIso(new Date()),
    viewDate: monthStart(new Date()),
    selection: {
      start: null,
      end: null
    },
    guests: {
      adults: 2,
      children: 2,
      min: 2,
      max: 6
    },
    maxMonthsAhead: 18,
    renderedMonths: 1
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function dateToIso(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function isoToDate(iso) {
    if (!isIsoDate(iso)) return null;
    const [year, month, day] = iso.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime())) return null;
    if (dateToIso(date) !== iso) return null;
    return date;
  }

  function isIsoDate(value) {
    return typeof value === "string" && ISO_RE.test(value);
  }

  function monthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function monthEnd(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function shiftMonth(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  function monthLabel(date) {
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatDate(iso) {
    const date = isoToDate(iso);
    if (!date) return "Nog niet gekozen";
    return new Intl.DateTimeFormat("nl-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  }

  function numberValue(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function minNights() {
    const value = Math.floor(numberValue(state.data.min_nights, 4));
    return Math.max(value, 1);
  }

  function pricingRules() {
    return {
      cleaning_fee: Math.max(numberValue(state.data?.pricing_rules?.cleaning_fee, 0), 0),
      security_deposit: Math.max(numberValue(state.data?.pricing_rules?.security_deposit, 0), 0)
    };
  }

  function monthsToShow() {
    return window.matchMedia("(min-width: 1240px)").matches ? 2 : 1;
  }

  function monthDistanceFromToday(date) {
    const today = monthStart(new Date());
    return (date.getFullYear() - today.getFullYear()) * 12 + (date.getMonth() - today.getMonth());
  }

  function clampViewDate(date) {
    const floor = monthStart(new Date());
    const max = shiftMonth(floor, state.maxMonthsAhead);
    if (date < floor) return floor;
    if (date > max) return max;
    return date;
  }

  function isPast(iso) {
    return iso < state.todayISO;
  }

  function isBlocked(iso) {
    return state.data.blocked.some((range) => iso >= range.start && iso <= range.end);
  }

  function isSelectable(iso) {
    return isIsoDate(iso) && !isPast(iso) && !isBlocked(iso);
  }

  function nightsBetween(startIso, endIso) {
    const start = isoToDate(startIso);
    const end = isoToDate(endIso);
    if (!start || !end || end <= start) return 0;
    return Math.round((end.getTime() - start.getTime()) / 86400000);
  }

  function rangeIsAvailable(startIso, endIso) {
    const start = isoToDate(startIso);
    const end = isoToDate(endIso);
    if (!start || !end || end <= start) return false;

    const cursor = new Date(start);
    while (cursor < end) {
      const iso = dateToIso(cursor);
      if (!isSelectable(iso)) return false;
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  }

  function seasonFor(iso) {
    return state.data.seasons.find((season) => iso >= season.start && iso <= season.end) || null;
  }

  function rateForDate(iso) {
    const season = seasonFor(iso);
    if (!season) return null;
    const value = numberValue(season.nightly_rate, NaN);
    return Number.isFinite(value) ? value : null;
  }

  function formatMoney(value) {
    const amount = numberValue(value, NaN);
    if (!Number.isFinite(amount)) return "Op aanvraag";
    return new Intl.NumberFormat("nl-BE", {
      style: "currency",
      currency: state.data.currency || "EUR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function estimateRange(startIso, endIso) {
    const start = isoToDate(startIso);
    const end = isoToDate(endIso);
    if (!start || !end || end <= start) return null;

    const rules = pricingRules();
    const cursor = new Date(start);

    let nights = 0;
    let subtotal = 0;

    while (cursor < end) {
      const iso = dateToIso(cursor);
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
    const node = byId(IDS.hint);
    if (node) node.textContent = text;
  }

  function setRangeStatus(text) {
    const node = byId(IDS.rangeStatus);
    if (node) node.textContent = text;
  }

  function setPaymentStatus(text) {
    const node = byId(IDS.paymentStatus);
    if (node) node.textContent = text;
  }

  function formatGuestLabel(value) {
    const count = Math.max(Math.floor(numberValue(value, 0)), 0);
    return `${count} ${count === 1 ? "gast" : "gasten"}`;
  }

  function totalGuests() {
    return state.guests.adults + state.guests.children;
  }

  function syncGuestUi() {
    const total = totalGuests();

    const guestField = byId(IDS.guests);
    if (guestField) guestField.value = String(total);

    const selectedGuests = byId(IDS.selectedGuests);
    if (selectedGuests) selectedGuests.textContent = formatGuestLabel(total);

    const popoverTotal = byId(IDS.guestPopoverTotal);
    if (popoverTotal) popoverTotal.textContent = formatGuestLabel(total);

    const adultsValue = byId(IDS.guestAdultsValue);
    const childrenValue = byId(IDS.guestChildrenValue);
    if (adultsValue) adultsValue.textContent = String(state.guests.adults);
    if (childrenValue) childrenValue.textContent = String(state.guests.children);

    const adultsMinus = byId(IDS.guestAdultsMinus);
    const adultsPlus = byId(IDS.guestAdultsPlus);
    const childrenMinus = byId(IDS.guestChildrenMinus);
    const childrenPlus = byId(IDS.guestChildrenPlus);

    if (adultsMinus) {
      adultsMinus.disabled = state.guests.adults <= 1 || total <= state.guests.min;
    }
    if (adultsPlus) {
      adultsPlus.disabled = total >= state.guests.max;
    }
    if (childrenMinus) {
      childrenMinus.disabled = state.guests.children <= 0 || total <= state.guests.min;
    }
    if (childrenPlus) {
      childrenPlus.disabled = total >= state.guests.max;
    }
  }

  function tryUpdateGuests(type, delta) {
    if (!["adults", "children"].includes(type)) return;

    const next = state.guests[type] + delta;
    const currentTotal = totalGuests();
    const nextTotal = currentTotal + delta;

    if (type === "adults" && next < 1) return;
    if (type === "children" && next < 0) return;
    if (nextTotal < state.guests.min) return;
    if (nextTotal > state.guests.max) return;

    state.guests[type] = next;
    updateSummary();
  }

  function setGuestsFromTotal(rawTotal) {
    const total = Math.min(
      state.guests.max,
      Math.max(state.guests.min, Math.floor(numberValue(rawTotal, state.guests.min)))
    );

    state.guests.adults = Math.min(2, total);
    state.guests.children = total - state.guests.adults;
    syncGuestUi();
  }

  function positionCalendarPopover(anchorEl = null) {
    const popover = byId(IDS.calendarPopover);
    const stack = document.querySelector(".date-picker-stack");
    if (!popover || !stack) return;

    if (window.matchMedia("(max-width: 720px)").matches) {
      popover.style.left = "";
      popover.style.right = "";
      popover.style.setProperty("--calendar-pointer-x", "50%");
      return;
    }

    const anchor = anchorEl || byId(IDS.arrivalTrigger);
    const stackRect = stack.getBoundingClientRect();
    const anchorRect = anchor ? anchor.getBoundingClientRect() : stackRect;

    const panelWidth = popover.offsetWidth || Math.min(Math.max(stackRect.width, 520), 760);
    let left = anchorRect.left + anchorRect.width / 2 - stackRect.left - panelWidth / 2;
    const maxLeft = Math.max(0, stackRect.width - panelWidth);
    left = Math.min(Math.max(0, left), maxLeft);

    popover.style.left = `${left}px`;
    popover.style.right = "auto";

    let pointerX = anchorRect.left + anchorRect.width / 2 - stackRect.left - left;
    pointerX = Math.min(Math.max(30, pointerX), Math.max(panelWidth - 30, 30));
    popover.style.setProperty("--calendar-pointer-x", `${pointerX}px`);
  }

  function setCalendarOpen(open, options = {}) {
    const { skipPeerClose = false, anchorEl = null } = options;
    const popover = byId(IDS.calendarPopover);
    if (!popover) return;

    if (open && !skipPeerClose) {
      setGuestOpen(false, { skipPeerClose: true });
    }

    popover.hidden = !open;

    const arrivalTrigger = byId(IDS.arrivalTrigger);
    const departureTrigger = byId(IDS.departureTrigger);
    if (arrivalTrigger) arrivalTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (departureTrigger) departureTrigger.setAttribute("aria-expanded", open ? "true" : "false");

    if (open) {
      window.requestAnimationFrame(() => {
        positionCalendarPopover(anchorEl);
        popover.focus({ preventScroll: true });
      });
    }
  }

  function setGuestOpen(open, options = {}) {
    const { skipPeerClose = false } = options;
    const popover = byId(IDS.guestPopover);
    if (!popover) return;

    if (open && !skipPeerClose) {
      setCalendarOpen(false, { skipPeerClose: true });
    }

    popover.hidden = !open;

    const trigger = byId(IDS.guestTrigger);
    if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");

    if (open) {
      popover.focus({ preventScroll: true });
    }
  }

  function closeBookingPopovers() {
    setCalendarOpen(false);
    setGuestOpen(false);
  }

  function setCheckoutVisibility(visible) {
    const checkout = byId(IDS.checkoutDetails);
    if (!checkout) return;
    checkout.hidden = !visible;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderLegend() {
    const target = byId(IDS.legend);
    if (!target) return;

    target.innerHTML = [
      "<span class=\"legend-item\"><span class=\"legend-dot available\"></span>Beschikbaar</span>",
      "<span class=\"legend-item\"><span class=\"legend-dot blocked\"></span>Bezet</span>",
      "<span class=\"legend-item\"><span class=\"legend-dot selected\"></span>Selectie</span>",
      "<span class=\"legend-item\"><span class=\"legend-dot past\"></span>Verleden</span>"
    ].join("");
  }

  function daySelectionClass(iso) {
    const { start, end } = state.selection;
    const classes = [];

    if (start && iso === start) classes.push("is-selected-start");
    if (end && iso === end) classes.push("is-selected-end");
    if (start && end && iso > start && iso < end) classes.push("is-in-range");

    return classes.join(" ");
  }

  function buildMonthHtml(date) {
    const start = monthStart(date);
    const end = monthEnd(date);

    const firstDay = start.getDay();
    const offset = (firstDay + 6) % 7;

    const cells = [];
    for (let i = 0; i < offset; i += 1) {
      cells.push("<div class=\"cal-cell\"><div class=\"cal-blank\"></div></div>");
    }

    for (let day = 1; day <= end.getDate(); day += 1) {
      const currentDate = new Date(start.getFullYear(), start.getMonth(), day);
      const iso = dateToIso(currentDate);
      const classes = ["cal-day"];
      let disabled = "";
      let title = `${iso} - Beschikbaar`;

      if (isPast(iso)) {
        classes.push("is-past");
        disabled = "disabled";
        title = `${iso} - Verleden`;
      } else if (isBlocked(iso)) {
        classes.push("is-blocked");
        disabled = "disabled";
        title = `${iso} - Bezet`;
      } else {
        classes.push("is-available");
      }

      const selectionClass = daySelectionClass(iso);
      if (selectionClass) classes.push(selectionClass);

      cells.push(
        `<div class="cal-cell"><button type="button" class="${classes.join(" ")}" data-iso="${iso}" aria-label="${escapeHtml(title)}" title="${escapeHtml(title)}" ${disabled}>${day}</button></div>`
      );
    }

    while (cells.length % 7 !== 0) {
      cells.push("<div class=\"cal-cell\"><div class=\"cal-blank\"></div></div>");
    }

    return `
      <section class="cal-month" aria-label="Kalender ${escapeHtml(monthLabel(start))}">
        <h3 class="cal-month-title">${escapeHtml(monthLabel(start))}</h3>
        <div class="cal-weekdays">${WEEKDAYS.map((day) => `<div class="cal-wd">${day}</div>`).join("")}</div>
        <div class="cal-grid">${cells.join("")}</div>
      </section>
    `;
  }

  function renderCalendar() {
    const calendar = byId(IDS.calendar);
    const label = byId(IDS.label);
    const prev = byId(IDS.prev);
    const next = byId(IDS.next);
    if (!calendar || !label) return;

    state.viewDate = clampViewDate(monthStart(state.viewDate));
    const months = monthsToShow();
    state.renderedMonths = months;

    const monthBlocks = [];
    for (let i = 0; i < months; i += 1) {
      monthBlocks.push(buildMonthHtml(shiftMonth(state.viewDate, i)));
    }

    const first = monthLabel(state.viewDate);
    const last = monthLabel(shiftMonth(state.viewDate, months - 1));
    label.textContent = first === last ? first : `${first} - ${last}`;

    calendar.innerHTML = `<div class="calendar-stack" style="--months:${months};">${monthBlocks.join("")}</div>`;

    calendar.querySelectorAll(".cal-day[data-iso]").forEach((button) => {
      button.addEventListener("click", () => {
        const iso = button.getAttribute("data-iso");
        if (iso) onDayClick(iso);
      });
    });

    if (prev) {
      prev.disabled = monthDistanceFromToday(state.viewDate) <= 0;
    }

    if (next) {
      next.disabled = monthDistanceFromToday(state.viewDate) >= state.maxMonthsAhead;
    }

    const popover = byId(IDS.calendarPopover);
    if (popover && !popover.hidden) {
      window.requestAnimationFrame(() => {
        positionCalendarPopover();
      });
    }
  }

  function onDayClick(iso) {
    if (!isSelectable(iso)) return;

    const { start, end } = state.selection;

    if (!start || (start && end)) {
      state.selection = { start: iso, end: null };
      setHint("Aankomst staat vast. Kies nu je vertrekdatum.");
      updateSummary();
      renderCalendar();
      return;
    }

    if (iso <= start) {
      state.selection = { start: iso, end: null };
      setHint("Aankomst aangepast. Kies opnieuw je vertrekdatum.");
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
      setHint(`Je selectie telt ${nights} nachten. Minimumverblijf is ${minNights()} nachten.`);
    } else {
      const estimate = estimateRange(start, iso);
      if (estimate?.priced) {
        setHint(`Periode klaar: ${nights} nachten, indicatief ${formatMoney(estimate.total)}.`);
      } else {
        setHint(`Periode klaar: ${nights} nachten. Prijs bevestigen we persoonlijk.`);
      }
    }

    updateSummary();
    renderCalendar();

    if (state.selection.end) {
      const selectedNights = nightsBetween(state.selection.start, state.selection.end);
      if (selectedNights >= minNights()) {
        setCalendarOpen(false);
      }
    }
  }

  function clearSelection() {
    state.selection = { start: null, end: null };
    setCheckoutVisibility(false);
    setHint("Selectie gewist. Kies opnieuw je gewenste periode.");
    updateSummary();
    renderCalendar();
    setCalendarOpen(true);
  }

  function updateStaticFields() {
    const minNode = byId(IDS.minNights);
    if (minNode) minNode.textContent = `${minNights()} nachten`;

    const checkinNode = byId(IDS.checkin);
    if (checkinNode) checkinNode.textContent = state.data.checkin || "16:00";

    const checkoutNode = byId(IDS.checkout);
    if (checkoutNode) checkoutNode.textContent = state.data.checkout || "10:00";

    const yearNode = byId(IDS.year);
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());
  }

  function renderSeasons() {
    const cards = byId(IDS.seasonCards);
    const meta = byId(IDS.pricingMeta);
    if (!cards || !meta) return;

    const seasons = [...state.data.seasons].sort((a, b) => a.start.localeCompare(b.start));

    if (!seasons.length) {
      cards.innerHTML = `
        <article class="season-row">
          <h3>Prijs op aanvraag</h3>
          <p class="season-range">Geen vaste seizoentabel actief</p>
          <p class="season-rate">Op aanvraag</p>
          <p class="season-note">Persoonlijke bevestiging</p>
        </article>
      `;
    } else {
      cards.innerHTML = seasons.map((season) => {
        const name = escapeHtml(season.name || "Seizoen");
        const range = `${formatDate(season.start)} - ${formatDate(season.end)}`;
        const rate = numberValue(season.nightly_rate, NaN);
        const rateLabel = Number.isFinite(rate) ? `${formatMoney(rate)} / nacht` : "Op aanvraag";

        return `
          <article class="season-row">
            <h3>${name}</h3>
            <p class="season-range">${escapeHtml(range)}</p>
            <p class="season-rate">${escapeHtml(rateLabel)}</p>
            <p class="season-note">Min. ${minNights()} nachten</p>
          </article>
        `;
      }).join("");
    }

    const rules = pricingRules();
    const parts = [state.data.pricing_disclaimer || "Indicatieve prijzen per nacht."];

    if (rules.cleaning_fee > 0) parts.push(`Schoonmaak ${formatMoney(rules.cleaning_fee)} per verblijf.`);
    if (rules.security_deposit > 0) parts.push(`Waarborg ${formatMoney(rules.security_deposit)}.`);

    parts.push(`Incheck ${state.data.checkin || "16:00"}, uitcheck ${state.data.checkout || "10:00"}.`);
    meta.textContent = parts.join(" ");
  }

  function getActiveSelection() {
    const start = state.selection.start;
    const end = state.selection.end;
    if (!start || !end) return null;

    const nights = nightsBetween(start, end);
    if (nights < minNights()) return null;

    return { start, end, nights };
  }

  function updateStripeState() {
    const stripeButton = byId(IDS.stripeCheckout);
    if (!stripeButton) return;

    const selection = getActiveSelection();
    const estimate = selection ? estimateRange(selection.start, selection.end) : null;
    const rules = pricingRules();

    if (!selection) {
      stripeButton.disabled = true;
      setPaymentStatus("Selecteer eerst een geldige periode om Stripe-betaling te starten.");
      return;
    }

    if (!estimate?.priced) {
      stripeButton.disabled = true;
      setPaymentStatus("Voor deze periode staat geen vast tarief. Contacteer ons eerst voor bevestiging.");
      return;
    }

    stripeButton.disabled = false;

    if (rules.security_deposit > 0) {
      setPaymentStatus(`Stripe rekent hier de waarborg van ${formatMoney(rules.security_deposit)} af via beveiligde checkout.`);
    } else {
      setPaymentStatus("Stripe checkout is actief. Je wordt doorgestuurd naar een beveiligde betaalpagina.");
    }
  }

  function updateSummary() {
    const { start, end } = state.selection;
    const nights = start && end ? nightsBetween(start, end) : 0;
    syncGuestUi();

    const arrivalNode = byId(IDS.selectedArrival);
    const departureNode = byId(IDS.selectedDeparture);
    const periodLabelNode = byId(IDS.selectedPeriod);
    const nightsNode = byId(IDS.selectedNights);
    const estimateNode = byId(IDS.selectedEstimate);
    const depositNode = byId(IDS.selectedDeposit);

    if (arrivalNode) arrivalNode.textContent = start ? formatDate(start) : "Datum toevoegen";
    if (departureNode) departureNode.textContent = end ? formatDate(end) : "Datum toevoegen";
    if (periodLabelNode) {
      if (start && end) {
        periodLabelNode.textContent = `${formatDate(start)} - ${formatDate(end)}`;
      } else if (start) {
        periodLabelNode.textContent = `${formatDate(start)} - vertrek kiezen`;
      } else {
        periodLabelNode.textContent = "Datums toevoegen";
      }
    }
    if (nightsNode) nightsNode.textContent = nights > 0 ? String(nights) : "-";

    const periodHiddenNode = byId(IDS.periodDisplay);
    if (periodHiddenNode) {
      if (start && end) {
        periodHiddenNode.value = `${formatDate(start)} - ${formatDate(end)} (${nights} nachten)`;
      } else if (start) {
        periodHiddenNode.value = `Aankomst ${formatDate(start)} - vertrek nog te kiezen`;
      } else {
        periodHiddenNode.value = "";
      }
    }

    const hiddenArrival = byId(IDS.hiddenArrival);
    const hiddenDeparture = byId(IDS.hiddenDeparture);
    const hiddenNights = byId(IDS.hiddenNights);
    const hiddenEstimate = byId(IDS.hiddenEstimate);
    const hiddenDeposit = byId(IDS.hiddenDeposit);

    if (hiddenArrival) hiddenArrival.value = start || "";
    if (hiddenDeparture) hiddenDeparture.value = end || "";
    if (hiddenNights) hiddenNights.value = nights > 0 ? String(nights) : "";

    const estimate = start && end ? estimateRange(start, end) : null;

    let estimateText = "-";
    let depositText = "-";
    let estimateValue = "";
    let depositValue = "";

    const noteNode = byId(IDS.estimateNote);

    if (estimate?.priced) {
      estimateText = formatMoney(estimate.total);
      estimateValue = formatMoney(estimate.total);
      depositText = estimate.deposit > 0 ? formatMoney(estimate.deposit) : "Niet vereist";
      depositValue = estimate.deposit > 0 ? formatMoney(estimate.deposit) : "";

      if (noteNode) {
        noteNode.textContent = `Indicatie: ${formatMoney(estimate.subtotal)} huur + ${formatMoney(estimate.cleaning)} schoonmaak = ${formatMoney(estimate.total)}.`;
      }
    } else if (start && end) {
      const rules = pricingRules();
      estimateText = "Op aanvraag";
      estimateValue = "Op aanvraag";
      depositText = rules.security_deposit > 0 ? formatMoney(rules.security_deposit) : "Niet vereist";
      depositValue = rules.security_deposit > 0 ? formatMoney(rules.security_deposit) : "";

      if (noteNode) {
        noteNode.textContent = "Voor deze periode ontbreekt een vast seizoentarief. We bevestigen de prijs persoonlijk.";
      }
    } else if (noteNode) {
      noteNode.textContent = "Kies je data om meteen een prijsindicatie te zien.";
    }

    if (estimateNode) estimateNode.textContent = estimateText;
    if (depositNode) depositNode.textContent = depositText;

    if (hiddenEstimate) hiddenEstimate.value = estimateValue;
    if (hiddenDeposit) hiddenDeposit.value = depositValue;

    if (!start) {
      setRangeStatus("Kies een vrije aankomstdatum om te starten.");
    } else if (!end) {
      setRangeStatus("Aankomst gekozen. Kies nu je vertrekdatum.");
    } else if (nights < minNights()) {
      setRangeStatus(`Je selectie telt ${nights} nachten. Minimumverblijf is ${minNights()} nachten.`);
    } else if (estimate?.priced) {
      setRangeStatus(`Periode klaar: ${nights} nachten. Indicatief totaal ${formatMoney(estimate.total)}.`);
    } else {
      setRangeStatus(`Periode klaar: ${nights} nachten. Prijs op aanvraag voor deze data.`);
    }

    if (!start || !end || nights < minNights()) {
      setCheckoutVisibility(false);
    }

    updateContactLinks();
    updateStripeState();
  }

  function cleanText(value) {
    return String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  }

  function getFormPayload() {
    return {
      name: cleanText(byId(IDS.name)?.value || ""),
      email: cleanText(byId(IDS.email)?.value || ""),
      phone: cleanText(byId(IDS.phone)?.value || ""),
      guests: cleanText(byId(IDS.guests)?.value || "4"),
      message: cleanText(byId(IDS.message)?.value || ""),
      arrival: cleanText(byId(IDS.hiddenArrival)?.value || ""),
      departure: cleanText(byId(IDS.hiddenDeparture)?.value || ""),
      nights: cleanText(byId(IDS.hiddenNights)?.value || ""),
      estimate: cleanText(byId(IDS.hiddenEstimate)?.value || ""),
      deposit: cleanText(byId(IDS.hiddenDeposit)?.value || "")
    };
  }

  function buildRequestText() {
    const payload = getFormPayload();

    const lines = [
      "Hallo,",
      "",
      "Ik wil graag de beschikbaarheid van Ático Hilsol aanvragen.",
      ""
    ];

    if (payload.arrival && payload.departure) {
      lines.push(`Periode: ${formatDate(payload.arrival)} tot ${formatDate(payload.departure)} (${payload.nights || "?"} nachten)`);
    } else {
      lines.push("Periode: nog niet volledig geselecteerd");
    }

    lines.push(`Gasten: ${payload.guests || "-"}`);
    lines.push(`Check-in: ${state.data.checkin || "16:00"} · Check-out: ${state.data.checkout || "10:00"}`);

    if (payload.estimate) lines.push(`Indicatie totaal: ${payload.estimate}`);
    if (payload.deposit) lines.push(`Waarborg: ${payload.deposit}`);

    if (payload.name) lines.push(`Naam: ${payload.name}`);
    if (payload.email) lines.push(`E-mail: ${payload.email}`);
    if (payload.phone) lines.push(`Telefoon: ${payload.phone}`);

    if (payload.message) {
      lines.push("");
      lines.push(`Opmerking: ${payload.message}`);
    }

    lines.push("");
    lines.push("Dankjewel.");

    return lines.join("\n");
  }

  function updateContactLinks() {
    const mailLink = byId(IDS.mailLink);
    const waLink = byId(IDS.waLink);
    if (!mailLink || !waLink) return;

    const payload = getFormPayload();

    let subject = "Beschikbaarheid Ático Hilsol Los Alcázares";
    if (payload.arrival && payload.departure) {
      subject = `Beschikbaarheid: ${payload.arrival} tot ${payload.departure}`;
    }

    const body = buildRequestText();

    mailLink.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    waLink.href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(body)}`;
  }

  function bindInputs() {
    const form = byId(IDS.form);
    if (!form) return;

    [IDS.name, IDS.email, IDS.phone, IDS.guests, IDS.message].forEach((id) => {
      const node = byId(id);
      if (!node) return;
      node.addEventListener("input", updateContactLinks);
      node.addEventListener("change", updateContactLinks);
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        setGuestsFromTotal(byId(IDS.guests)?.defaultValue || "4");
        setCheckoutVisibility(false);
        closeBookingPopovers();
        updateSummary();
      }, 0);
    });
  }

  function bindCalendarPopover() {
    const arrivalTrigger = byId(IDS.arrivalTrigger);
    const departureTrigger = byId(IDS.departureTrigger);
    const closeButton = byId(IDS.closeCalendar);

    if (arrivalTrigger) {
      arrivalTrigger.addEventListener("click", (event) => {
        const anchorEl = event.currentTarget instanceof HTMLElement ? event.currentTarget : arrivalTrigger;
        const popover = byId(IDS.calendarPopover);
        const willOpen = Boolean(popover?.hidden);
        setCalendarOpen(willOpen, { anchorEl });
      });
    }

    if (departureTrigger) {
      departureTrigger.addEventListener("click", (event) => {
        const anchorEl = event.currentTarget instanceof HTMLElement ? event.currentTarget : departureTrigger;
        const popover = byId(IDS.calendarPopover);
        const willOpen = Boolean(popover?.hidden);
        setCalendarOpen(willOpen, { anchorEl });
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        setCalendarOpen(false);
      });
    }
  }

  function bindGuestPopover() {
    const trigger = byId(IDS.guestTrigger);
    const closeButton = byId(IDS.closeGuests);

    if (trigger) {
      trigger.addEventListener("click", () => {
        const popover = byId(IDS.guestPopover);
        const willOpen = Boolean(popover?.hidden);
        setGuestOpen(willOpen);
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        setGuestOpen(false);
      });
    }

    const controls = [
      [IDS.guestAdultsMinus, "adults", -1],
      [IDS.guestAdultsPlus, "adults", 1],
      [IDS.guestChildrenMinus, "children", -1],
      [IDS.guestChildrenPlus, "children", 1]
    ];

    controls.forEach(([id, group, delta]) => {
      const button = byId(id);
      if (!button) return;
      button.addEventListener("click", () => {
        tryUpdateGuests(group, delta);
      });
    });
  }

  function bindPopoverDismiss() {
    const stack = document.querySelector(".date-picker-stack");
    const arrivalTrigger = byId(IDS.arrivalTrigger);
    const departureTrigger = byId(IDS.departureTrigger);
    const guestTrigger = byId(IDS.guestTrigger);

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (stack?.contains(target)) return;
      if (arrivalTrigger?.contains(target)) return;
      if (departureTrigger?.contains(target)) return;
      if (guestTrigger?.contains(target)) return;

      closeBookingPopovers();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeBookingPopovers();
      }
    });

    window.addEventListener("resize", () => {
      const popover = byId(IDS.calendarPopover);
      if (!popover) return;

      const shouldRender = state.renderedMonths !== monthsToShow();
      if (shouldRender) {
        renderCalendar();
        return;
      }

      if (!popover.hidden) {
        positionCalendarPopover();
      }
    });
  }

  function bindCheckoutTrigger() {
    const trigger = byId(IDS.startCheckout);
    const checkout = byId(IDS.checkoutDetails);
    if (!trigger || !checkout) return;

    trigger.addEventListener("click", () => {
      const { start, end } = state.selection;
      if (!start || !end) {
        setRangeStatus("Selecteer eerst aankomst en vertrek in de kalender.");
        setCalendarOpen(true);
        return;
      }

      const nights = nightsBetween(start, end);
      if (nights < minNights()) {
        setRangeStatus(`Je selectie telt ${nights} nachten. Minimumverblijf is ${minNights()} nachten.`);
        setCalendarOpen(true);
        return;
      }

      setCheckoutVisibility(true);
      closeBookingPopovers();
      checkout.scrollIntoView({ behavior: "smooth", block: "start" });
      const nameNode = byId(IDS.name);
      if (nameNode) nameNode.focus();
    });
  }

  function bindStripeCheckout() {
    const button = byId(IDS.stripeCheckout);
    if (!button) return;

    button.addEventListener("click", async () => {
      const selection = getActiveSelection();
      if (!selection) {
        setRangeStatus("Selecteer eerst aankomst en vertrek met voldoende nachten.");
        setCalendarOpen(true);
        updateStripeState();
        return;
      }

      const estimate = estimateRange(selection.start, selection.end);
      if (!estimate?.priced) {
        setPaymentStatus("Stripe checkout is enkel beschikbaar wanneer de periode een vast tarief heeft.");
        updateStripeState();
        return;
      }

      const payload = getFormPayload();

      button.disabled = true;
      setPaymentStatus("Stripe sessie wordt aangemaakt...");

      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            arrival: selection.start,
            departure: selection.end,
            guests: payload.guests,
            name: payload.name,
            email: payload.email,
            phone: payload.phone
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.url) {
          const message = result?.error || "Stripe sessie kon niet worden aangemaakt.";
          throw new Error(message);
        }

        setPaymentStatus("Doorsturen naar beveiligde Stripe checkout...");
        window.location.href = result.url;
      } catch (error) {
        setPaymentStatus(error instanceof Error ? error.message : "Onverwachte fout bij Stripe checkout.");
        updateStripeState();
      }
    });
  }

  function bindCalendarControls() {
    const prev = byId(IDS.prev);
    const next = byId(IDS.next);
    const clear = byId(IDS.clear);

    if (prev) {
      prev.addEventListener("click", () => {
        state.viewDate = clampViewDate(shiftMonth(state.viewDate, -1));
        renderCalendar();
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        state.viewDate = clampViewDate(shiftMonth(state.viewDate, 1));
        renderCalendar();
      });
    }

    if (clear) {
      clear.addEventListener("click", clearSelection);
    }
  }

  function normalizeRange(range) {
    if (!range || !isIsoDate(range.start) || !isIsoDate(range.end)) return null;
    let start = range.start;
    let end = range.end;
    if (end < start) {
      const swap = start;
      start = end;
      end = swap;
    }
    return { start, end, reason: cleanText(range.reason || "") };
  }

  function normalizeSeason(season) {
    if (!season || !isIsoDate(season.start) || !isIsoDate(season.end)) return null;

    let start = season.start;
    let end = season.end;
    if (end < start) {
      const swap = start;
      start = end;
      end = swap;
    }

    const nightlyRate = numberValue(season.nightly_rate, NaN);

    return {
      name: cleanText(season.name || "Seizoen"),
      start,
      end,
      nightly_rate: Number.isFinite(nightlyRate) ? nightlyRate : null
    };
  }

  function normalizeData(raw) {
    const fallback = state.data;

    const minNightsValue = Math.max(Math.floor(numberValue(raw?.min_nights, fallback.min_nights)), 1);

    const normalized = {
      currency: cleanText(raw?.currency || fallback.currency) || "EUR",
      timezone: cleanText(raw?.timezone || fallback.timezone) || "Europe/Madrid",
      checkin: cleanText(raw?.checkin || fallback.checkin) || "16:00",
      checkout: cleanText(raw?.checkout || fallback.checkout) || "10:00",
      min_nights: minNightsValue,
      pricing_disclaimer: cleanText(raw?.pricing_disclaimer || fallback.pricing_disclaimer),
      pricing_rules: {
        cleaning_fee: Math.max(numberValue(raw?.pricing_rules?.cleaning_fee, fallback.pricing_rules.cleaning_fee), 0),
        security_deposit: Math.max(numberValue(raw?.pricing_rules?.security_deposit, fallback.pricing_rules.security_deposit), 0)
      },
      seasons: Array.isArray(raw?.seasons)
        ? raw.seasons.map(normalizeSeason).filter(Boolean)
        : fallback.seasons,
      blocked: Array.isArray(raw?.blocked)
        ? raw.blocked.map(normalizeRange).filter(Boolean)
        : fallback.blocked
    };

    normalized.seasons.sort((a, b) => a.start.localeCompare(b.start));
    normalized.blocked.sort((a, b) => a.start.localeCompare(b.start));

    return normalized;
  }

  async function loadAvailability() {
    const response = await fetch("./data/availability.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("availability.json kon niet geladen worden");
    }

    const json = await response.json();
    state.data = normalizeData(json);
  }

  function bindNavigation() {
    const toggle = byId(IDS.navToggle);
    const panel = byId(IDS.navPanel);
    if (!toggle || !panel) return;

    function closeNav() {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    panel.querySelectorAll("[data-nav-link]").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  function handlePaymentReturnStatus() {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return;

    if (payment === "success") {
      setPaymentStatus("Stripe betaling ontvangen. We nemen persoonlijk contact op voor verdere afhandeling.");
    } else if (payment === "cancel") {
      setPaymentStatus("Stripe betaling geannuleerd. Je kan op elk moment opnieuw proberen.");
    }

    params.delete("payment");
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash || ""}`;
    window.history.replaceState({}, "", nextUrl);
  }

  async function init() {
    bindNavigation();
    handlePaymentReturnStatus();
    renderLegend();
    bindCalendarControls();
    setGuestsFromTotal(byId(IDS.guests)?.value || "4");
    setCheckoutVisibility(false);
    bindInputs();
    bindCalendarPopover();
    bindGuestPopover();
    bindPopoverDismiss();
    bindCheckoutTrigger();
    bindStripeCheckout();

    try {
      await loadAvailability();
      setHint("Kies aankomst en vertrek om je aanvraag klaar te zetten.");
    } catch (error) {
      setHint("De kalenderdata laden nu niet. Je kan wel meteen contact opnemen.");
      console.error(error);
    }

    updateStaticFields();
    renderSeasons();
    updateSummary();
    renderCalendar();
    updateContactLinks();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
