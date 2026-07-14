import React, { useState, useEffect, useRef } from "react";

/* ============================================================================
   ArivuPMO — Landing Page
   Single-file React component. No external dependencies, no CSS framework.
   Drops directly into an existing React app:  import LandingPage from './LandingPage'
   ========================================================================== */

/* ---------------------------------------------------------------- DATA ---- */

const NAV = [
  { label: "Features", href: "#features" },
  { label: "Admin", href: "#admin" },
  { label: "Roles", href: "#roles" },
  { label: "Why Us", href: "#why" },
  { label: "Settings", href: "#settings" },
  { label: "Support", href: "#support" },
];

const HERO_BADGES = [
  "No credit card required",
  "Built on AWS",
  "Role-based access control",
];

const CAPABILITY_CHIPS = [
  { icon: "📅", label: "Waterfall & Agile Delivery" },
  { icon: "⏰", label: "Timesheet Management" },
  { icon: "📊", label: "Schedule / Gantt Charts" },
  { icon: "🗺️", label: "Project on a Page" },
  { icon: "📝", label: "AI Meeting Minutes" },
  { icon: "⚠️", label: "RAID Registers" },
  { icon: "📋", label: "AI Progress Report" },
  { icon: "💰", label: "Budget & EVM" },
  { icon: "📆", label: "Cost, Resource & Project Calendars" },
];

const HERO_MINI_STATS = [
  { n: "20+", l: "Features" },
  { n: "6", l: "Roles" },
  { n: "AI", l: "Assisted" },
];

const STAT_BAR = [
  { n: "20+", l: "Features" },
  { n: "7", l: "RAID Registers" },
  { n: "6", l: "Role Levels" },
  { n: "EVM", l: "Automated" },
  { n: "AI", l: "Assisted" },
  { n: "AWS", l: "Infrastructure" },
];

/* The four product screens that auto-rotate inside the hero window. */
const SCREENS = [
  { id: "gantt", nav: "Gantt Chart", icon: "📅", crumb: "Planning · Gantt", chip: "SPI 1.02 · On track", tone: "ok" },
  { id: "raid", nav: "RAID Registers", icon: "⚠️", crumb: "Registers · RAID", chip: "7 registers · Action required", tone: "warn" },
  { id: "scrum", nav: "Agile Scrum", icon: "🏃", crumb: "Agile · Sprint 12", chip: "34 / 40 pts · 85% velocity", tone: "info" },
  { id: "evm", nav: "EVM (Earned Value)", icon: "💰", crumb: "Finance · Earned Value", chip: "CPI 0.97 · In tolerance", tone: "ok" },
];

/* Sidebar of the simulated product window (mirrors the real app nav). */
const APP_SIDEBAR = [
  { icon: "📊", label: "Program Dashboard", screen: null },
  { icon: "📅", label: "Gantt Chart", screen: "gantt" },
  { icon: "⚠️", label: "RAID Registers", screen: "raid" },
  { icon: "🏃", label: "Agile Scrum", screen: "scrum" },
  { icon: "💰", label: "EVM", screen: "evm" },
  { icon: "📝", label: "AI Minutes", screen: null },
];

const GANTT_ROWS = [
  { name: "Discovery & Scoping", start: 0, span: 16, done: 100, crit: false },
  { name: "Solution Design", start: 12, span: 20, done: 100, crit: true },
  { name: "Build — Sprint 10–12", start: 28, span: 30, done: 72, crit: true },
  { name: "Data Migration", start: 44, span: 18, done: 34, crit: false },
  { name: "SIT / UAT", start: 58, span: 22, done: 8, crit: true },
  { name: "Go-Live Readiness", start: 76, span: 16, done: 0, crit: false },
];

const RAID_ROWS = [
  { id: "R-0003", type: "Risk", d: "Lead engineer off in Sprint 13", owner: "A. Rao", rag: "red", status: "Open" },
  { id: "I-0011", type: "Issue", d: "Migration dry-run failed", owner: "M. Chen", rag: "amber", status: "In progress" },
  { id: "A-0027", type: "Action", d: "Confirm UAT sign-off", owner: "S. Patel", rag: "amber", status: "Due" },
  { id: "D-0008", type: "Decision", d: "Phased cutover over big-bang", owner: "Steering", rag: "green", status: "Closed" },
  { id: "P-0004", type: "Dependency", d: "Vendor API v2 availability", owner: "J. Nguyen", rag: "red", status: "Open" },
  { id: "L-0002", type: "Lesson", d: "Earlier baseline cuts churn", owner: "PMO", rag: "green", status: "Logged" },
];

const SCRUM_COLS = [
  { name: "Backlog", wip: "", cards: [
    { t: "Cost calendar export", p: "Low", pts: 3 },
    { t: "Resource sheet filters", p: "Med", pts: 5 },
  ]},
  { name: "In Progress", wip: "3/4", cards: [
    { t: "EVM auto-calc from timesheets", p: "High", pts: 8 },
    { t: "RAID CSV conflict handling", p: "Med", pts: 5 },
    { t: "Gantt critical path render", p: "High", pts: 8 },
  ]},
  { name: "Blocked", wip: "2", cards: [
    { t: "Vendor API v2 integration", p: "High", pts: 5 },
    { t: "UAT env provisioning", p: "Med", pts: 3 },
  ]},
  { name: "Done", wip: "", cards: [
    { t: "Sprint 11 burndown", p: "Med", pts: 5 },
    { t: "Role matrix at API layer", p: "High", pts: 8 },
  ]},
];

const EVM_KPIS = [
  { k: "CPI", v: "0.97", note: "Cost Perf.", tone: "amber" },
  { k: "SPI", v: "1.02", note: "Schedule Perf.", tone: "green" },
  { k: "EAC", v: "$361k", note: "Est. At Completion", tone: "amber" },
  { k: "ETC", v: "$21k", note: "Est. To Complete", tone: "green" },
];

/* PV / EV / AC curves — plotted as SVG polylines in the EVM screen. */
/* AC runs above EV (CPI 0.97 — cost overrun); EV tracks just ahead of PV (SPI 1.02). */
const EVM_SERIES = {
  pv: [8, 26, 46, 68, 92, 116, 140, 164, 186, 205],
  ev: [9, 29, 51, 75, 100, 126, 150, 175, 196, 214],
  ac: [12, 38, 66, 96, 126, 156, 184, 210, 230, 245],
};

