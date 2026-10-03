// Page copy and simulated console data. Figures marked illustrative in the UI are not live.

/** Resolutions section (deck, nav link, rail status). Hidden for now; its chapter's scroll space stays as the satellite close-up. */
export const SHOW_RESOLUTIONS = false;

export const NAV_LINKS = [
  { label: 'GROUND', href: '/ground-station', ch: [2, 3] },
  { label: 'VYUH', href: '/vyuh', ch: [4] },
  { label: 'CHAKRA', href: '/chakra', ch: [5] },
  { label: 'RESOLUTIONS', href: '/#resolutions', ch: [1, 6] },
].filter((l) => SHOW_RESOLUTIONS || l.label !== 'RESOLUTIONS');

export const statusColor = (ci: number) =>
  ci === 5 ? 'var(--risk)' : ci === 6 ? 'var(--tc)' : ci === 0 ? 'var(--mute)' : 'var(--acc)';

export const READOUT = [
  { k: 'TERMINAL', v: 'GS-01 · PRIMARY NODE', c: 'var(--ink)' },
  { k: 'NETWORK', v: 'MULTI-BAND TT&C', c: 'var(--ink)' },
  { k: 'TRACKING', v: 'AUTOTRACK ACTIVE', c: 'var(--ink)' },
  { k: 'LINK', v: 'AWAITING AOS', c: 'var(--accT)' },
];

export const PROBLEMS = [
  { k: '01 · REACH', tag: 'GROUND ACCESS', t: 'Contact windows are brief and unforgiving.', d: 'Orbit dynamics, RF pointing, frequency coordination and secure backhaul must align within minutes.', flag: 'NEEDS · GUARANTEED CONTACT WINDOWS' },
  { k: '02 · OPERATE', tag: 'MISSION CONTROL', t: 'Pass duration leaves zero time for manual workflows.', d: 'Operators need live telemetry, pre-validated flight procedures, and secure command authorization.', flag: 'NEEDS · REAL-TIME TELEMETRY & SIGNED COMMANDS' },
  { k: '03 · PROTECT', tag: 'ORBITAL AWARENESS', t: 'Orbital alerts demand rapid, verified decisions.', d: 'Screening close approaches, resolving covariance errors, planning avoidance burns, and verifying safety must happen before TCA.', flag: 'NEEDS · CONJUNCTION TRIAGE & MANEUVER EXECUTION' },
];

export const HANDOFFS = [
  { tool: 'SSA TOOL', t: 'Alert', d: 'Assess risk' },
  { tool: 'MCS TOOL', t: 'Plan', d: 'Approve action' },
  { tool: 'GROUND PROVIDER', t: 'Contact', d: 'Send command' },
  { tool: 'MCS TOOL', t: 'Verify', d: 'Read telemetry' },
];

export const SOLUTION = [
  { k: 'GS', p: 'GROUND ACCESS', t: 'On-demand ground passes', d: 'Scheduled tracking, multi-band TT&C, and high-rate payload downlink across distributed stations.', href: '#ch5' },
  { k: 'MCS · VYUH', p: 'MISSION CONTROL', t: 'Unified mission control', d: 'Fleet-wide telemetry parsing, command queues, and pass execution in one console.', href: '#ch6' },
  { k: 'SSA · CHAKRA', p: 'ORBITAL AWARENESS', t: 'Orbital risk intelligence', d: 'Automated conjunction screening and avoidance maneuvers linked directly to pass execution.', href: '#ch7' },
];

export const LOOP = [
  { k: 'CHAKRA', t: 'Predicts the close approach and designs a re-screened avoidance burn.', c: 'var(--risk)' },
  { k: 'VYUH', t: 'Checks the manoeuvre; the operator approves it.', c: 'var(--accT)' },
  { k: 'GS-01', t: 'The best pass uplinks the encrypted command.', c: 'var(--tc)' },
  { k: 'RECORD', t: 'Telemetry and tracking confirm the new orbit.', c: 'var(--ok)' },
];

