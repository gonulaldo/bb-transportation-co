import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

/* ---------- Business details ---------- */
const BIZ = {
  name: "BB Transpo and Company",
  subtitle: "Transportation & Event Logistics",
  contactName: "Brandon Brodecki",
  contactTitle: "Transportation Captain, Local 399",
  phone: "1 (310) 318-4022",
  phoneHref: "+13103184022",
  email: "brandonbrodecki@gmail.com",
  serviceArea: "Los Angeles & surrounding region",
  // 👇 Replace with your real Calendly link (keep the ?... part so it matches the theme)
  calendly:
    "https://calendly.com/your-link/30min?hide_gdpr_banner=1",
};

const FLEET = [
  { name: "15-Passenger Van", price: "$250", unit: "per day", desc: "Comfortable group transport for crews, teams, weddings and airport runs." },
  { name: "Tractor Trailer", price: "$350", unit: "per day", desc: "Heavy-haul capacity for freight, equipment and large-scale logistics." },
  { name: "VIP People Mover", price: "$750", unit: "per 10 hrs", desc: "Premium shuttle for guests, talent and clients who travel in style." },
  { name: "VIP Restroom Trailer", price: "$950", unit: "per day", desc: "Upscale, climate-controlled restrooms that elevate any event or job site." },
  { name: "Starlink Internet", price: "$250", unit: "per day", desc: "High-speed satellite internet anywhere — remote sites, events, off-grid." },
];