const FEATURE_GROUPS = [
  { group: "Dashboards & Visibility", items: [
    { id: "projects", nav: "Projects", icon: "🗂️", headline: "All your projects in one place",
      sub: "The Projects page lists every project you have access to — with status, health indicators, and quick navigation to any project tool.",
      bullets: ["Project list with RAG status", "Quick access to any project tool", "Create & archive projects", "Role-based project visibility"] },
    { id: "program-dash", nav: "Program Dashboard", icon: "📊", headline: "Cross-project program visibility",
      sub: "Program Managers see all projects — EVM, RAG status, RAID summary, resource utilisation, and schedule health across the entire program.",
      bullets: ["Live RAG status across all projects", "Consolidated EVM: CPI, SPI, EAC", "Cross-project RAID roll-up", "Resource utilisation heat map"] },
    { id: "project-dash", nav: "Project Dashboard", icon: "🎯", headline: "Single project command centre",
      sub: "Every project has its own live dashboard — task completion, risk count, budget burn, sprint velocity, and key milestone tracking at a glance.",
      bullets: ["Task completion & progress %", "Budget burn vs planned", "Active risk & issue count", "Milestone and sprint status"] },
  ]},
  { group: "Planning", items: [
    { id: "gantt", nav: "Gantt Chart", icon: "📅", headline: "Interactive Gantt chart with dependency tracking",
      sub: "Drag-and-drop task scheduling with predecessor/successor links, critical path highlighting, and baseline vs actual comparison.",
      bullets: ["Drag-and-drop scheduling", "Dependency links & critical path", "Baseline vs actual variance", "CSV import with working-day calc"] },
    { id: "schedule", nav: "Schedule Management", icon: "🗓️", headline: "Master schedule with milestone tracking",
      sub: "Manage the full project schedule — milestones, delivery gates, and schedule variance. View planned vs actual at any point in the project.",
      bullets: ["Milestone & delivery gate tracking", "Planned vs actual schedule variance", "Phase-based schedule structure", "Schedule RAG status auto-set"] },
    { id: "epics", nav: "Project on a Page — Epics", icon: "🗺️", headline: "Epic-level plan on a page",
      sub: "See the full project scope at the epic level — status, progress bars, dates, and owners. Perfect for steering committee presentations.",
      bullets: ["Epic status & RAG indicators", "Progress % per epic", "Start / end dates & owners", "Export to PDF or Word report"] },
    { id: "features-pg", nav: "Project on a Page — Features", icon: "📐", headline: "Feature breakdown within epics",
      sub: "Drill into each epic to see its features — type, owner, start/end dates, status, and percentage complete.",
      bullets: ["Feature type classification", "Owner assignment per feature", "Status & % done tracking", "Feeds directly into progress report"] },
    { id: "tasks", nav: "Project on a Page — Tasks", icon: "📌", headline: "Full task register with timeline",
      sub: "All tasks across the project in one filterable, sortable view — with inline edit, status update, and direct link to the Gantt.",
      bullets: ["Task type, owner, priority", "Planned vs actual dates", "Status & progress % inline edit", "Links to Gantt & Kanban"] },
    { id: "project-cal", nav: "Project Calendar", icon: "📆", headline: "Timeline view of milestones and tasks",
      sub: "Calendar view showing tasks, milestones, and sprint events plotted by date — switch between month, week, and day views.",
      bullets: ["Month / week / day views", "Tasks & milestones on calendar", "Sprint events & ceremonies", "Export to PDF"] },
  ]},
  { group: "Agile Delivery", items: [
    { id: "kanban", nav: "Kanban Board", icon: "🟦", headline: "Drag-and-drop Kanban with swimlanes",
      sub: "Fully configurable Kanban board with drag-and-drop cards, assignee swimlanes, priority colour coding, and WIP limits.",
      bullets: ["Custom column configuration", "Priority & status colour coding", "Assignee filter & swimlanes", "Direct link to task detail"] },
    { id: "scrum", nav: "Agile Scrum", icon: "🏃", headline: "Full Scrum framework out of the box",
      sub: "Sprint planning, backlog grooming, burndown charts, velocity tracking, and retrospective capture — all within ArivuPMO.",
      bullets: ["Sprint planning from backlog", "Burndown & velocity charts", "Sprint review & retrospective", "Story point estimation"] },
  ]},
  { group: "People & Time", items: [
    { id: "timesheets", nav: "Timesheet Management", icon: "⏰", headline: "Weekly timesheet with approval workflow",
      sub: "Team members submit weekly timesheets. Managers approve or return with comments. Approved hours feed directly into EVM and cost forecasting.",
      bullets: ["Weekly entry per project/task", "Manager approve / return flow", "Multi-project hour split", "Date-based rate changes"] },
    { id: "resource-cal", nav: "Resource Calendar", icon: "👥", headline: "Visual resource availability calendar",
      sub: "Calendar view of every team member — allocation percentage, leave, and capacity plotted across the project timeline.",
      bullets: ["Per-person availability view", "Allocation % per project", "Leave & non-working days", "Over/under allocation flag"] },
    { id: "resource-sheet", nav: "Resource Sheet", icon: "📋", headline: "Detailed resource allocation spreadsheet",
      sub: "Spreadsheet-style view of all resources — allocation hours, daily rates, and total cost per resource per period.",
      bullets: ["Per-resource hour allocation", "Daily rate & total cost", "Period-by-period breakdown", "Export to CSV & PDF"] },
  ]},
  { group: "Finance & EVM", items: [
    { id: "resource-forecast", nav: "Resource Forecast", icon: "📈", headline: "Forward-looking capacity and cost forecast",
      sub: "Project future resource demand by phase, role, and date range. Compare planned vs actual headcount and cost.",
      bullets: ["Headcount by phase & role", "Planned vs actual comparison", "Cost forecast by resource", "Export to CSV & PDF"] },
    { id: "budget", nav: "Budget Management", icon: "💵", headline: "Project budget tracking end to end",
      sub: "Set the approved budget, capture actual costs, and track variance in real time. Non-timesheet costs captured separately.",
      bullets: ["Approved budget baseline", "Actual vs planned variance", "Non-timesheet other costs", "Budget RAG status auto-set"] },
    { id: "evm", nav: "EVM (Earned Value)", icon: "💰", headline: "Automated Earned Value Management",
      sub: "CPI, SPI, EV, AC, PV, EAC calculated automatically from approved timesheet hours and scheduled task values. No spreadsheets required.",
      bullets: ["Live CPI & SPI calculation", "EAC & ETC forecasting", "Automated from timesheets", "EVM table in progress report"] },
    { id: "cost-cal", nav: "Cost Calendar", icon: "📊", headline: "Monthly cost breakdown by period",
      sub: "Cost calendar shows budgeted vs actual cost month by month — with variance analysis and export for board packs.",
      bullets: ["Monthly budget vs actual", "Period variance analysis", "Forecast to completion", "Export CSV & PDF"] },
    { id: "sched-forecast", nav: "Schedule Forecast", icon: "📉", headline: "Forward-looking schedule variance analysis",
      sub: "Tracks planned vs actual task completion over time and projects the delivery date based on current velocity.",
      bullets: ["Plan vs actual timeline", "Projected completion date", "SPI trend over sprints", "Schedule risk indicator"] },
  ]},
  { group: "AI & Registers", items: [
    { id: "raid", nav: "RAID Registers", icon: "⚠️", headline: "Seven RAID registers — full lifecycle tracking",
      sub: "Risks, Issues, Actions, Decisions, Lessons, Dependencies, Assumptions — each with sequential IDs, closed date, audit trail, and AI-assisted entry from meeting notes.",
      bullets: ["7 register types purpose-built", "AI extracts RAID from notes", "Sequential IDs: R-0001 per project", "CSV import with conflict handling"] },
    { id: "minutes", nav: "AI Meeting Minutes", icon: "📝", headline: "Paste notes — get formatted minutes",
      sub: "Paste a transcript or rough notes. The AI returns structured meeting minutes with action items extracted and ready to add to the RAID register.",
      bullets: ["Transcript to formatted minutes", "Action items auto-extracted", "RAID suggestions from notes", "Save to project record"] },
    { id: "progress", nav: "AI Progress Report", icon: "📋", headline: "AI-generated progress reports in minutes",
      sub: "A 14-section report generated from live project data — Gantt, RAID, EVM, KPIs — with AI-enhanced narrative. Download as Word, PDF, or HTML.",
      bullets: ["14-section structured report", "AI narrative enhancement", "Word + PDF + HTML export", "Editable before download"] },
  ]},
  { group: "Admin & Configuration", items: [
    { id: "user-admin", nav: "User Admin & Role Matrix", icon: "👤", headline: "User management and role assignment",
      sub: "Invite team members by email, assign one of 6 roles, reset passwords, and manage access. Company Admin controls all user permissions.",
      bullets: ["Email invite with temp password", "6-role assignment per user", "Password reset by admin", "Active user list management"] },
    { id: "ai-key", nav: "AI Key Configuration", icon: "🔑", headline: "Configure your own AI API key",
      sub: "By default ArivuPMO uses free OpenRouter models. Company Admins can configure their own OpenRouter, OpenAI, or Anthropic API key for higher usage volumes.",
      bullets: ["OpenRouter / OpenAI / Anthropic", "Per-company key configuration", "Free tier works out of the box", "Company Admin access required"] },
    { id: "status-mgmt", nav: "Status Management", icon: "🚦", headline: "Customise project status labels",
      sub: "Define and manage the status values used across tasks, RAID registers, and project workflows. Tailor terminology to your organisation.",
      bullets: ["Custom status labels per type", "Task & register status config", "RAG colour mapping", "Company-wide consistency"] },
  ]},
  { group: "Settings", items: [
    { id: "settings-profile", nav: "My Settings", icon: "⚙️", headline: "Personal and platform settings for every user",
      sub: "Every user manages their own password, notifications, and profile. Company Admins also access platform-wide settings, company profile, and data export configuration from the same Settings menu.",
      bullets: ["Password change & self-service reset", "Notification preferences", "Profile & display settings", "Company settings (Admin only)"] },
  ]},
  { group: "Training & Support", items: [
    { id: "training", nav: "Training", icon: "🎓", headline: "Built-in training videos and user manuals",
      sub: "Training videos and user manuals available directly inside the platform under AI Tools → Training. No external portal required.",
      bullets: ["Training videos per feature", "User manual PDF download", "Searchable by topic", "Updated as features release"] },
    { id: "help", nav: "Help & Support", icon: "💬", headline: "In-platform support and FAQ",
      sub: "The Help & Support page provides an FAQ, contact form, and quick links — accessible from the sidebar under Support.",
      bullets: ["Frequently asked questions", "In-app contact form", "Email support channel", "Privacy & terms links"] },
  ]},
];

const ROLES = [
  { icon: "👑", name: "Company Admin", scope: "Full platform access", accent: "ind",
    bullets: ["User management & invites", "All projects & all data", "AI key configuration", "Admin settings"] },
  { icon: "🎯", name: "Program Manager", scope: "Cross-project oversight", accent: "ind",
    bullets: ["Program dashboard access", "All projects EVM & budget", "Resource planning & forecast", "AI reports for all projects"] },
  { icon: "📋", name: "Project Manager", scope: "Assigned projects", accent: "cyan",
    bullets: ["Full project planning & RAID", "Team timesheets & EVM", "Budget & cost calendar", "AI report generation"] },
  { icon: "🏃", name: "Scrum Master", scope: "Agile ceremonies", accent: "cyan",
    bullets: ["Sprint planning & Kanban", "Burndown & velocity", "AI meeting minutes", "Retrospective capture"] },
  { icon: "📦", name: "Product Owner", scope: "Backlog & features", accent: "amber",
    bullets: ["Feature prioritisation", "Backlog & epic management", "Sprint review input", "Project on a page view"] },
  { icon: "👤", name: "Dev Team Member", scope: "Own work only", accent: "slate",
    bullets: ["Own timesheet entry", "Assigned tasks only", "RAID view (read)", "Kanban & Gantt view"] },
];

const ADMIN_CARDS = [
  { icon: "👤", title: "User Admin & Role Matrix", body: "Invite users by email, assign one of 6 roles, reset passwords, and manage the full team from one screen." },
  { icon: "🔑", title: "AI Key Configuration", body: "Configure your own OpenRouter, OpenAI, or Anthropic API key. Free tier works out of the box." },
  { icon: "🚦", title: "Status Management", body: "Customise status labels and RAG colours used across tasks, RAID registers, and project workflows." },
  { icon: "⚙️", title: "Platform Settings", body: "Company profile, notification preferences, data export settings, and session configuration." },
];

const WHY = [
  { icon: "🏗️", title: "Full PMO capability at any scale", body: "EVM, RAID, Scrum, Gantt, resource forecasting — without enterprise pricing or months of implementation." },
  { icon: "🔐", title: "Access enforced at the API level", body: "Six granular roles. Not just hidden in the UI — the API itself enforces what each role can see and do." },
  { icon: "⚡", title: "Operational in under five minutes", body: "Register, create a project, invite your team. No integrations to configure. No consultants to hire." },
  { icon: "🤖", title: "AI trained on PMO language", body: "Meeting minutes, RAID extraction, and progress reports written in PMO language, not generic text." },
  { icon: "📱", title: "Works on every device", body: "Responsive across desktop, tablet, and mobile. PDF reports adapt to screen. No app to install." },
  { icon: "☁️", title: "AWS enterprise infrastructure", body: "CloudFront CDN, DynamoDB, Lambda, S3 — enterprise-grade cloud. Your data never shares infrastructure." },
];

