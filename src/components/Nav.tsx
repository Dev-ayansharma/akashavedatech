import { useEffect, useState } from 'react';
import { CONTACT_EMAIL, NAV_LINKS } from '../data/content';
import { useTick } from '../hooks/useTick';
import { useViewportWidth } from '../hooks/useViewportWidth';

const utc = () => {
  const t = new Date();
  return 'UTC ' + [t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
};

/** Ticks once a second on its own so the rest of the nav doesn't re-render. */
export function Clock() {
  useTick(1000);
  return <>{utc()}</>;
}

/** On a product page its link is active; on the home page, the link for the chapter in view. */
const isActive = (l: (typeof NAV_LINKS)[number], ch: number) =>
  location.pathname === '/' ? l.ch.includes(ch) : location.pathname.startsWith(l.href);

export function Nav({ statusColor, activeChapter = 0 }: { statusColor: string; activeChapter?: number }) {
  const w = useViewportWidth();
  const phone = w < 768;
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = phone && mobileOpen;

  // Full-screen menu: the page behind stops scrolling, Escape closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav className="nav">
      <a href={location.pathname === '/' ? '#top' : '/'} className="nav-brand">AKASHAVEDA</a>

      {!phone && (
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`nav-link ${isActive(l, activeChapter) ? 'active' : ''}`}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      {w >= 1024 && (
        <span className="nav-clock">
          <span className="nav-live-dot" style={{ background: statusColor }} />
          <Clock />
        </span>
      )}

      {phone && (
        <button onClick={() => setMobileOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="nav-sheet" className={`nav-mobile-toggle ${open ? 'open' : ''}`}>
          <span aria-hidden="true" />
        </button>
      )}

      {open && (
        <div id="nav-sheet" className="nav-sheet">
          <nav aria-label="Menu" className="nav-sheet-links">
            {NAV_LINKS.map((l, i) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className={`nav-mobile-link ${isActive(l, activeChapter) ? 'active' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
                <span className="nav-sheet-num">0{i + 1}</span>
                {l.label}
              </a>
            ))}
            <a href="/#contact" onClick={() => setMobileOpen(false)} className="nav-mobile-link" style={{ animationDelay: `${NAV_LINKS.length * 60}ms` }}>
              <span className="nav-sheet-num">0{NAV_LINKS.length + 1}</span>
              CONTACT
            </a>
          </nav>
          <div className="nav-sheet-foot">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <span><Clock /></span>
          </div>
        </div>
      )}
    </nav>
  );
}
