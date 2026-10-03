import { memo, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { CONTACT_EMAIL, DEPLOY, HOME_FAQ, INTERESTS, TEAM, USES } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { Clock } from './Nav';
import { Faq, Split } from './ui';
import type { SpaceBg } from '../scene/spaceBg';

/* ─── Starfield behind the lower page ────────────────────────── */

export function SpaceBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const bg = useRef<SpaceBg | null>(null);
  useEffect(() => {
    let disposed = false;
    import('../scene/spaceBg.js').then((m) => {
      if (disposed || !ref.current) return;
      bg.current = m.mountSpace(ref.current);
    });
    return () => {
      disposed = true;
      bg.current?.dispose();
      bg.current = null;
    };
  }, []);
  return <div ref={ref} aria-hidden="true" className="lw-stars" />;
}

/** Section opener: gold eyebrow, then one bold uppercase line. */
function Head({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <header className="lw-head" data-reveal>
      <p className="lw-eyebrow">{eyebrow}</p>
      <h2 className="lw-title">{typeof children === 'string' ? <Split text={children} /> : children}</h2>
    </header>
  );
}

/* ─── Deployment ─────────────────────────────────────────────── */

const DEPLOY_ICONS = [
  // Cloud: a link up to a hosted core
  <svg key="cloud" viewBox="0 0 48 48" aria-hidden="true"><path d="M14 34h21a8 8 0 0 0 0-16 11 11 0 0 0-21-2A9 9 0 0 0 14 34Z" /><path d="M19 27l4-4 4 3 6-6" /></svg>,
  // On-premise: a rack inside a closed perimeter
  <svg key="prem" viewBox="0 0 48 48" aria-hidden="true"><rect x="15" y="10" width="18" height="28" rx="1" /><path d="M19 16h10M19 22h10M19 28h10" /><path d="M8 42h32M8 6v36M40 6v36" /></svg>,
  // Hybrid: a local core joined to the network
  <svg key="hybrid" viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="18" width="14" height="14" rx="1" /><circle cx="36" cy="25" r="7" /><path d="M20 25h9" strokeDasharray="2 3" /><path d="M36 18v-8M36 32v8" /></svg>,
];

function Deployment() {
  return (
    <section id="deploy" className="lw-section">
      <Head eyebrow="Deployment">Runs where your mission needs it.</Head>
      <div className="lw-cols">
        {DEPLOY.map((d, i) => (
          <article key={d.t} className="lw-col spot" data-reveal style={{ '--i': i } as CSSProperties}>
            <span className="lw-icon">{DEPLOY_ICONS[i]}</span>
            <span className="lw-num">0{i + 1}</span>
            <h3>{d.t}</h3>
            <p>{d.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Missions ───────────────────────────────────────────────── */

function Missions() {
  return (
    <section id="missions" className="lw-section lw-split">
      <Head eyebrow="Missions">Built for the missions that depend on the ground.</Head>
      <ol className="lw-list">
        {USES.map((u, i) => (
          <li key={u.n} className="spot" data-reveal style={{ '--i': i } as CSSProperties}>
            <span className="lw-num">{u.n}</span>
            <h3>{u.t}</h3>
            <p>{u.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ─── Leadership ─────────────────────────────────────────────── */

const initials = (n: string) =>
  n.replace(/^Dr /, '').split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('');

function Team() {
  return (
    <section id="team" className="lw-section">
      <Head eyebrow="Leadership">RF and space systems, from the ground up.</Head>
      <div className="lw-team">
        {TEAM.map((p, i) => (
          <article key={p.n} className="lw-person spot" data-reveal style={{ '--i': i } as CSSProperties}>
            <span className="lw-initials" aria-hidden="true">{initials(p.n)}</span>
            <h3>{p.n}</h3>
            <p className="lw-role">{p.r}</p>
            <p>{p.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────── */

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [picked, setPicked] = useState<string[]>(['GROUND STATION']);
  const toggle = (t: string) => setPicked((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  // No backend: the form opens a pre-filled email.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `Demo request${name ? ' · ' + name : ''}`;
    const body = [`Name: ${name}`, `Work email: ${email}`, `Interested in: ${picked.join(', ') || '—'}`, '', requirements || '(No requirements given)'].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="lw-section lw-split">
      <div>
        <Head eyebrow="Design partners · open channel">Make the ground segment your advantage.</Head>
        <p className="lw-lede">Schedule a live demonstration, or talk to us about ground station passes, mission control and constellation operations.</p>
        <a className="lw-mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
      <form className="lw-form" onSubmit={submit} data-reveal>
        <label>
          <span>Name</span>
          <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          <span>Work email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          <span>Requirements</span>
          <textarea rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)} />
        </label>
        <fieldset>
          <legend>Interested in</legend>
          <div className="lw-chips">
            {INTERESTS.map((t) => (
              <button key={t} type="button" aria-pressed={picked.includes(t)} onClick={() => toggle(t)}>{t}</button>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="lw-submit">Transmit request →</button>
      </form>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */

const FOOT = [
  { h: 'Products', links: [['Ground station', '/ground-station'], ['Vyuh · mission control', '/vyuh'], ['Chakra · space safety', '/chakra']] },
  { h: 'Company', links: [['Deployment', '/#deploy'], ['Missions', '/#missions'], ['Leadership', '/#team']] },
  { h: 'Contact', links: [['Request a demo', '/#contact'], [CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`]] },
];

export function Footer() {
  return (
    <footer className="lw-footer">
      <div className="lw-foot-grid">
        <div className="lw-foot-brand">
          <a href="/" className="lw-wordmark">AKASHAVEDA</a>
          <p>Ground segment as a service. Connect, control and comprehend every pass.</p>
          <p className="lw-foot-meta">
            <span className="lw-foot-dot" aria-hidden="true" />
            <Clock /> · HQ Bangalore, India
          </p>
        </div>
        {FOOT.map((c) => (
          <nav key={c.h} aria-label={c.h}>
            <p className="lw-foot-h">{c.h}</p>
            {c.links.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
          </nav>
        ))}
      </div>
      <div className="lw-foot-bar">
        <span>© 2026 Akashaveda. All rights reserved.</span>
        <span>Console figures on this site are illustrative.</span>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a>
      </div>
      {/* Sized to the content width (SVG textLength), so it never runs off the edge. */}
      <div className="lw-giant-wrap" aria-hidden="true">
        <svg className="lw-giant" viewBox="0 0 1000 118">
          <text x="0" y="110" textLength="1000" lengthAdjust="spacing">AKASHAVEDA</text>
        </svg>
      </div>
    </footer>
  );
}

/* ─── Composition ────────────────────────────────────────────── */

/** Memoized: the page below the journey doesn't depend on the active chapter. */
export const Lower = memo(function Lower() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div className="lw" ref={root}>
      <SpaceBackdrop />
      <div className="lw-inner">
        <Deployment />
        <Missions />
        <Team />
        <section id="faq" className="lw-section lw-split">
          <Head eyebrow="Questions">Ground segment, answered.</Head>
          <Faq items={HOME_FAQ} />
        </section>
        <Contact />
      </div>
      <Footer />
    </div>
  );
});