const SUPPORT = [
  { icon: "🎓", title: "Training Centre", body: "Training videos and user manuals built into the platform under AI Tools → Training." },
  { icon: "💬", title: "Help & Support", body: "FAQ, contact form, and quick links to email support — under Support in the sidebar." },
  { icon: "📧", title: "Email Support", body: "Reach the ArivuPMO team directly. We respond within 1 business day for all enquiries." },
];

const SETTINGS_CARDS = [
  { icon: "🔒", title: "Password & Security", body: "Change your password at any time. Self-service reset via email. No admin required." },
  { icon: "🔔", title: "Notification Preferences", body: "Control which notifications you receive — project updates, RAID alerts, timesheet reminders." },
  { icon: "👤", title: "Profile & Display", body: "Update your display name, timezone, and language preferences. Your settings, your way." },
];

const FOOTER_COLS = [
  { title: "Planning", links: ["Gantt Chart", "Schedule Management", "Project on a Page", "Resource Calendar"] },
  { title: "Delivery", links: ["Scrum & Kanban", "RAID Registers", "Timesheets", "Resource Sheet"] },
  { title: "Finance", links: ["Budget & EVM", "Resource Forecast", "Cost Calendar", "Progress Report"] },
  { title: "Company", links: ["About", "Support", "Training", "Privacy Policy"] },
];

/* ------------------------------------------------------------- HELPERS ---- */

/* Adds .is-in when the element scrolls into view, so sections can stagger-reveal. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Counts a number up once its section is visible. Used by the stat bar. */
function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || typeof target !== "number") return;
    let raf;
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return val;
}

/* ------------------------------------------------- PRODUCT WINDOW SCREENS -- */