export const FLEET = [
  { id: 'SAT-01', plane: 'P1', st: 'IN CONTACT', c: 'var(--ok)' },
  { id: 'SAT-02', plane: 'P1', st: 'PASS 02:14', c: 'var(--mute)' },
  { id: 'SAT-03', plane: 'P1', st: 'NOMINAL', c: 'var(--accT)' },
  { id: 'SAT-04', plane: 'P2', st: 'THERMAL WATCH', c: 'var(--warn)' },
  { id: 'SAT-05', plane: 'P2', st: 'NOMINAL', c: 'var(--accT)' },
  { id: 'SAT-06', plane: 'P2', st: 'PASS 05:40', c: 'var(--mute)' },
];

export const PASSES = [
  { sat: 'SAT-01', w: [{ l: '8%', w: '6%', c: 'var(--acc)' }, { l: '58%', w: '5%', c: 'var(--acc)' }] },
  { sat: 'SAT-02', w: [{ l: '24%', w: '7%', c: 'var(--tc)' }, { l: '76%', w: '6%', c: 'var(--tc)' }] },
  { sat: 'PARTNER', w: [{ l: '40%', w: '8%', c: 'var(--line2)' }] },
];

export interface ConjunctionOption {
  id: string;
  t: string;
  dv: string;
  newMiss: string;
  newPc: string;
  prop: string;
  gw: string;
  rec?: boolean;
}

export interface ConjunctionEvent {
  id: string;
  primary: string;
  obj: string;
  norad: string;
  type: string;
  miss: string;
  dr: string;
  dt: string;
  dn: string;
  vrel: string;
  pc: string;
  risk: string;
  c: string;
  tca: string;
  tcaRel: string;
  sig: string;
  hbr: string;
  rx: number;
  ry: number;
  x: number;
  y: number;
  alt: string;
  options: ConjunctionOption[];
}

export const EVENTS: ConjunctionEvent[] = [
  {
    id: 'CDM-2031',
    primary: 'SAT-01 (NORAD 59281)',
    obj: 'DEB-31448 · FENGYUN-1C DEB',
    norad: 'NORAD 31448',
    type: 'Debris fragment',
    miss: '186.4 m',
    dr: '+38.2 m',
    dt: '-142.6 m',
    dn: '+114.8 m',
    vrel: '14.62 km/s',
    pc: '2.41e-4',
    risk: 'IMMEDIATE ACTION',
    c: 'var(--risk)',
    tca: '2026-10-01 14:48:22 UTC (T+06:42:10)',
    tcaRel: 'T+06:42:10',
    sig: 'σ_R ±14 m · σ_T ±86 m',
    hbr: '2.50 m',
    rx: 70,
    ry: 26,
    x: 146,
    y: 78,
    alt: '564.2 km (SSO)',
    options: [
      {
        id: 'OPT-A',
        t: 'Option A · Prograde burn (Δv 0.124 m/s)',
        dv: '+0.124 m/s',
        newMiss: '2.14 km',
        newPc: '< 1.0e-7',
        prop: '42.6 g N2H4 (0.18% margin)',
        gw: 'GS-01 · Next contact AOS 12:44 UTC',
        rec: true,
      },
      {
        id: 'OPT-B',
        t: 'Option B · Radial trim (Δv 0.082 m/s)',
        dv: '+0.082 m/s',
        newMiss: '1.48 km',
        newPc: '8.2e-7',
        prop: '28.1 g N2H4',
        gw: 'GS-01 · Next contact AOS 12:44 UTC',
        rec: false,
      },
      {
        id: 'OPT-C',
        t: 'Option C · Passive track · Re-screen in 6 h',
        dv: '0.000 m/s',
        newMiss: '186.4 m (unmitigated)',
        newPc: '2.41e-4',
        prop: '0.0 g',
        gw: 'Awaits SSN radar pass #4 at 11:15 UTC',
        rec: false,
      },
    ],
  },
  {
    id: 'CDM-2033',
    primary: 'SAT-04 (NORAD 59284)',
    obj: 'R/B-39087 · CZ-4B SPENT STAGE',
    norad: 'NORAD 39087',
    type: 'Rocket body',
    miss: '742.0 m',
    dr: '+124.0 m',
    dt: '-610.5 m',
    dn: '+402.0 m',
    vrel: '11.84 km/s',
    pc: '4.20e-5',
    risk: 'MONITOR',
    c: 'var(--warn)',
    tca: '2026-10-02 03:11:56 UTC (T+19:05:44)',
    tcaRel: 'T+19:05:44',
    sig: 'σ_R ±32 m · σ_T ±195 m',
    hbr: '4.20 m',
    rx: 84,
    ry: 34,
    x: 176,
    y: 58,
    alt: '571.8 km (SSO)',
    options: [
      {
        id: 'OPT-A',
        t: 'Option A · Maintain tracking watch',
        dv: '0.000 m/s',
        newMiss: '742.0 m (monitoring threshold)',
        newPc: '4.2e-5',
        prop: '0.0 g',
        gw: 'Auto-rescreen on CDM update #3',
        rec: true,
      },
      {
        id: 'OPT-B',
        t: 'Option B · Phasing adjustment (Δv 0.054 m/s)',
        dv: '+0.054 m/s',
        newMiss: '3.60 km',
        newPc: '< 1.0e-7',
        prop: '18.4 g N2H4',
        gw: 'GS-01 · Contact pass 05',
        rec: false,
      },
    ],
  },
  {
    id: 'CDM-2032',
    primary: 'SAT-02 (NORAD 59282)',
    obj: 'SAT-27711 · IRIDIUM-33 DERIVATIVE',
    norad: 'NORAD 27711',
    type: 'Defunct spacecraft',
    miss: '1.42 km',
    dr: '+310.0 m',
    dt: '+1,120 m',
    dn: '-780.0 m',
    vrel: '9.45 km/s',
    pc: '3.12e-6',
    risk: 'ADVISORY',
    c: 'var(--ok)',
    tca: '2026-10-02 15:18:15 UTC (T+31:12:03)',
    tcaRel: 'T+31:12:03',
    sig: 'σ_R ±48 m · σ_T ±310 m',
    hbr: '3.00 m',
    rx: 96,
    ry: 40,
    x: 212,
    y: 40,
    alt: '558.0 km (SSO)',
    options: [
      {
        id: 'OPT-A',
        t: 'Option A · No maneuver required (Pc < 1e-5 threshold)',
        dv: '0.000 m/s',
        newMiss: '1.42 km (nominal clearance)',
        newPc: '3.12e-6',
        prop: '0.0 g',
        gw: 'Routine tracking logging',
        rec: true,
      },
    ],
  },
];