/* ---------- Auto-detect photos in public/images ---------- */
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
function getImages() {
  const dir = path.join(__dirname, "public", "images");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort();
  } catch {
    return [];
  }
}
function caption(filename) {
  return filename
    .replace(/\.[^.]+$/, "")        // drop extension
    .replace(/^\d+[-_\s]*/, "")     // drop leading number prefix
    .replace(/[-_]+/g, " ")          // dashes -> spaces
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ---------- Shared page shell ---------- */
function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; background: #fff; color: #111;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
  a { color: inherit; }
  .wrap { max-width: 1000px; margin: 0 auto; padding: 0 22px; }
  nav { border-bottom: 1px solid #eee; }
  nav .wrap { display: flex; gap: 26px; align-items: center; height: 60px; }
  nav .brand { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: bold; font-size: 1.15rem; margin-right: auto; }
  nav a { text-decoration: none; color: #555; font-size: .9rem; text-transform: uppercase; letter-spacing: 1px; }
  nav a:hover { color: #111; }
  header.hero { text-align: center; padding: 64px 0 26px; }
  header.hero h1 { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: bold; font-size: clamp(2.1rem, 6vw, 3.4rem); margin: 0; }
  header.hero .sub { text-transform: uppercase; letter-spacing: 4px; font-size: .82rem; color: #666; margin-top: 12px; }
  .badges { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 22px 0 4px; }
  .badge { border: 1px solid #ddd; border-radius: 999px; padding: 6px 14px; font-size: .8rem; text-transform: uppercase; letter-spacing: 1px; color: #333; }
  section { padding: 30px 0; border-top: 1px solid #f0f0f0; }
  h2 { font-family: Georgia, serif; font-style: italic; font-size: 1.5rem; margin: 0 0 16px; }
  .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
  .gallery figure { margin: 0; }
  .gallery img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; display: block; }
  .gallery figcaption { font-size: .82rem; color: #666; margin-top: 6px; text-align: center; }
  .facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
  .fact { border: 1px solid #eee; border-radius: 10px; padding: 16px; text-align: center; }
  .fact .k { font-size: .72rem; text-transform: uppercase; letter-spacing: 1px; color: #888; }
  .fact .v { font-family: Georgia, serif; font-size: 1.25rem; margin-top: 4px; }
  ul.list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 8px 26px; }
  ul.list li { padding: 8px 0; border-bottom: 1px solid #f3f3f3; }
  ul.list li .price { float: right; font-weight: 600; }
  ul.list li small { color: #888; font-weight: 400; }
  .cta { display: flex; flex-wrap: wrap; gap: 12px; margin: 8px 0 0; }
  .btn { display: inline-block; text-decoration: none; padding: 13px 24px; border-radius: 8px; font-size: .95rem; }
  .btn-solid { background: #111; color: #fff; }
  .btn-solid:hover { background: #333; }
  .btn-outline { border: 1px solid #111; color: #111; }
  .btn-outline:hover { background: #111; color: #fff; }
  .contact-line { margin: 6px 0; }
  .contact-line span { display: inline-block; min-width: 90px; color: #888; text-transform: uppercase; font-size: .72rem; letter-spacing: 1px; }
  footer { border-top: 1px solid #eee; padding: 30px 0; color: #999; font-size: .85rem; text-align: center; }
  .calendly-inline-widget { min-width: 320px; height: 740px; }
</style>
</head>
<body>
  <nav><div class="wrap">
    <a class="brand" href="/">${BIZ.name}</a>
    <a href="/">Home</a>
    <a href="/schedule">Schedule</a>
    <a href="/contact">Contact</a>
  </div></nav>
  ${body}
  <footer><div class="wrap">&copy; ${new Date().getFullYear()} ${BIZ.name}. ${BIZ.serviceArea}.</div></footer>
</body>
</html>`;
}

/* ---------- Home ---------- */
app.get("/", (req, res) => {
  const images = getImages();
  const gallery = images.length
    ? `<div class="gallery">${images
        .map(
          (img) =>
            `<figure><img src="/images/${img}" alt="${caption(img)}" loading="lazy" /><figcaption>${caption(img)}</figcaption></figure>`
        )
        .join("")}</div>`
    : `<p style="color:#888">Add photos to <code>public/images</code> and they'll show up here automatically.</p>`;

  const fleetList = `<ul class="list">${FLEET.map(
    (f) =>
      `<li>${f.name} <span class="price">${f.price} <small>${f.unit}</small></span></li>`
  ).join("")}</ul>`;

  const body = `
  <header class="hero">
    <div class="wrap">
      <h1>${BIZ.name}</h1>
      <div class="sub">${BIZ.subtitle}</div>
      <div class="badges">
        <span class="badge">Fully Insured</span>
        <span class="badge">24/7 Dispatch</span>
        <span class="badge">Professional Drivers</span>
      </div>
    </div>
  </header>

  <div class="wrap">
    <section>
      <h2>Our Fleet</h2>
      ${gallery}
    </section>

    <section>
      <h2>Quick Facts</h2>
      <div class="facts">
        <div class="fact"><div class="k">Categories</div><div class="v">5</div></div>
        <div class="fact"><div class="k">Dispatch</div><div class="v">24/7</div></div>
        <div class="fact"><div class="k">Coverage</div><div class="v">LA Area</div></div>
        <div class="fact"><div class="k">Insured</div><div class="v">Fully</div></div>
      </div>
    </section>

    <section>
      <h2>About</h2>
      <p>${BIZ.name} provides reliable transportation and event logistics — from passenger vans and tractor trailers to VIP people movers, luxury restroom trailers and Starlink internet. One trusted crew, on time, every time.</p>
    </section>

    <section>
      <h2>Fleet &amp; Pricing</h2>
      ${fleetList}
    </section>

    <section>
      <h2>Features</h2>
      <ul class="list">
        <li>Professional drivers available</li>
        <li>Clean, maintained equipment</li>
        <li>Daily &amp; multi-day rates</li>
        <li>Event-ready VIP restrooms</li>
        <li>Off-grid Starlink internet</li>
        <li>Custom bundle packages</li>
      </ul>
    </section>

    <section>
      <h2>Service Area</h2>
      <p>${BIZ.serviceArea}. Traveling outside the area? Ask us about availability.</p>
    </section>

    <section>
      <h2>Rental Terms</h2>
      <ul class="list">
        <li>Daily &amp; multi-day rates available</li>
        <li>Deposit may apply</li>
        <li>Driver service optional on select vehicles</li>
        <li>Bundle multiple services for a custom rate</li>
      </ul>
    </section>

    <section>
      <h2>Contact</h2>
      <div class="contact-line"><span>Name</span> ${BIZ.contactName}, ${BIZ.contactTitle}</div>
      <div class="contact-line"><span>Phone</span> <a href="tel:${BIZ.phoneHref}">${BIZ.phone}</a></div>
      <div class="contact-line"><span>Email</span> <a href="mailto:${BIZ.email}">${BIZ.email}</a></div>
      <div class="cta">
        <a class="btn btn-solid" href="/contact">Email Me</a>
        <a class="btn btn-outline" href="/schedule">Schedule a Time</a>
      </div>
    </section>
  </div>`;

  res.send(page(BIZ.name, body));
});

/* ---------- Contact ---------- */
app.get("/contact", (req, res) => {
  const subject = encodeURIComponent("Rental inquiry — B+B Transportation");
  const body = `
  <header class="hero"><div class="wrap">
    <h1>Get in Touch</h1>
    <div class="sub">We reply fast</div>
  </div></header>
  <div class="wrap">
    <section style="border-top:none">
      <p>Tell us what you need and when — vehicle, dates, location and headcount — and we'll get back to you with availability and a price.</p>
      <div class="contact-line"><span>Name</span> ${BIZ.contactName}, ${BIZ.contactTitle}</div>
      <div class="contact-line"><span>Phone</span> <a href="tel:${BIZ.phoneHref}">${BIZ.phone}</a></div>
      <div class="contact-line"><span>Email</span> <a href="mailto:${BIZ.email}">${BIZ.email}</a></div>
      <div class="cta">
        <a class="btn btn-solid" href="mailto:${BIZ.email}?subject=${subject}">Email Me</a>
        <a class="btn btn-outline" href="/schedule">Schedule a Time</a>
      </div>
    </section>
  </div>`;
  res.send(page("Contact — " + BIZ.name, body));
});

/* ---------- Schedule (Calendly) ---------- */
app.get("/schedule", (req, res) => {
  const body = `
  <header class="hero"><div class="wrap">
    <h1>Schedule a Time</h1>
    <div class="sub">Pick a slot that works for you</div>
  </div></header>
  <div class="wrap">
    <section style="border-top:none">
      <div class="calendly-inline-widget" data-url="${BIZ.calendly}"></div>
      <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
    </section>
  </div>`;
  res.send(page("Schedule — " + BIZ.name, body));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:" + (process.env.PORT || 3000));
});