function GanttScreen() {
  return (
    <div className="ap-screen">
      <div className="ap-scr-head">
        <div className="ap-scr-title">Phase 2 — Delivery Schedule</div>
        <div className="ap-scr-meta">14 tasks · critical path tracked</div>
      </div>
      <div className="ap-gantt-months">
        {["Jul", "Aug", "Sep", "Oct", "Nov"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="ap-gantt">
        {GANTT_ROWS.map((r, i) => (
          <div className="ap-gantt-row" key={r.name} style={{ "--i": i }}>
            <div className="ap-gantt-name">{r.name}</div>
            <div className="ap-gantt-track">
              <div
                className={"ap-gantt-bar" + (r.crit ? " crit" : "")}
                style={{ "--start": r.start + "%", "--span": r.span + "%", "--i": i }}
              >
                <span className="ap-gantt-fill" style={{ width: r.done + "%" }} />
              </div>
            </div>
          </div>
        ))}
        <div className="ap-gantt-today" />
      </div>
      <div className="ap-scr-foot">
        <span className="ap-legend"><i className="lg crit" /> Critical path</span>
        <span className="ap-legend"><i className="lg" /> On plan</span>
        <span className="ap-legend"><i className="lg today" /> Today</span>
      </div>
    </div>
  );
}

function RaidScreen() {
  return (
    <div className="ap-screen">
      <div className="ap-scr-head">
        <div className="ap-scr-title">RAID Register — Risks &amp; Issues</div>
        <div className="ap-scr-meta">7 registers · 2 action required</div>
      </div>
      <div className="ap-raid">
        <div className="ap-raid-row ap-raid-hdr">
          <span>ID</span><span>Type</span><span>Description</span><span>Owner</span><span>Status</span>
        </div>
        {RAID_ROWS.map((r, i) => (
          <div className="ap-raid-row" key={r.id} style={{ "--i": i }}>
            <span className="ap-raid-id">{r.id}</span>
            <span className="ap-raid-type">{r.type}</span>
            <span className="ap-raid-d">
              <i className={"ap-rag " + r.rag} />
              {r.d}
            </span>
            <span className="ap-raid-o">{r.owner}</span>
            <span className={"ap-pill " + r.rag}>{r.status}</span>
          </div>
        ))}
      </div>
      <div className="ap-scr-foot">
        <span className="ap-ai-note">✨ AI extracted 3 of these from Tuesday&apos;s meeting notes</span>
      </div>
    </div>
  );
}

function ScrumScreen() {
  return (
    <div className="ap-screen">
      <div className="ap-scr-head">
        <div className="ap-scr-title">Sprint 12 — Board</div>
        <div className="ap-scr-meta">34 / 40 pts · velocity 85%</div>
      </div>
      <div className="ap-board">
        {SCRUM_COLS.map((c, ci) => (
          <div className="ap-col" key={c.name} style={{ "--i": ci }}>
            <div className="ap-col-hdr">
              <span>{c.name}</span>
              {c.wip && <em className={c.name === "Blocked" ? "wip block" : "wip"}>{c.wip}</em>}
            </div>
            {c.cards.map((card, k) => (
              <div className="ap-card" key={card.t} style={{ "--i": ci * 3 + k }}>
                <div className="ap-card-t">{card.t}</div>
                <div className="ap-card-m">
                  <span className={"ap-prio " + card.p.toLowerCase()}>{card.p}</span>
                  <span className="ap-pts">{card.pts}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="ap-scr-foot">
        <span className="ap-burn">Burndown</span>
        <svg className="ap-burn-svg" viewBox="0 0 120 18" preserveAspectRatio="none">
          <polyline points="0,2 20,4 40,7 60,9 80,12 100,14 120,16" />
          <polyline className="actual" points="0,2 20,5 40,6 60,10 80,11 100,15 120,15" />
        </svg>
      </div>
    </div>
  );
}

function EvmScreen() {
  const w = 260, h = 92, max = 262;
  const pts = (arr) =>
    arr.map((v, i) => `${(i / (arr.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <div className="ap-screen">
      <div className="ap-scr-head">
        <div className="ap-scr-title">Earned Value — Programme</div>
        <div className="ap-scr-meta">$340k / $350k</div>
      </div>
      <div className="ap-kpis">
        {EVM_KPIS.map((k, i) => (
          <div className={"ap-kpi " + k.tone} key={k.k} style={{ "--i": i }}>
            <span className="ap-kpi-k">{k.k}</span>
            <span className="ap-kpi-v">{k.v}</span>
            <span className="ap-kpi-n">{k.note}</span>
          </div>
        ))}
      </div>
      <div className="ap-evm-chart">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} className="grid" />
          ))}
          <polyline className="pv" points={pts(EVM_SERIES.pv)} />
          <polyline className="ac" points={pts(EVM_SERIES.ac)} />
          <polyline className="ev" points={pts(EVM_SERIES.ev)} />
        </svg>
      </div>
      <div className="ap-scr-foot">
        <span className="ap-legend"><i className="lg pv" /> PV</span>
        <span className="ap-legend"><i className="lg ev" /> EV</span>
        <span className="ap-legend"><i className="lg ac" /> AC</span>
        <span className="ap-ai-note">Auto-calculated from approved timesheets</span>
      </div>
    </div>
  );
}

const SCREEN_MAP = { gantt: GanttScreen, raid: RaidScreen, scrum: ScrumScreen, evm: EvmScreen };

/* The animated product window: sidebar highlights the active screen as it rotates. */
function ProductWindow() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % SCREENS.length), 4200);
    return () => clearInterval(timer.current);
  }, [paused]);

  const active = SCREENS[idx];
  const Screen = SCREEN_MAP[active.id];

  return (
    <div
      className="ap-win"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="ArivuPMO product preview"
    >
      <div className="ap-win-chrome">
        <span className="ap-dot r" />
        <span className="ap-dot y" />
        <span className="ap-dot g" />
        <div className="ap-win-url">
          <span className="ap-lock">🔒</span> app.arivupmo.com<span className="ap-url-dim">/{active.id}</span>
        </div>
        <span className="ap-live">
          <i /> Live
        </span>
      </div>

      <div className="ap-win-body">
        <aside className="ap-side">
          <div className="ap-side-brand">
            <span className="ap-side-logo">A</span>
            <span className="ap-side-name">ArivuPMO</span>
          </div>
          <div className="ap-side-sec">Project</div>
          {APP_SIDEBAR.map((s) => {
            const on = s.screen === active.id;
            return (
              <button
                key={s.label}
                className={"ap-side-item" + (on ? " on" : "")}
                onClick={() => {
                  const t = SCREENS.findIndex((x) => x.id === s.screen);
                  if (t >= 0) setIdx(t);
                }}
                type="button"
                tabIndex={-1}
              >
                <span className="ap-side-ico">{s.icon}</span>
                <span className="ap-side-lbl">{s.label}</span>
                {on && <span className="ap-side-bar" />}
              </button>
            );
          })}
          <div className="ap-side-user">
            <span className="ap-avatar">SP</span>
            <span className="ap-side-lbl">S. Patel · PM</span>
          </div>
        </aside>

        <div className="ap-main">
          <div className="ap-crumbs">
            <span className="ap-crumb-txt">{active.crumb}</span>
            <span className={"ap-chip " + active.tone}>{active.chip}</span>
          </div>
          <div className="ap-stage">
            <div className="ap-stage-in" key={active.id}>
              <Screen />
            </div>
          </div>
          <div className="ap-tabs">
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={"ap-tab" + (i === idx ? " on" : "")}
                onClick={() => setIdx(i)}
                aria-label={s.nav}
              >
                <span className="ap-tab-fill" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ap-win-stats">
        {HERO_MINI_STATS.map((s) => (
          <div className="ap-wstat" key={s.l}>
            <b>{s.n}</b>
            <span>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- STAT BAR ------ */

function StatBar() {
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setOn(true), io.disconnect()),
      { threshold: 0.4 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="lp-statbar" ref={ref}>
      <div className="lp-statbar-in">
        {STAT_BAR.map((s, i) => (
          <React.Fragment key={s.l}>
            {i > 0 && <span className="lp-statdiv" />}
            <div className="lp-stat">
              <StatNum raw={s.n} on={on} />
              <span className="lp-stat-l">{s.l}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StatNum({ raw, on }) {
  const num = parseInt(raw, 10);
  const isNum = !Number.isNaN(num);
  const v = useCountUp(isNum ? num : 0, on && isNum);
  if (!isNum) return <span className="lp-stat-n">{raw}</span>;
  return (
    <span className="lp-stat-n">
      {on ? v : 0}
      {raw.includes("+") ? "+" : ""}
    </span>
  );
}

/* ------------------------------------------------------ FEATURE EXPLORER -- */

function FeatureExplorer() {
  const flat = FEATURE_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.group })));
  const [sel, setSel] = useState(flat[0].id);
  const active = flat.find((f) => f.id === sel) || flat[0];

  return (
    <div className="lp-feat-layout">
      <nav className="lp-feat-nav" aria-label="Feature list">
        {FEATURE_GROUPS.map((g) => (
          <div key={g.group}>
            <div className="lp-feat-group">{g.group}</div>
            {g.items.map((it) => (
              <button
                key={it.id}
                type="button"
                className={"lp-ftab" + (it.id === sel ? " active" : "")}
                onClick={() => setSel(it.id)}
              >
                <span className="lp-ftab-icon">{it.icon}</span>
                <span className="lp-ftab-name">{it.nav}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="lp-feat-panel" key={active.id}>
        <div className="lp-panel-kicker">
          {active.group.toUpperCase()} · {active.nav.toUpperCase()}
        </div>
        <h3 className="lp-panel-h3">{active.headline}</h3>
        <p className="lp-panel-desc">{active.sub}</p>
        <div className="lp-panel-bullets">
          {active.bullets.map((b, i) => (
            <div className="lp-panel-bullet" key={b} style={{ "--i": i }}>
              <span className="lp-bck">✓</span>
              {b}
            </div>
          ))}
        </div>
        <div className="lp-panel-art">
          <span className="lp-panel-art-ico">{active.icon}</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ PAGE ==== */

export default function LandingPage() {
  useReveal();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp">
      <style>{CSS}</style>

      {/* ------------------------------------------------------------ NAV -- */}
      <header className={"lp-nav" + (scrolled ? " stuck" : "")}>
        <div className="lp-nav-in">
          <a className="lp-brand" href="#top">
            <span className="lp-logo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 19 L12 4 L20 19" />
                <path d="M8.2 14.4 H15.8" />
              </svg>
            </span>
            <span className="lp-brand-txt">
              Arivu<b>PMO</b>
            </span>
          </a>

          <nav className="lp-nav-links">
            {NAV.map((n) => (
              <a key={n.label} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>

          <div className="lp-nav-cta">
            <a className="lp-btn-ghost" href="#signin">Sign in</a>
            <a className="lp-btn-primary sm" href="#start">Get started free</a>
            <button
              className="lp-burger"
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-label="Menu"
            >
              <i /><i /><i />
            </button>
          </div>
        </div>

        {menu && (
          <div className="lp-mobile">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={() => setMenu(false)}>
                {n.label}
              </a>
            ))}
            <a href="#signin" onClick={() => setMenu(false)}>Sign in</a>
            <a className="lp-mobile-cta" href="#start" onClick={() => setMenu(false)}>
              Get started free
            </a>
          </div>
        )}
      </header>

      {/* ----------------------------------------------------------- HERO -- */}
      <section className="lp-hero" id="top">
        <div className="lp-hero-bg" aria-hidden="true">
          <span className="lp-blob b1" />
          <span className="lp-blob b2" />
          <span className="lp-grid" />
        </div>

        <div className="lp-hero-in">
          <div className="lp-hero-left">
            <div className="lp-eyebrow">
              <span className="lp-eyebrow-dot" />
              AI-ASSISTED PMO PLATFORM
            </div>

            <h1 className="lp-h1">
              <span className="lp-h1-l" style={{ "--i": 0 }}>Your PMO.</span>
              <span className="lp-h1-l accent" style={{ "--i": 1 }}>Under control.</span>
              <span className="lp-h1-l" style={{ "--i": 2 }}>
                Delivered.
                <svg className="lp-underline" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 8 C 70 2, 140 2, 298 6" />
                </svg>
              </span>
            </h1>

            <p className="lp-hero-sub">
              ArivuPMO unifies Gantt, RAID, Scrum, EVM, Timesheets, Resource Forecasting,
              and AI-assisted reporting into one platform purpose-built for serious
              project delivery teams.
            </p>

            <div className="lp-hero-btns">
              <a className="lp-btn-primary" href="#start">
                Get started free <span className="lp-arrow">→</span>
              </a>
              <a className="lp-btn-outline" href="#signin">Sign in</a>
            </div>

            <div className="lp-hero-badges">
              {HERO_BADGES.map((b) => (
                <span className="lp-badge" key={b}>
                  <i className="lp-tick">✓</i>
                  {b}
                </span>
              ))}
            </div>

            <div className="lp-chips">
              {CAPABILITY_CHIPS.map((c, i) => (
                <span className="lp-chip" key={c.label} style={{ "--i": i }}>
                  <span className="lp-chip-ico">{c.icon}</span>
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          <div className="lp-hero-right">
            <ProductWindow />
          </div>
        </div>
      </section>

      <StatBar />

      {/* ------------------------------------------------------- FEATURES -- */}
      <section className="lp-sec" id="features">
        <div className="lp-sec-head" data-reveal>
          <span className="lp-kicker">Full Feature Set</span>
          <h2 className="lp-h2">Everything your PMO needs</h2>
          <p className="lp-sec-sub">
            25+ integrated capabilities. Select any feature to explore it.
          </p>
        </div>
        <div className="lp-feat-wrap" data-reveal>
          <FeatureExplorer />
        </div>
      </section>

      {/* ---------------------------------------------------------- ROLES -- */}
      <section className="lp-sec tint" id="roles">
        <div className="lp-sec-head" data-reveal>
          <span className="lp-kicker">Role-Based Access Control</span>
          <h2 className="lp-h2">Six roles. Precisely scoped.</h2>
          <p className="lp-sec-sub">
            Every team member sees exactly what their role requires. Access enforced at
            the API level.
          </p>
        </div>
        <div className="lp-roles" data-reveal>
          {ROLES.map((r, i) => (
            <article className={"lp-role " + r.accent} key={r.name} style={{ "--i": i }}>
              <div className="lp-role-top">
                <span className="lp-role-ico">{r.icon}</span>
                <div>
                  <h3 className="lp-role-name">{r.name}</h3>
                  <span className="lp-role-scope">{r.scope}</span>
                </div>
              </div>
              <ul className="lp-role-list">
                {r.bullets.map((b) => (
                  <li key={b}>
                    <span className="lp-bck sm">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- ADMIN -- */}
      <section className="lp-sec" id="admin">
        <div className="lp-sec-head" data-reveal>
          <span className="lp-kicker">Admin &amp; Configuration</span>
          <h2 className="lp-h2">Complete platform control</h2>
          <p className="lp-sec-sub">
            Company Admins manage users, roles, AI keys, status configuration, and
            settings — from the Admin section in the sidebar.
          </p>
        </div>
        <div className="lp-cards c4" data-reveal>
          {ADMIN_CARDS.map((c, i) => (
            <article className="lp-card" key={c.title} style={{ "--i": i }}>
              <span className="lp-card-ico">{c.icon}</span>
              <h3 className="lp-card-t">{c.title}</h3>
              <p className="lp-card-b">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ WHY -- */}
      <section className="lp-sec tint" id="why">
        <div className="lp-sec-head" data-reveal>
          <span className="lp-kicker">Why ArivuPMO</span>
          <h2 className="lp-h2">Built for teams that deliver</h2>
          <p className="lp-sec-sub">
            Not a task tool with PMO features bolted on. Purpose-built from the ground up.
          </p>
        </div>
        <div className="lp-cards c3 why" data-reveal>
          {WHY.map((c, i) => (
            <article className="lp-card lift" key={c.title} style={{ "--i": i }}>
              <span className="lp-card-ico">{c.icon}</span>
              <h3 className="lp-card-t">{c.title}</h3>
              <p className="lp-card-b">{c.body}</p>
              <span className="lp-card-num">{String(i + 1).padStart(2, "0")}</span>
            </article>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- SUPPORT -- */}
      <section className="lp-sec" id="support">
        <div className="lp-sec-head" data-reveal>
          <span className="lp-kicker">Training &amp; Support</span>
          <h2 className="lp-h2">Help when you need it</h2>
          <p className="lp-sec-sub">
            Built-in training resources, documentation, and support — available directly
            inside the platform.
          </p>
        </div>
        <div className="lp-cards c3" data-reveal>
          {SUPPORT.map((c, i) => (
            <article className="lp-card" key={c.title} style={{ "--i": i }}>
              <span className="lp-card-ico">{c.icon}</span>
              <h3 className="lp-card-t">{c.title}</h3>
              <p className="lp-card-b">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- SETTINGS -- */}
      <section className="lp-sec tint" id="settings">
        <div className="lp-sec-head" data-reveal>
          <span className="lp-kicker">Settings</span>
          <h2 className="lp-h2">Personal settings for every user</h2>
          <p className="lp-sec-sub">
            Every team member — regardless of role — can manage their own password,
            profile, and preferences. No admin needed for personal settings.
          </p>
        </div>
        <div className="lp-cards c3" data-reveal>
          {SETTINGS_CARDS.map((c, i) => (
            <article className="lp-card" key={c.title} style={{ "--i": i }}>
              <span className="lp-card-ico">{c.icon}</span>
              <h3 className="lp-card-t">{c.title}</h3>
              <p className="lp-card-b">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA -- */}
      <section className="lp-cta" id="start">
        <div className="lp-cta-bg" aria-hidden="true">
          <span className="lp-blob c1" />
          <span className="lp-blob c2" />
        </div>
        <div className="lp-cta-in" data-reveal>
          <h2 className="lp-cta-h2">Ready to run a tighter PMO?</h2>
          <p className="lp-cta-sub">
            Give your team the tools to plan, track, and deliver — with full visibility at
            every level.
          </p>
          <div className="lp-cta-btns">
            <a className="lp-btn-primary lg" href="#start">
              Get started free <span className="lp-arrow">→</span>
            </a>
            <a className="lp-btn-outline lg" href="#signin">Sign in to your account</a>
          </div>
          <div className="lp-cta-badges">
            {HERO_BADGES.map((b) => (
              <span key={b}>
                <i className="lp-tick">✓</i>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- FOOTER -- */}
      <footer className="lp-foot">
        <div className="lp-foot-in">
          <div className="lp-foot-brand">
            <a className="lp-brand" href="#top">
              <span className="lp-logo">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 19 L12 4 L20 19" />
                  <path d="M8.2 14.4 H15.8" />
                </svg>
              </span>
              <span className="lp-brand-txt">
                Arivu<b>PMO</b>
              </span>
            </a>
            <p className="lp-foot-blurb">
              Enterprise-grade project management. Purpose-built for PMO teams. Built on
              AWS. Sydney, Australia.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div className="lp-foot-col" key={col.title}>
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                <a key={l} href="#features">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="lp-foot-bar">
          <span>© 2026 ArivuPMO · Sydney, Australia</span>
          <span className="lp-foot-legal">
            <a href="#privacy">Privacy</a>
            <i>·</i>
            <a href="#terms">Terms</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================= CSS ==== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.lp{
  --ink:#0C1027;
  --ink-2:#3B4463;
  --ink-3:#6B7593;
  --line:#E4E7F2;
  --line-2:#EEF0F8;
  --paper:#FFFFFF;
  --canvas:#F7F8FD;

  --ind:#4F46E5;
  --ind-6:#4338CA;
  --ind-4:#6366F1;
  --ind-2:#A5B4FC;
  --ind-tint:#EEF0FF;
  --cyan:#0891B2;
  --cyan-tint:#E0F5FA;

  --green:#0E9F6E;
  --amber:#D97706;
  --red:#E11D48;
  --green-t:#E4F7EF;
  --amber-t:#FDF1E1;
  --red-t:#FDEAEF;

  --r:14px;
  --sh-1:0 1px 2px rgba(12,16,39,.05), 0 2px 8px rgba(12,16,39,.04);
  --sh-2:0 4px 12px rgba(12,16,39,.06), 0 12px 32px rgba(12,16,39,.07);
  --sh-3:0 18px 50px -12px rgba(40,44,120,.22), 0 6px 18px rgba(12,16,39,.06);

  background:var(--paper);
  color:var(--ink);
  font-family:'IBM Plex Sans',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.lp *{box-sizing:border-box;margin:0;padding:0}
.lp a{text-decoration:none;color:inherit}
/* NB: no 'font' shorthand here — it would outrank each button's own font-size. */
.lp button{font-family:inherit;line-height:inherit;cursor:pointer;border:0;background:none;color:inherit}
.lp ul{list-style:none}

/* ---------- reveal ---------- */
.lp [data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
.lp [data-reveal].is-in{opacity:1;transform:none}

/* ---------- nav ---------- */
.lp-nav{position:fixed;top:0;left:0;right:0;z-index:60;transition:background .3s,box-shadow .3s,border-color .3s;border-bottom:1px solid transparent}
.lp-nav.stuck{background:rgba(255,255,255,.85);backdrop-filter:blur(14px) saturate(1.6);border-bottom-color:var(--line);box-shadow:0 1px 20px rgba(12,16,39,.05)}
.lp-nav-in{max-width:1280px;margin:0 auto;padding:16px 32px;display:flex;align-items:center;gap:32px}
.lp-brand{display:flex;align-items:center;gap:10px;flex-shrink:0}
.lp-logo{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--ind-4),var(--ind-6));display:grid;place-items:center;box-shadow:0 4px 12px rgba(79,70,229,.32)}
.lp-logo svg{width:19px;height:19px;fill:none;stroke:#fff;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round}
.lp-brand-txt{font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:19px;letter-spacing:-.4px;color:var(--ink)}
.lp-brand-txt b{font-weight:800;color:var(--ind)}
.lp-nav-links{display:flex;gap:4px;margin-left:auto}
.lp-nav-links a{font-size:14px;font-weight:500;color:var(--ink-2);padding:8px 13px;border-radius:8px;transition:color .18s,background .18s}
.lp-nav-links a:hover{color:var(--ind-6);background:var(--ind-tint)}
.lp-nav-cta{display:flex;align-items:center;gap:10px;margin-left:8px}
.lp-btn-ghost{font-size:14px;font-weight:600;color:var(--ink-2);padding:8px 12px;border-radius:8px;transition:color .18s}
.lp-btn-ghost:hover{color:var(--ind-6)}

/* ---------- buttons ---------- */
.lp-btn-primary{
  position:relative;display:inline-flex;align-items:center;gap:9px;
  font-weight:600;font-size:15px;color:#fff;padding:14px 24px;border-radius:11px;
  background:linear-gradient(135deg,var(--ind-4),var(--ind-6));
  box-shadow:0 4px 14px rgba(79,70,229,.3),inset 0 1px 0 rgba(255,255,255,.22);
  transition:transform .18s cubic-bezier(.16,1,.3,1),box-shadow .18s;
  overflow:hidden;
}
.lp-btn-primary::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.34) 50%,transparent 70%);transform:translateX(-120%);transition:transform .7s}
.lp-btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(79,70,229,.4),inset 0 1px 0 rgba(255,255,255,.22)}
.lp-btn-primary:hover::after{transform:translateX(120%)}
.lp-btn-primary.sm{font-size:14px;padding:9px 17px;border-radius:9px}
.lp-btn-primary.lg{font-size:16px;padding:16px 30px}
.lp-arrow{transition:transform .22s cubic-bezier(.16,1,.3,1)}
.lp-btn-primary:hover .lp-arrow{transform:translateX(4px)}
.lp-btn-outline{
  display:inline-flex;align-items:center;font-weight:600;font-size:15px;color:var(--ink);
  padding:14px 24px;border-radius:11px;background:#fff;border:1.5px solid var(--line);
  box-shadow:var(--sh-1);transition:border-color .18s,color .18s,transform .18s,box-shadow .18s;
}
.lp-btn-outline:hover{border-color:var(--ind-2);color:var(--ind-6);transform:translateY(-2px);box-shadow:var(--sh-2)}
.lp-btn-outline.lg{font-size:16px;padding:16px 28px}

.lp-burger{display:none;flex-direction:column;gap:4px;padding:8px}
.lp-burger i{width:20px;height:2px;background:var(--ink-2);border-radius:2px;display:block}

.lp-mobile{display:none;flex-direction:column;background:#fff;border-top:1px solid var(--line);padding:12px 24px 20px;gap:2px;box-shadow:var(--sh-2)}
.lp-mobile a{padding:12px 4px;font-weight:600;color:var(--ink-2);border-bottom:1px solid var(--line-2)}
.lp-mobile-cta{margin-top:12px;text-align:center;background:linear-gradient(135deg,var(--ind-4),var(--ind-6));color:#fff!important;border-radius:10px;border:0!important}

/* ---------- hero ---------- */
.lp-hero{position:relative;padding:130px 32px 70px;overflow:hidden;background:var(--paper)}
.lp-hero-bg{position:absolute;inset:0;pointer-events:none}
.lp-grid{
  position:absolute;inset:0;
  background-image:linear-gradient(var(--line-2) 1px,transparent 1px),linear-gradient(90deg,var(--line-2) 1px,transparent 1px);
  background-size:56px 56px;
  -webkit-mask-image:radial-gradient(120% 80% at 50% 0%,#000 30%,transparent 78%);
  mask-image:radial-gradient(120% 80% at 50% 0%,#000 30%,transparent 78%);
  opacity:.9;
}
.lp-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55}
.lp-blob.b1{width:520px;height:520px;background:radial-gradient(circle,#C7D2FE,transparent 68%);top:-140px;left:-120px;animation:float1 18s ease-in-out infinite}
.lp-blob.b2{width:600px;height:600px;background:radial-gradient(circle,#CFFAFE,transparent 66%);top:40px;right:-200px;animation:float2 22s ease-in-out infinite}
@keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,30px)}}
@keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(-46px,36px)}}

.lp-hero-in{position:relative;max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1.05fr;gap:56px;align-items:center}

.lp-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:1.4px;
  color:var(--ind-6);background:var(--ind-tint);border:1px solid #DDE1FE;
  padding:7px 14px;border-radius:100px;margin-bottom:26px;
  animation:rise .7s cubic-bezier(.16,1,.3,1) both;
}
.lp-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--ind);box-shadow:0 0 0 0 rgba(79,70,229,.5);animation:pulse 2.2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(79,70,229,.45)}70%{box-shadow:0 0 0 8px rgba(79,70,229,0)}100%{box-shadow:0 0 0 0 rgba(79,70,229,0)}}

.lp-h1{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:60px;line-height:1.03;letter-spacing:-2.4px;margin-bottom:24px}
.lp-h1-l{display:block;animation:rise .8s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.06s * var(--i) + .08s)}
.lp-h1-l.accent{
  background:linear-gradient(100deg,var(--ind-4) 0%,var(--ind-6) 42%,var(--cyan) 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
}
.lp-h1-l:last-child{position:relative;display:inline-block}
.lp-underline{position:absolute;left:2px;bottom:-6px;width:100%;height:11px;overflow:visible}
.lp-underline path{fill:none;stroke:var(--ind);stroke-width:3.5;stroke-linecap:round;opacity:.28;stroke-dasharray:320;stroke-dashoffset:320;animation:draw 1s cubic-bezier(.16,1,.3,1) .75s forwards}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}

.lp-hero-sub{font-size:17.5px;line-height:1.66;color:var(--ink-2);max-width:530px;margin-bottom:30px;animation:rise .8s cubic-bezier(.16,1,.3,1) .3s both}
.lp-hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:22px;animation:rise .8s cubic-bezier(.16,1,.3,1) .38s both}
.lp-hero-badges{display:flex;flex-wrap:wrap;gap:18px;margin-bottom:32px;animation:rise .8s cubic-bezier(.16,1,.3,1) .46s both}
.lp-badge{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;font-weight:500;color:var(--ink-3)}
.lp-tick{
  width:16px;height:16px;border-radius:50%;background:var(--green-t);color:var(--green);
  display:grid;place-items:center;font-size:9px;font-weight:700;font-style:normal;flex-shrink:0;
}

.lp-chips{display:flex;flex-wrap:wrap;gap:8px;max-width:600px;padding-top:26px;border-top:1px dashed var(--line);animation:rise .8s cubic-bezier(.16,1,.3,1) .54s both}
.lp-chip{
  display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:500;color:var(--ink-2);
  background:var(--canvas);border:1px solid var(--line);padding:7px 12px;border-radius:100px;
  transition:transform .2s cubic-bezier(.16,1,.3,1),border-color .2s,color .2s,background .2s;
}
.lp-chip:hover{transform:translateY(-2px);border-color:var(--ind-2);color:var(--ind-6);background:var(--ind-tint)}
.lp-chip-ico{font-size:12px;line-height:1}

/* ---------- product window ---------- */
.lp-hero-right{position:relative;animation:rise 1s cubic-bezier(.16,1,.3,1) .45s both}
.ap-win{
  position:relative;background:#fff;border:1px solid var(--line);border-radius:16px;
  box-shadow:var(--sh-3);overflow:hidden;
  transform:perspective(1600px) rotateY(-3deg) rotateX(1.4deg);
  transition:transform .6s cubic-bezier(.16,1,.3,1),box-shadow .6s;
}
.ap-win:hover{transform:perspective(1600px) rotateY(0deg) rotateX(0deg) translateY(-4px);box-shadow:0 30px 70px -14px rgba(40,44,120,.28)}

.ap-win-chrome{display:flex;align-items:center;gap:7px;padding:11px 14px;background:var(--canvas);border-bottom:1px solid var(--line)}
.ap-dot{width:9px;height:9px;border-radius:50%}
.ap-dot.r{background:#FF6058}.ap-dot.y{background:#FFBD2E}.ap-dot.g{background:#28C840}
.ap-win-url{
  flex:1;margin:0 8px;background:#fff;border:1px solid var(--line);border-radius:7px;
  font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--ink-2);
  padding:4px 10px;display:flex;align-items:center;gap:6px;justify-content:center;
}
.ap-lock{font-size:8px}
.ap-url-dim{color:var(--ind-4)}
.ap-live{display:inline-flex;align-items:center;gap:5px;font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.6px;color:var(--green);background:var(--green-t);padding:3px 8px;border-radius:100px}
.ap-live i{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 1.6s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}

.ap-win-body{display:grid;grid-template-columns:188px 1fr;min-height:376px}

/* sidebar */
.ap-side{background:#FAFBFF;border-right:1px solid var(--line);padding:12px 6px;display:flex;flex-direction:column;gap:2px}
.ap-side-brand{display:flex;align-items:center;gap:7px;padding:4px 6px 12px}
.ap-side-logo{width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,var(--ind-4),var(--ind-6));color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;font-family:'Bricolage Grotesque',sans-serif}
.ap-side-name{font-size:12px;font-weight:700;letter-spacing:-.2px}
.ap-side-sec{font-family:'IBM Plex Mono',monospace;font-size:8.5px;font-weight:600;letter-spacing:1px;color:var(--ink-3);padding:6px 8px 4px;text-transform:uppercase}
.ap-side-item{
  position:relative;display:flex;align-items:center;gap:6px;padding:7px 6px;border-radius:7px;
  font-size:10.5px;font-weight:500;color:var(--ink-2);text-align:left;
  transition:background .25s,color .25s;
}
.ap-side-item .ap-side-lbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ap-side-item:hover{background:var(--line-2)}
.ap-side-item.on{background:var(--ind-tint);color:var(--ind-6);font-weight:600}
.ap-side-ico{font-size:11px;width:14px;text-align:center;flex-shrink:0}
.ap-side-bar{position:absolute;left:-6px;top:6px;bottom:6px;width:3px;border-radius:0 3px 3px 0;background:var(--ind);animation:barIn .35s cubic-bezier(.16,1,.3,1)}
@keyframes barIn{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.ap-side-user{margin-top:auto;display:flex;align-items:center;gap:7px;padding:8px 8px 2px;border-top:1px solid var(--line);font-size:10px;color:var(--ink-3)}
.ap-avatar{width:20px;height:20px;border-radius:50%;background:var(--cyan-tint);color:var(--cyan);font-size:8.5px;font-weight:700;display:grid;place-items:center;flex-shrink:0}

/* main */
.ap-main{display:flex;flex-direction:column;background:#fff}
.ap-crumbs{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line-2)}
.ap-crumb-txt{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.4px;color:var(--ink-3);text-transform:uppercase}
.ap-chip{font-size:10px;font-weight:600;padding:3px 9px;border-radius:100px;white-space:nowrap}
.ap-chip.ok{background:var(--green-t);color:var(--green)}
.ap-chip.warn{background:var(--amber-t);color:var(--amber)}
.ap-chip.info{background:var(--ind-tint);color:var(--ind-6)}

.ap-stage{position:relative;flex:1;padding:14px;overflow:hidden;display:flex}
.ap-stage-in{flex:1;min-height:0;animation:scrIn .55s cubic-bezier(.16,1,.3,1) both}
@keyframes scrIn{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
.ap-screen{display:flex;flex-direction:column;height:100%;gap:9px}
.ap-scr-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.ap-scr-title{font-size:12.5px;font-weight:700;letter-spacing:-.2px}
.ap-scr-meta{font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:var(--ink-3)}
.ap-scr-foot{display:flex;align-items:center;gap:12px;padding-top:8px;border-top:1px solid var(--line-2);margin-top:auto}
.ap-legend{display:inline-flex;align-items:center;gap:5px;font-size:9.5px;color:var(--ink-3);font-weight:500}
.ap-legend .lg{width:12px;height:3px;border-radius:2px;background:var(--ind-2);display:block}
.ap-legend .lg.crit{background:var(--red)}
.ap-legend .lg.today{background:var(--amber);width:2px;height:9px}
.ap-legend .lg.pv{background:var(--ink-3)}
.ap-legend .lg.ev{background:var(--ind)}
.ap-legend .lg.ac{background:var(--amber)}
.ap-ai-note{font-size:9.5px;color:var(--ind-6);font-weight:500;margin-left:auto}

/* gantt */
.ap-gantt-months{display:grid;grid-template-columns:repeat(5,1fr);margin-left:34%;font-family:'IBM Plex Mono',monospace;font-size:8.5px;color:var(--ink-3);letter-spacing:.5px;border-bottom:1px solid var(--line-2);padding-bottom:4px}
.ap-gantt{position:relative;display:flex;flex-direction:column;gap:10px;padding-top:8px}
.ap-gantt-row{display:grid;grid-template-columns:34% 1fr;align-items:center;gap:8px}
.ap-gantt-name{font-size:10px;font-weight:500;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ap-gantt-track{position:relative;height:13px;background:var(--canvas);border-radius:4px}
.ap-gantt-bar{
  position:absolute;top:2px;height:9px;left:var(--start);width:var(--span);
  background:var(--ind-2);border-radius:3px;overflow:hidden;
  transform-origin:left center;
  animation:barGrow .6s cubic-bezier(.16,1,.3,1) both;
  animation-delay:calc(.07s * var(--i));
}
.ap-gantt-bar.crit{background:#FBC9D5}
.ap-gantt-fill{position:absolute;inset:0;background:var(--ind);border-radius:3px}
.ap-gantt-bar.crit .ap-gantt-fill{background:var(--red)}
@keyframes barGrow{from{transform:scaleX(0);opacity:.4}to{transform:scaleX(1);opacity:1}}
.ap-gantt-today{position:absolute;left:calc(34% + 8px + (66% - 8px) * .52);top:0;bottom:0;width:2px;background:var(--amber);opacity:.65;border-radius:2px}
.ap-gantt-today::after{content:"";position:absolute;top:-3px;left:-2px;width:6px;height:6px;border-radius:50%;background:var(--amber)}

/* raid */
.ap-raid{flex:1;display:flex;flex-direction:column;justify-content:center;gap:2px}
.ap-raid-row{
  display:grid;grid-template-columns:48px 62px 1fr 54px 66px;align-items:center;gap:6px;
  padding:6px 7px;border-radius:6px;font-size:10px;
  animation:rowIn .5s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.05s * var(--i));
}
.ap-raid-row:not(.ap-raid-hdr):nth-child(even){background:#FBFCFF}
.ap-raid-row:not(.ap-raid-hdr):hover{background:var(--ind-tint)}
@keyframes rowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.ap-raid-hdr{
  font-family:'IBM Plex Mono',monospace;font-size:8.5px;font-weight:600;letter-spacing:.7px;
  color:var(--ink-3);text-transform:uppercase;border-bottom:1px solid var(--line-2);border-radius:0;padding-bottom:5px;animation:none;
}
.ap-raid-id{font-family:'IBM Plex Mono',monospace;font-weight:600;color:var(--ind-6);font-size:9.5px}
.ap-raid-type{font-size:9px;color:var(--ink-3);font-weight:500}
.ap-raid-d{display:flex;align-items:center;gap:6px;color:var(--ink);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:500}
.ap-rag{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.ap-rag.red{background:var(--red)}.ap-rag.amber{background:var(--amber)}.ap-rag.green{background:var(--green)}
.ap-raid-o{font-size:9.5px;color:var(--ink-3)}
.ap-pill{font-size:8.5px;font-weight:600;padding:2px 7px;border-radius:100px;text-align:center;white-space:nowrap}
.ap-pill.red{background:var(--red-t);color:var(--red)}
.ap-pill.amber{background:var(--amber-t);color:var(--amber)}
.ap-pill.green{background:var(--green-t);color:var(--green)}

/* scrum */
.ap-board{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;flex:1}
.ap-col{background:var(--canvas);border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:5px;animation:rowIn .5s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.07s * var(--i))}
.ap-col-hdr{display:flex;align-items:center;justify-content:space-between;gap:4px;font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:600;letter-spacing:.2px;color:var(--ink-3);text-transform:uppercase;padding:1px 2px 4px;white-space:nowrap}
.ap-col-hdr .wip{font-style:normal;font-size:8px;background:#fff;border:1px solid var(--line);color:var(--ink-3);padding:1px 5px;border-radius:100px}
.ap-col-hdr .wip.block{background:var(--red-t);border-color:transparent;color:var(--red)}
.ap-card{background:#fff;border:1px solid var(--line);border-radius:6px;padding:6px 7px;box-shadow:0 1px 2px rgba(12,16,39,.04);animation:rowIn .5s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.045s * var(--i) + .1s);transition:transform .2s,box-shadow .2s}
.ap-card:hover{transform:translateY(-1px);box-shadow:var(--sh-1)}
.ap-card-t{font-size:9.5px;font-weight:600;line-height:1.35;margin-bottom:5px;color:var(--ink)}
.ap-card-m{display:flex;align-items:center;justify-content:space-between}
.ap-prio{font-size:7.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;padding:1px 5px;border-radius:3px}
.ap-prio.high{background:var(--red-t);color:var(--red)}
.ap-prio.med{background:var(--amber-t);color:var(--amber)}
.ap-prio.low{background:var(--line-2);color:var(--ink-3)}
.ap-pts{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;color:var(--ind-6);background:var(--ind-tint);width:15px;height:15px;border-radius:4px;display:grid;place-items:center}
.ap-burn{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--ink-3);font-weight:600;letter-spacing:.5px;text-transform:uppercase}
.ap-burn-svg{flex:1;height:22px}
.ap-burn-svg polyline{fill:none;stroke:var(--ink-3);stroke-width:1;stroke-dasharray:2 2;vector-effect:non-scaling-stroke}
.ap-burn-svg polyline.actual{stroke:var(--ind);stroke-width:1.6;stroke-dasharray:none}

/* evm */
.ap-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.ap-kpi{
  border:1px solid var(--line);border-radius:8px;padding:7px 8px;display:flex;flex-direction:column;gap:1px;
  animation:rowIn .5s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.06s * var(--i));background:#fff;
}
.ap-kpi.green{border-color:#C6EEDD;background:#F6FDFA}
.ap-kpi.amber{border-color:#F6DEBB;background:#FFFCF6}
.ap-kpi-k{font-family:'IBM Plex Mono',monospace;font-size:8.5px;font-weight:600;letter-spacing:.8px;color:var(--ink-3)}
.ap-kpi-v{font-family:'Bricolage Grotesque',sans-serif;font-size:17px;font-weight:700;letter-spacing:-.5px;line-height:1.1}
.ap-kpi.green .ap-kpi-v{color:var(--green)}
.ap-kpi.amber .ap-kpi-v{color:var(--amber)}
.ap-kpi-n{font-size:8px;color:var(--ink-3)}
.ap-evm-chart{flex:1;min-height:0;display:flex;align-items:stretch;padding:4px 0}
.ap-evm-chart svg{width:100%;height:100%;min-height:80px}
.ap-evm-chart .grid{stroke:var(--line-2);stroke-width:1;vector-effect:non-scaling-stroke}
.ap-evm-chart polyline{fill:none;stroke-width:2;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:600;stroke-dashoffset:600;animation:draw2 1.1s cubic-bezier(.16,1,.3,1) forwards}
@keyframes draw2{to{stroke-dashoffset:0}}
.ap-evm-chart .pv{stroke:var(--ink-3);stroke-dasharray:4 3;animation:none;opacity:.55}
.ap-evm-chart .ev{stroke:var(--ind);animation-delay:.15s}
.ap-evm-chart .ac{stroke:var(--amber);animation-delay:.3s}

/* window tabs + stats */
.ap-tabs{display:flex;gap:5px;padding:8px 14px 12px;justify-content:center}
.ap-tab{width:26px;height:4px;border-radius:100px;background:var(--line);overflow:hidden;transition:width .35s cubic-bezier(.16,1,.3,1),background .3s}
.ap-tab.on{width:40px;background:var(--ind-tint)}
.ap-tab.on .ap-tab-fill{display:block;height:100%;background:var(--ind);animation:tabFill 4.2s linear forwards}
.ap-tab-fill{display:none}
@keyframes tabFill{from{width:0}to{width:100%}}
.ap-win:hover .ap-tab.on .ap-tab-fill{animation-play-state:paused}

.ap-win-stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);background:var(--canvas)}
.ap-wstat{padding:11px 8px;text-align:center;border-right:1px solid var(--line)}
.ap-wstat:last-child{border-right:0}
.ap-wstat b{display:block;font-family:'Bricolage Grotesque',sans-serif;font-size:19px;font-weight:800;letter-spacing:-.6px;color:var(--ind-6);line-height:1.15}
.ap-wstat span{font-size:9.5px;color:var(--ink-3);font-weight:500}

/* ---------- stat bar ---------- */
.lp-statbar{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:linear-gradient(180deg,#FBFCFF,#F4F6FE)}
.lp-statbar-in{max-width:1280px;margin:0 auto;padding:30px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.lp-statdiv{width:1px;height:38px;background:linear-gradient(180deg,transparent,var(--line),transparent)}
.lp-stat{text-align:center;flex:1}
.lp-stat-n{display:block;font-family:'Bricolage Grotesque',sans-serif;font-size:34px;font-weight:800;letter-spacing:-1.4px;line-height:1.05;background:linear-gradient(135deg,var(--ind-4),var(--ind-6));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.lp-stat-l{display:block;margin-top:5px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-3)}

/* ---------- sections ---------- */
.lp-sec{padding:88px 32px;background:var(--paper);position:relative}
.lp-sec.tint{background:var(--canvas);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.lp-sec-head{max-width:1280px;margin:0 auto 44px;text-align:center}
.lp-kicker{
  display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;
  letter-spacing:1.6px;text-transform:uppercase;color:var(--ind-6);
  background:var(--ind-tint);padding:6px 13px;border-radius:100px;margin-bottom:16px;
}
.lp-h2{font-family:'Bricolage Grotesque',sans-serif;font-size:40px;font-weight:700;letter-spacing:-1.5px;line-height:1.12;margin-bottom:12px}
.lp-sec-sub{font-size:16.5px;line-height:1.6;color:var(--ink-3);max-width:600px;margin:0 auto}

/* ---------- feature explorer ---------- */
.lp-feat-wrap{max-width:1280px;margin:0 auto}
.lp-feat-layout{
  display:grid;grid-template-columns:296px 1fr;background:#fff;
  border:1px solid var(--line);border-radius:18px;box-shadow:var(--sh-2);overflow:hidden;
}
.lp-feat-nav{border-right:1px solid var(--line);background:#FBFCFF;max-height:560px;overflow-y:auto;padding:10px}
.lp-feat-nav::-webkit-scrollbar{width:6px}
.lp-feat-nav::-webkit-scrollbar-thumb{background:var(--line);border-radius:100px}
.lp-feat-group{
  font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;letter-spacing:1.2px;
  text-transform:uppercase;color:var(--ink-3);padding:14px 10px 6px;
}
.lp-ftab{
  position:relative;display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;
  border-radius:9px;font-size:13px;font-weight:500;color:var(--ink-2);text-align:left;
  transition:background .18s,color .18s;
}
.lp-ftab:hover{background:var(--line-2);color:var(--ink)}
.lp-ftab.active{background:var(--ind-tint);color:var(--ind-6);font-weight:600}
.lp-ftab.active::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:var(--ind)}
.lp-ftab-icon{
  width:26px;height:26px;border-radius:7px;background:#fff;border:1px solid var(--line);
  display:grid;place-items:center;font-size:12px;flex-shrink:0;transition:border-color .18s,transform .18s;
}
.lp-ftab.active .lp-ftab-icon{border-color:var(--ind-2);transform:scale(1.05)}
.lp-ftab-name{line-height:1.3}

.lp-feat-panel{position:relative;padding:44px 44px;display:flex;flex-direction:column;animation:panelIn .45s cubic-bezier(.16,1,.3,1) both;overflow:hidden}
@keyframes panelIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.lp-panel-kicker{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:1.3px;color:var(--ind);margin-bottom:12px}
.lp-panel-h3{font-family:'Bricolage Grotesque',sans-serif;font-size:29px;font-weight:700;letter-spacing:-1px;line-height:1.18;margin-bottom:12px;max-width:520px}
.lp-panel-desc{font-size:16px;line-height:1.68;color:var(--ink-2);max-width:560px;margin-bottom:26px}
.lp-panel-bullets{display:grid;grid-template-columns:1fr 1fr;gap:12px 22px;max-width:600px}
.lp-panel-bullet{
  display:flex;align-items:flex-start;gap:10px;font-size:14.5px;font-weight:500;color:var(--ink);
  animation:rise .5s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.06s * var(--i) + .1s);
}
.lp-bck{
  width:19px;height:19px;border-radius:6px;background:var(--ind-tint);color:var(--ind-6);
  display:grid;place-items:center;font-size:10px;font-weight:700;flex-shrink:0;margin-top:1px;
}
.lp-bck.sm{width:16px;height:16px;font-size:9px;border-radius:5px}
.lp-panel-art{position:absolute;right:-30px;bottom:-30px;width:190px;height:190px;border-radius:28px;background:linear-gradient(135deg,var(--ind-tint),transparent 70%);display:grid;place-items:center;pointer-events:none;opacity:.85;transform:rotate(-8deg)}
.lp-panel-art-ico{font-size:62px;opacity:.16;filter:saturate(0)}

/* ---------- roles ---------- */
.lp-roles{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lp-role{
  background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px;
  box-shadow:var(--sh-1);position:relative;overflow:hidden;
  transition:transform .28s cubic-bezier(.16,1,.3,1),box-shadow .28s,border-color .28s;
}
.lp-role::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--ind);transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.16,1,.3,1)}
.lp-role.cyan::before{background:var(--cyan)}
.lp-role.amber::before{background:var(--amber)}
.lp-role.slate::before{background:var(--ink-3)}
.lp-role:hover{transform:translateY(-4px);box-shadow:var(--sh-2);border-color:var(--ind-2)}
.lp-role:hover::before{transform:scaleX(1)}
.lp-role-top{display:flex;align-items:center;gap:13px;padding-bottom:16px;margin-bottom:16px;border-bottom:1px solid var(--line-2)}
.lp-role-ico{width:44px;height:44px;border-radius:12px;background:var(--ind-tint);display:grid;place-items:center;font-size:20px;flex-shrink:0}
.lp-role.cyan .lp-role-ico{background:var(--cyan-tint)}
.lp-role.amber .lp-role-ico{background:var(--amber-t)}
.lp-role.slate .lp-role-ico{background:var(--line-2)}
.lp-role-name{font-family:'Bricolage Grotesque',sans-serif;font-size:17.5px;font-weight:700;letter-spacing:-.4px;line-height:1.2}
.lp-role-scope{font-size:12.5px;color:var(--ink-3);font-weight:500}
.lp-role-list{display:flex;flex-direction:column;gap:9px}
.lp-role-list li{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;color:var(--ink-2);font-weight:500}

/* ---------- cards ---------- */
.lp-cards{max-width:1280px;margin:0 auto;display:grid;gap:20px}
.lp-cards.c4{grid-template-columns:repeat(4,1fr)}
.lp-cards.c3{grid-template-columns:repeat(3,1fr)}
.lp-card{
  position:relative;background:#fff;border:1px solid var(--line);border-radius:16px;padding:26px 24px;
  box-shadow:var(--sh-1);overflow:hidden;
  transition:transform .28s cubic-bezier(.16,1,.3,1),box-shadow .28s,border-color .28s;
}
.lp-card:hover{transform:translateY(-4px);box-shadow:var(--sh-2);border-color:var(--ind-2)}
.lp-card-ico{
  width:46px;height:46px;border-radius:13px;background:linear-gradient(140deg,var(--ind-tint),#fff);
  border:1px solid #E6E9FE;display:grid;place-items:center;font-size:21px;margin-bottom:16px;
  transition:transform .3s cubic-bezier(.16,1,.3,1);
}
.lp-card:hover .lp-card-ico{transform:scale(1.08) rotate(-4deg)}
.lp-card-t{font-family:'Bricolage Grotesque',sans-serif;font-size:17.5px;font-weight:700;letter-spacing:-.4px;line-height:1.3;margin-bottom:9px}
.lp-card-b{font-size:14.5px;line-height:1.62;color:var(--ink-3)}
.lp-card-num{
  position:absolute;top:16px;right:20px;font-family:'Bricolage Grotesque',sans-serif;
  font-size:34px;font-weight:800;color:var(--line-2);letter-spacing:-1px;line-height:1;
  transition:color .28s;
}
.lp-card.lift:hover .lp-card-num{color:var(--ind-2)}

/* ---------- cta ---------- */
.lp-cta{position:relative;padding:96px 32px;text-align:center;overflow:hidden;background:linear-gradient(180deg,#FFFFFF 0%,#F2F4FE 100%);border-top:1px solid var(--line)}
.lp-cta-bg{position:absolute;inset:0;pointer-events:none}
.lp-blob.c1{width:520px;height:520px;background:radial-gradient(circle,#C7D2FE,transparent 66%);bottom:-260px;left:8%;opacity:.6}
.lp-blob.c2{width:460px;height:460px;background:radial-gradient(circle,#CFFAFE,transparent 66%);top:-200px;right:10%;opacity:.6}
.lp-cta-in{position:relative;max-width:720px;margin:0 auto}
.lp-cta-h2{font-family:'Bricolage Grotesque',sans-serif;font-size:44px;font-weight:800;letter-spacing:-1.8px;line-height:1.1;margin-bottom:16px}
.lp-cta-sub{font-size:17.5px;line-height:1.62;color:var(--ink-2);margin-bottom:30px}
.lp-cta-btns{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;margin-bottom:26px}
.lp-cta-badges{display:flex;gap:20px;justify-content:center;flex-wrap:wrap}
.lp-cta-badges span{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;font-weight:500;color:var(--ink-3)}

/* ---------- footer ---------- */
.lp-foot{background:#fff;border-top:1px solid var(--line);padding:60px 32px 0}
.lp-foot-in{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1.6fr repeat(4,1fr);gap:36px;padding-bottom:44px}
.lp-foot-brand .lp-brand{margin-bottom:14px}
.lp-foot-blurb{font-size:14px;line-height:1.68;color:var(--ink-3);max-width:290px}
.lp-foot-col h4{
  font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:1.3px;
  text-transform:uppercase;color:var(--ink);margin-bottom:14px;
}
.lp-foot-col a{display:block;font-size:14px;color:var(--ink-3);padding:5px 0;transition:color .18s,transform .18s}
.lp-foot-col a:hover{color:var(--ind-6);transform:translateX(3px)}
.lp-foot-bar{
  max-width:1280px;margin:0 auto;border-top:1px solid var(--line);padding:20px 0;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  font-size:13px;color:var(--ink-3);
}
.lp-foot-legal{display:flex;align-items:center;gap:8px}
.lp-foot-legal a:hover{color:var(--ind-6)}
.lp-foot-legal i{font-style:normal;opacity:.5}

/* ---------- responsive ---------- */
@media(max-width:1080px){
  .lp-hero-in{grid-template-columns:1fr;gap:48px}
  .lp-hero-sub,.lp-chips{max-width:none}
  .ap-win{transform:none}
  .ap-win:hover{transform:translateY(-4px)}
  .lp-cards.c4{grid-template-columns:repeat(2,1fr)}
  .lp-cards.c3{grid-template-columns:repeat(2,1fr)}
  .lp-roles{grid-template-columns:repeat(2,1fr)}
  .lp-foot-in{grid-template-columns:1fr 1fr 1fr}
  .lp-feat-layout{grid-template-columns:240px 1fr}
  .lp-feat-panel{padding:30px 28px}
}
@media(max-width:860px){
  .lp-nav-links{display:none}
  .lp-burger{display:flex}
  .lp-mobile{display:flex}
  .lp-btn-primary.sm{display:none}
  .lp-nav-in{padding:12px 20px;gap:12px}
  .lp-nav-cta{margin-left:auto}
  .lp-hero{padding:104px 20px 56px}
  .lp-h1{font-size:42px;letter-spacing:-1.6px}
  .lp-hero-sub{font-size:16px}
  .lp-sec{padding:64px 20px}
  .lp-h2{font-size:31px;letter-spacing:-1.1px}
  .lp-sec-sub{font-size:15.5px}
  .lp-statbar-in{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;padding:26px 20px}
  .lp-statdiv{display:none}
  .lp-stat-n{font-size:27px}
  .lp-roles{grid-template-columns:1fr}
  .lp-cards.c4,.lp-cards.c3{grid-template-columns:1fr}
  .lp-feat-layout{grid-template-columns:1fr;max-height:none}
  .lp-feat-nav{max-height:260px;border-right:0;border-bottom:1px solid var(--line)}
  .lp-feat-panel{padding:26px 22px}
  .lp-panel-h3{font-size:23px}
  .lp-panel-bullets{grid-template-columns:1fr}
  .lp-panel-art{display:none}
  .ap-win-body{grid-template-columns:1fr}
  .ap-side{flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid var(--line);gap:4px;padding:8px}
  .ap-side-brand,.ap-side-sec,.ap-side-user{display:none}
  .ap-side-item{flex-shrink:0;white-space:nowrap}
  .ap-side-bar{display:none}
  .ap-board{grid-template-columns:repeat(2,1fr)}
  .ap-kpis{grid-template-columns:repeat(2,1fr)}
  .ap-raid-row{grid-template-columns:44px 1fr 60px}
  .ap-raid-type,.ap-raid-o{display:none}
  .lp-cta{padding:72px 20px}
  .lp-cta-h2{font-size:32px;letter-spacing:-1.2px}
  .lp-foot{padding:48px 20px 0}
  .lp-foot-in{grid-template-columns:1fr 1fr;gap:28px}
  .lp-foot-bar{flex-direction:column;text-align:center}
}
@media(max-width:520px){
  .lp-h1{font-size:34px;letter-spacing:-1.2px}
  .lp-statbar-in{grid-template-columns:repeat(2,1fr)}
  .lp-hero-btns{flex-direction:column;align-items:stretch}
  .lp-btn-primary,.lp-btn-outline{justify-content:center}
  .ap-board{grid-template-columns:1fr}
  .lp-foot-in{grid-template-columns:1fr}
}
@media(prefers-reduced-motion:reduce){
  .lp *,.lp *::before,.lp *::after{animation:none!important;transition:none!important}
  .lp [data-reveal]{opacity:1;transform:none}
}
`;
