// After `vite build`: one real HTML file per page, so search engines and AI crawlers that don't run JavaScript
// still get each page's title, description, canonical URL, social tags, structured data (JSON-LD) and full text.
// The app replaces the text when it starts (index.html hides it from JS readers). Also writes sitemap.xml,
// robots.txt and llms.txt. Copy comes from src/data, the same source the pages render from.
// Run: npm run build (runs this last), or npm run seo after a build. Set SITE_URL for another domain.
import fs from 'node:fs';
import path from 'node:path';
import { CONTACT_EMAIL, DEPLOY, HOME_FAQ, LOOP, TEAM, USES } from '../src/data/content.ts';
import { PRODUCTS } from '../src/data/products.ts';

const SITE = (process.env.SITE_URL || 'https://akashaveda.com').replace(/\/$/, '');
const DIST = 'dist';
const ORG_ID = `${SITE}/#org`;
const IMAGE = `${SITE}/logo.png`;
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

const HOME = {
  path: '/',
  title: 'Akashaveda · Ground segment as a service',
  description: 'Ground station passes, mission control and space safety for satellite operators: the GS-01 tri-band ground station, Vyuh mission control and Chakra SSA.',
};

/* ─── Structured data ───────────────────────────────────────── */

const org = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Akashaveda',
  url: `${SITE}/`,
  logo: IMAGE,
  email: CONTACT_EMAIL,
  slogan: 'Space is far. We keep it close.',
  description: 'Ground segment as a service: ground station passes, mission control and space situational awareness for satellite operators.',
  address: { '@type': 'PostalAddress', addressLocality: 'Bangalore', addressCountry: 'IN' },
  employee: TEAM.filter((p) => !/advisor/i.test(p.r)).map((p) => ({ '@type': 'Person', name: p.n, jobTitle: p.r.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) })),
  knowsAbout: ['Ground station as a service', 'TT&C', 'Satellite mission control', 'Flight dynamics', 'Space situational awareness', 'Conjunction screening', 'Collision avoidance'],
};
const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Akashaveda', publisher: { '@id': ORG_ID } };
const faqPage = (url, items) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

function graph(page) {
  const url = SITE + page.path;
  if (page === HOME) return [org, website, { '@type': 'WebPage', '@id': url, url, name: page.title, description: page.description, isPartOf: { '@id': website['@id'] }, about: { '@id': ORG_ID } }, faqPage(url, HOME_FAQ)];
  return [
    org,
    website,
    { '@type': 'Service', '@id': `${url}#service`, name: page.name, serviceType: page.eyebrow.split('·').pop().trim(), description: page.lede, url, provider: { '@id': ORG_ID } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Akashaveda', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: page.name, item: url }] },
    faqPage(url, page.faq),
  ];
}

/* ─── Page text ─────────────────────────────────────────────── */

const faqHtml = (items) => `<section><h2>Questions</h2><dl>${items.map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join('')}</dl></section>`;

function blockHtml(b) {
  switch (b.kind) {
    case 'flow': return `<ol>${b.steps.map((s) => `<li>${s.k ? `${esc(s.k)}: ` : ''}<strong>${esc(s.t)}</strong>${s.d ? ` — ${esc(s.d)}` : ''}</li>`).join('')}</ol>`;
    case 'specs': return `<p><strong>${esc(b.big)}</strong> ${esc(b.note)}</p><dl>${b.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
    case 'features': return `${b.label ? `<h3>${esc(b.label)}</h3>` : ''}<ul>${b.items.map((f) => `<li><strong>${esc(f.t)}</strong> — ${esc(f.d)}</li>`).join('')}</ul>`;
    case 'layers': return `<ol>${b.items.map((l) => `<li>${esc(l.k)}: <strong>${esc(l.t)}</strong> — ${esc(l.d)}</li>`).join('')}</ol>`;
    case 'list': return `<h3>${esc(b.label)}</h3><ul>${b.items.map((l) => `<li>${esc(l.k)}: <strong>${esc(l.t)}</strong>${l.d ? ` — ${esc(l.d)}` : ''}</li>`).join('')}</ul>`;
    case 'stats': return `<h3>${esc(b.label)}</h3><ul>${b.items.map((s) => `<li><strong>${esc(s.v)}</strong> ${esc(s.k)}</li>`).join('')}</ul>`;
    case 'note': return `<p><strong>${esc(b.strong)}</strong> ${esc(b.text)}</p>`;
    case 'callout': return `<aside><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p></aside>`;
  }
  return '';
}

const productNav = `<nav><a href="/">Akashaveda</a> · ${PRODUCTS.map((p) => `<a href="${p.path}">${esc(p.name)}</a>`).join(' · ')}</nav>`;
const contact = `<footer><p>Contact: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> · HQ Bangalore, India</p></footer>`;

function bodyHtml(page) {
  if (page === HOME)
    return `${productNav}<main><header><p>Ground segment as a service</p><h1>Space is far. We keep it close.</h1><p>${esc(page.description)}</p></header>`
      + `<section><h2>Products</h2>${PRODUCTS.map((p) => `<article><h3><a href="${p.path}">${esc(p.name)}</a></h3><p>${esc(p.title)} ${esc(p.lede)}</p></article>`).join('')}</section>`
      + `<section><h2>Closing the loop</h2><ol>${LOOP.map((l) => `<li>${esc(l.k)}: ${esc(l.t)}</li>`).join('')}</ol></section>`
      + `<section><h2>Deployment</h2><ul>${DEPLOY.map((d) => `<li><strong>${esc(d.t)}</strong> — ${esc(d.d)}</li>`).join('')}</ul></section>`
      + `<section><h2>Missions</h2><ul>${USES.map((u) => `<li><strong>${esc(u.t)}</strong> — ${esc(u.d)}</li>`).join('')}</ul></section>`
      + `<section><h2>Leadership</h2><ul>${TEAM.map((p) => `<li><strong>${esc(p.n)}</strong>, ${esc(p.r.toLowerCase())} — ${esc(p.d)}</li>`).join('')}</ul></section>`
      + `${faqHtml(HOME_FAQ)}</main>${contact}`;
  return `${productNav}<main><header><p>${esc(page.eyebrow)}</p><h1>${esc(page.title)}</h1><p>${esc(page.lede)}</p></header>`
    + page.sections.map((s) => `<section><h2>${esc(s.title || s.eyebrow)}</h2>${s.blocks.map(blockHtml).join('')}</section>`).join('')
    + `${faqHtml(page.faq)}<p><a href="/#contact">${esc(page.cta)} Talk to us.</a></p></main>${contact}`;
}

/* ─── Write the pages ───────────────────────────────────────── */

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const pages = [HOME, ...PRODUCTS.map((p) => ({ ...p, title: p.seoTitle, description: p.lede }))];

for (const page of pages) {
  const url = SITE + (page.path === '/' ? '/' : page.path);
  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Akashaveda" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${IMAGE}" />`,
    `<meta property="og:image:alt" content="Akashaveda" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${IMAGE}" />`,
    `<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': graph(page) })}</script>`,
  ].join('\n    ');
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(page.description)}" />`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="seo-static">${bodyHtml(page)}</div></div>`);
  const out = page.path === '/' ? path.join(DIST, 'index.html') : path.join(DIST, page.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`seo: ${out}`);
}