export const PASS_STATS = [
  { k: 'STATUS', v: 'VERIFIED', c: 'var(--ok)' },
  { k: 'CONTACT', v: '08:42', c: 'var(--ink)' },
  { k: 'FRAMES RX', v: '12,480', c: 'var(--tm)' },
  { k: 'TC VERIFIED', v: '2 / 2', c: 'var(--tc)' },
];

export type ProductCode = 'GS' | 'MCS' | 'SSA';
export interface ProductItem {
  code: ProductCode;
  tab: string;
  layer: string;
  t: string;
  d: string;
  pts: string[];
  unit: string;
  actionText: string;
  actionHref: string;
  slaTag: string;
}

export const PRODUCTS: ProductItem[] = [
  {
    code: 'GS',
    tab: 'GROUND STATION (GS)',
    layer: 'CONTACT & DELIVERY',
    t: 'Ground station network',
    d: 'On-demand and reserved antenna passes with reliable TT&C, high-rate payload downlink, and low-latency backhaul across distributed apertures.',
    pts: [
      'Multi-band TT&C with S, X, and Ka-band frequency support',
      'High-throughput payload downlinks up to 600 Mbps with secure backhaul',
      'Automated API pass scheduling with real-time Doppler tracking',
    ],
    unit: 'Per scheduled contact minute or reserved SLA capacity',
    actionText: 'SCHEDULE A PASS →',
    actionHref: '#contact',
    slaTag: '99.8% AVAILABILITY SLA',
  },
  {
    code: 'MCS',
    tab: 'MISSION CONTROL (VYUH)',
    layer: 'STATE & COMMANDS',
    t: 'Vyuh · Mission control',
    d: 'Unified cloud-native mission control platform that plans, deconflicts, executes, and audits passes and commands across your satellite fleet.',
    pts: [
      'Fleet-wide telemetry decommutation and live limit monitoring',
      'Dual-operator cryptographic command authorization and audit trails',
      'Automated flight procedure queues and live backhaul pipelines',
    ],
    unit: 'Annual fleet license or dedicated enterprise tier',
    actionText: 'EXPLORE VYUH MCS →',
    actionHref: '#ch6',
    slaTag: 'DUAL-OPERATOR AUTHENTICATION',
  },
  {
    code: 'SSA',
    tab: 'SPACE SAFETY (CHAKRA)',
    layer: 'RISK & ORBIT CONTEXT',
    t: 'Chakra · Orbital awareness',
    d: 'Space situational awareness engine converting orbital track correlation into automated collision screening and validated avoidance maneuvers.',
    pts: [
      'Automated LEO conjunction screening and high-precision Pc calculation',
      'Covariance-informed avoidance burn calculation and timeline validation',
      'Direct one-click maneuver dispatch into the Vyuh commanding queue',
    ],
    unit: 'Fleet subscription or sovereign perimeter deployment',
    actionText: 'EXPLORE CHAKRA SSA →',
    actionHref: '#ch7',
    slaTag: 'AUTOMATED SCREENING & TCA',
  },
];

