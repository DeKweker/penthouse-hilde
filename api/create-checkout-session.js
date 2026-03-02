const fs = require("fs/promises");
const path = require("path");

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function numberValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isIsoDate(value) {
  return typeof value === "string" && ISO_RE.test(value);
}

function isoToDate(iso) {
  if (!isIsoDate(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  const normalized = `${year.toString().padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (dateToIso(date) !== normalized) return null;
  return date;
}

function dateToIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function cleanText(value, max = 120) {
  const text = String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  return text.slice(0, max);
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
  return { start, end };
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

  const rate = numberValue(season.nightly_rate, NaN);
  if (!Number.isFinite(rate) || rate <= 0) return null;

  return {
    name: cleanText(season.name || "Seizoen", 60),
    start,
    end,
    nightly_rate: rate
  };
}

function nightsBetween(startIso, endIso) {
  const start = isoToDate(startIso);
  const end = isoToDate(endIso);
  if (!start || !end || end <= start) return 0;
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function estimateRange(data, startIso, endIso) {
  const start = isoToDate(startIso);
  const end = isoToDate(endIso);
  if (!start || !end || end <= start) return null;

  const blocked = Array.isArray(data.blocked) ? data.blocked : [];
  const seasons = Array.isArray(data.seasons) ? data.seasons : [];

  const cursor = new Date(start);
  let subtotal = 0;
  let nights = 0;

  while (cursor < end) {
    const iso = dateToIso(cursor);

    const isBlocked = blocked.some((range) => iso >= range.start && iso <= range.end);
    if (isBlocked) {
      return { valid: false, code: "blocked", message: "De geselecteerde periode bevat bezette data." };
    }

    const season = seasons.find((item) => iso >= item.start && iso <= item.end);
    if (!season) {
      return { valid: false, code: "unpriced", message: "Voor deze periode bestaat nog geen actief seizoentarief." };
    }

    subtotal += season.nightly_rate;
    nights += 1;

    cursor.setDate(cursor.getDate() + 1);
  }

  const cleaning = Math.max(numberValue(data?.pricing_rules?.cleaning_fee, 0), 0);
  const deposit = Math.max(numberValue(data?.pricing_rules?.security_deposit, 0), 0);

  return {
    valid: true,
    nights,
    subtotal,
    cleaning,
    deposit,
    total: subtotal + cleaning
  };
}

function validEmail(value) {
  if (!value) return true;
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

async function readAvailabilityData() {
  const filePath = path.join(process.cwd(), "data", "availability.json");
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);

  return {
    currency: cleanText(parsed?.currency || "EUR", 12) || "EUR",
    min_nights: Math.max(Math.floor(numberValue(parsed?.min_nights, 4)), 1),
    pricing_rules: {
      cleaning_fee: Math.max(numberValue(parsed?.pricing_rules?.cleaning_fee, 0), 0),
      security_deposit: Math.max(numberValue(parsed?.pricing_rules?.security_deposit, 0), 0)
    },
    seasons: Array.isArray(parsed?.seasons) ? parsed.seasons.map(normalizeSeason).filter(Boolean) : [],
    blocked: Array.isArray(parsed?.blocked) ? parsed.blocked.map(normalizeRange).filter(Boolean) : []
  };
}

function getOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";

  if (!host) {
    return null;
  }

  return `${proto}://${host}`;
}

async function createStripeSession(secretKey, origin, payload, pricing, currency) {
  const amountEur = pricing.deposit > 0 ? pricing.deposit : pricing.total;
  const unitAmount = Math.round(amountEur * 100);

  if (!Number.isFinite(unitAmount) || unitAmount < 50) {
    throw new Error("Ongeldig Stripe bedrag voor checkout.");
  }

  const description = `${payload.arrival} tot ${payload.departure} (${pricing.nights} nachten)`;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/?payment=success`);
  params.set("cancel_url", `${origin}/?payment=cancel`);
  params.set("line_items[0][price_data][currency]", currency.toLowerCase());
  params.set("line_items[0][price_data][unit_amount]", String(unitAmount));
  params.set("line_items[0][price_data][product_data][name]", "Waarborg Ático Hilsol");
  params.set("line_items[0][price_data][product_data][description]", description);
  params.set("line_items[0][quantity]", "1");

  if (payload.email) {
    params.set("customer_email", payload.email);
  }

  params.set("metadata[arrival]", payload.arrival);
  params.set("metadata[departure]", payload.departure);
  params.set("metadata[nights]", String(pricing.nights));
  params.set("metadata[guests]", String(payload.guests));
  params.set("metadata[name]", payload.name || "n/a");
  params.set("metadata[phone]", payload.phone || "n/a");

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.url) {
    const errorMessage = result?.error?.message || "Stripe checkout kon niet worden aangemaakt.";
    throw new Error(errorMessage);
  }

  return {
    url: result.url,
    session_id: result.id,
    amount: unitAmount / 100,
    currency: currency.toUpperCase()
  };
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Allow", "POST,OPTIONS");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    json(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      json(res, 500, { error: "Stripe is niet geconfigureerd op de server." });
      return;
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const arrival = cleanText(body.arrival, 20);
    const departure = cleanText(body.departure, 20);
    const guests = Math.max(1, Math.min(8, Math.floor(numberValue(body.guests, 4))));
    const name = cleanText(body.name, 80);
    const email = cleanText(body.email, 120).toLowerCase();
    const phone = cleanText(body.phone, 40);

    if (!isIsoDate(arrival) || !isIsoDate(departure)) {
      json(res, 400, { error: "Ongeldige aankomst- of vertrekdatum." });
      return;
    }

    const todayIso = dateToIso(new Date());
    if (arrival < todayIso) {
      json(res, 400, { error: "Aankomst in het verleden is niet toegestaan." });
      return;
    }

    if (!validEmail(email)) {
      json(res, 400, { error: "Ongeldig e-mailadres." });
      return;
    }

    const availability = await readAvailabilityData();
    const nights = nightsBetween(arrival, departure);

    if (nights < availability.min_nights) {
      json(res, 400, { error: `Minimumverblijf is ${availability.min_nights} nachten.` });
      return;
    }

    const pricing = estimateRange(availability, arrival, departure);
    if (!pricing?.valid) {
      json(res, 400, { error: pricing?.message || "Deze periode is niet beschikbaar." });
      return;
    }

    const origin = getOrigin(req);
    if (!origin) {
      json(res, 400, { error: "Kon de site-origin niet bepalen voor Stripe redirect." });
      return;
    }

    const session = await createStripeSession(secretKey, origin, {
      arrival,
      departure,
      guests,
      name,
      email,
      phone
    }, pricing, availability.currency || "EUR");

    json(res, 200, {
      url: session.url,
      session_id: session.session_id,
      amount: session.amount,
      currency: session.currency
    });
  } catch (error) {
    console.error("create-checkout-session error", error);
    json(res, 500, {
      error: error instanceof Error ? error.message : "Onverwachte fout bij Stripe checkout."
    });
  }
};