/* ─── Crawler files ─────────────────────────────────────────── */

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><priority>${p === HOME ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);

// Search and AI crawlers are all welcome; the named ones are listed so the intent is explicit.
fs.writeFileSync(path.join(DIST, 'robots.txt'), `${['*', 'Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'].map((a) => `User-agent: ${a}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE}/sitemap.xml
`);

// llms.txt: a plain-language brief for AI assistants (llmstxt.org).
const md = (p) => `## ${p.name}\n\n${p.title} ${p.lede}\n\n${p.sections.flatMap((s) => s.blocks).map((b) => {
  if (b.kind === 'specs') return [`- ${b.big} ${b.note}`, ...b.rows.map(([k, v]) => `- ${k}: ${v}`)].join('\n');
  if (b.kind === 'features') return b.items.map((f) => `- ${f.t}: ${f.d}`).join('\n');
  if (b.kind === 'layers') return b.items.map((l) => `- ${l.k} (${l.t}): ${l.d}`).join('\n');
  if (b.kind === 'list') return `${b.label}:\n${b.items.map((l) => `- ${l.k} ${l.t}${l.d ? `: ${l.d}` : ''}`).join('\n')}`;
  if (b.kind === 'stats') return `${b.label}:\n${b.items.map((s) => `- ${s.v} ${s.k}`).join('\n')}`;
  if (b.kind === 'flow') return b.steps.map((s) => `${s.k ? `${s.k}: ` : ''}${s.t}${s.d ? ` (${s.d})` : ''}`).join(' → ');
  if (b.kind === 'note') return `${b.strong} ${b.text}`;
  if (b.kind === 'callout') return `${b.t}: ${b.d}`;
  return '';
}).join('\n\n')}\n\nMore: ${SITE}${p.path}\n`;
fs.writeFileSync(path.join(DIST, 'llms.txt'), `# Akashaveda

> Ground segment as a service. Akashaveda provides ground station passes (GS-01, a 7.5 m S/X/Ka-band station), mission control (Vyuh) and space situational awareness (Chakra) for satellite operators. Headquartered in Bangalore, India. Contact: ${CONTACT_EMAIL}

${PRODUCTS.map(md).join('\n')}
## Deployment

${DEPLOY.map((d) => `- ${d.t}: ${d.d}`).join('\n')}

## Missions served

${USES.map((u) => `- ${u.t}: ${u.d}`).join('\n')}

## Leadership

${TEAM.map((p) => `- ${p.n}, ${p.r.toLowerCase()}: ${p.d}`).join('\n')}

## Questions

${[...HOME_FAQ, ...PRODUCTS.flatMap((p) => p.faq)].map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Pages

- [Home](${SITE}/)
${PRODUCTS.map((p) => `- [${p.name}](${SITE}${p.path})`).join('\n')}
`);
console.log('seo: sitemap.xml, robots.txt, llms.txt');