export const DEPLOY = [
  { t: 'Cloud', d: 'Fully managed cloud deployment with elastic pass processing, real-time telemetry streaming, and global backhaul.' },
  { t: 'On-premise', d: 'Installed inside your operations facility on your infrastructure, complying with sovereign security standards.' },
  { t: 'Hybrid', d: 'Air-gapped mission operations core connected to the global ground station network via secure encrypted gateways.' },
];

export const USES = [
  { n: '01', t: 'Earth observation', d: 'High-volume payload downlinks and automated antenna scheduling for optical and SAR constellations.' },
  { n: '02', t: 'Commercial constellations', d: 'High-cadence contact scheduling, fleet housekeeping, and automated orbit phase-in.' },
  { n: '03', t: 'Defence & security', d: 'Sovereign air-gapped deployments, hardware-signed uplinks, and strict multi-operator access controls.' },
  { n: '04', t: 'Maritime & IoT', d: 'Global data collection, AIS/ADS-B payload pipelines, and coordinated multi-station passes.' },
  { n: '05', t: 'Space safety & SSA', d: 'High-precision conjunction screening, proximity alerts, and operator-verified avoidance maneuvers.' },
];

export interface TeamMember {
  n: string;
  r: string;
  d: string;
}

export const TEAM: TeamMember[] = [
  {
    n: 'Dr Ashutosh Srivastava',
    r: 'CHIEF EXECUTIVE OFFICER',
    d: 'Satellite RF systems engineering, ground systems & antenna networks',
  },
  {
    n: 'Akash Vishwakarma',
    r: 'CHIEF TECHNOLOGY OFFICER',
    d: 'Distributed software architectures, space systems & mission control platforms',
  },
  {
    n: 'Dr B N Ramakrishna',
    r: 'ADVISOR',
    d: 'Former Director, ISTRAC (ISRO Telemetry, Tracking and Command Network)',
  },
  {
    n: 'Dr Alok Srivastava',
    r: 'ADVISOR',
    d: 'Former Associate Director, URSC (ISRO U R Rao Satellite Centre)',
  },
];

export const INTERESTS = ['GROUND STATION', 'MISSION CONTROL', 'SSA'];

export const CONTACT_EMAIL = 'contact@akashaveda.com';

/** Home page questions: shown on the page and published as FAQ structured data, so keep both in step here. */
export const HOME_FAQ = [
  {
    q: 'What is ground segment as a service?',
    a: 'Ground segment as a service gives satellite operators ground station passes, mission control and space situational awareness as a service, instead of building and running their own. Akashaveda provides all three: the GS-01 ground station, Vyuh mission control and Chakra space safety.',
  },
  {
    q: 'What does Akashaveda do?',
    a: 'Akashaveda connects, controls and comprehends satellite missions: GS-01 provides TT&C and payload downlink passes, Vyuh plans, checks and routes commands, and Chakra screens for collision risk and designs avoidance manoeuvres.',
  },
  {
    q: 'Where can Akashaveda run?',
    a: 'As a fully managed cloud deployment, on-premise inside your own operations facility, or hybrid, with an air-gapped mission core connected to the ground station network through secure encrypted gateways.',
  },
  {
    q: 'Which missions is Akashaveda built for?',
    a: 'Earth observation, commercial constellations, defence and security, maritime and IoT, and space safety and SSA.',
  },
];
