"use client";

import { FormEvent, useMemo, useState } from "react";

type Language = "ko" | "en";
type Role = "owner" | "operations" | "finance";
type View = "overview" | "projects" | "finance" | "support" | "audit";

type Project = {
  id: string;
  titleKo: string;
  titleEn: string;
  client: string;
  status: "planned" | "active" | "qa";
  progress: number;
  due: string;
  amount: number;
  owner: string;
};

const copy = {
  ko: {
    demo: "가상 데이터 기반 공개 데모",
    overview: "개요",
    projects: "프로젝트",
    finance: "청구·수금",
    support: "수정·하자",
    audit: "활동 기록",
    workspace: "운영 워크스페이스",
    title: "견적부터 수금까지, 흩어진 운영을 한 흐름으로.",
    titleLine1: "견적부터 수금까지,",
    titleLine2: "흩어진 운영을 한 흐름으로.",
    subtitle:
      "소규모 서비스업의 고객·견적·프로젝트·청구·수정 요청을 연결하는 반응형 Mini ERP 데모입니다.",
    newQuote: "새 견적 만들기",
    thisMonth: "이번 달 확정 매출",
    outstanding: "미수금",
    activeProjects: "진행 프로젝트",
    sla: "응답 SLA",
    vsLastMonth: "전월 대비",
    dueThisWeek: "이번 주 수금 예정",
    onSchedule: "일정 정상",
    within24h: "24시간 이내",
    revenueFlow: "매출 흐름",
    pipeline: "업무 파이프라인",
    attention: "오늘 확인할 항목",
    recent: "최근 거래",
    customer: "고객",
    work: "업무",
    stage: "상태",
    amount: "금액",
    next: "다음 작업",
    allProjects: "전체 프로젝트",
    planned: "예정",
    active: "진행",
    qa: "검수",
    due: "마감",
    owner: "담당",
    detail: "프로젝트 상세",
    progress: "진행률",
    billing: "청구 상태",
    milestones: "마일스톤",
    invoices: "청구서",
    invoiceSummary: "수금 현황",
    exportCsv: "CSV 내보내기",
    invoice: "청구서 번호",
    issueDate: "발행일",
    paymentDate: "결제 예정일",
    paid: "수금 완료",
    pending: "수금 대기",
    overdue: "기한 초과",
    tickets: "수정·하자 요청",
    defect: "하자",
    change: "범위 변경",
    clarification: "확인 필요",
    ticketRule: "계약 범위와 완료 기준을 기준으로 자동 분류한 데모입니다.",
    activityLog: "변경 이력",
    logRule: "누가 무엇을 바꿨는지 추적할 수 있도록 기록합니다.",
    role: "역할",
    ownerRole: "대표·관리자",
    operationsRole: "운영 담당",
    financeRole: "재무 담당",
    locked: "현재 역할에 제한됨",
    demoBoundary: "실제 고객·계약·결제 정보가 없는 기능 데모",
    quoteTitle: "새 견적 초안",
    service: "서비스",
    cancel: "취소",
    saveDraft: "초안 저장",
    quoteSaved: "견적 초안이 이 기기에 저장되었습니다.",
    localOnly: "외부 전송 없음",
    viewAll: "전체 보기",
    ready: "승인 대기",
    currency: "KRW",
  },
  en: {
    demo: "Public demo with fictional data",
    overview: "Overview",
    projects: "Projects",
    finance: "Billing",
    support: "Revisions",
    audit: "Activity log",
    workspace: "Operations workspace",
    title: "One operating flow, from quote to collection.",
    titleLine1: "One operating flow,",
    titleLine2: "from quote to collection.",
    subtitle:
      "A responsive Mini ERP demo connecting customers, quotes, projects, invoices, and revision requests for service businesses.",
    newQuote: "Create quote",
    thisMonth: "Confirmed this month",
    outstanding: "Outstanding",
    activeProjects: "Active projects",
    sla: "Response SLA",
    vsLastMonth: "vs. last month",
    dueThisWeek: "Due this week",
    onSchedule: "On schedule",
    within24h: "within 24 hours",
    revenueFlow: "Revenue flow",
    pipeline: "Work pipeline",
    attention: "Needs attention today",
    recent: "Recent transactions",
    customer: "Customer",
    work: "Work",
    stage: "Status",
    amount: "Amount",
    next: "Next action",
    allProjects: "All projects",
    planned: "Planned",
    active: "Active",
    qa: "QA",
    due: "Due",
    owner: "Owner",
    detail: "Project detail",
    progress: "Progress",
    billing: "Billing status",
    milestones: "Milestones",
    invoices: "Invoices",
    invoiceSummary: "Collection overview",
    exportCsv: "Export CSV",
    invoice: "Invoice",
    issueDate: "Issued",
    paymentDate: "Payment due",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    tickets: "Revision & defect requests",
    defect: "Defect",
    change: "Change request",
    clarification: "Clarification",
    ticketRule: "A fictional demo classified against scope and acceptance criteria.",
    activityLog: "Change history",
    logRule: "Every important change records who changed what and when.",
    role: "Role",
    ownerRole: "Owner / Admin",
    operationsRole: "Operations",
    financeRole: "Finance",
    locked: "Restricted for this role",
    demoBoundary: "Feature demo with no real client, contract, or payment data",
    quoteTitle: "New quote draft",
    service: "Service",
    cancel: "Cancel",
    saveDraft: "Save draft",
    quoteSaved: "Quote draft saved on this device.",
    localOnly: "No external submission",
    viewAll: "View all",
    ready: "Awaiting approval",
    currency: "KRW",
  },
} as const;

const projects: Project[] = [
  {
    id: "PRJ-024",
    titleKo: "다국어 예약 사이트 개선",
    titleEn: "Multilingual booking site refresh",
    client: "Northstar Studio",
    status: "active",
    progress: 64,
    due: "08.16",
    amount: 4800000,
    owner: "Mina",
  },
  {
    id: "PRJ-025",
    titleKo: "운영 대시보드 구축",
    titleEn: "Operations dashboard build",
    client: "Arc Foods",
    status: "qa",
    progress: 88,
    due: "08.13",
    amount: 3200000,
    owner: "Joon",
  },
  {
    id: "PRJ-026",
    titleKo: "고객 포털 반응형 수정",
    titleEn: "Client portal responsive fixes",
    client: "Plainworks",
    status: "planned",
    progress: 18,
    due: "08.22",
    amount: 1800000,
    owner: "Mina",
  },
  {
    id: "PRJ-027",
    titleKo: "문의 자동분류 프로토타입",
    titleEn: "Inquiry triage prototype",
    client: "Blue Orchard",
    status: "active",
    progress: 46,
    due: "08.20",
    amount: 3000000,
    owner: "Joon",
  },
  {
    id: "PRJ-028",
    titleKo: "주문 관리자 화면 QA",
    titleEn: "Order admin QA sprint",
    client: "Morrow Market",
    status: "qa",
    progress: 94,
    due: "08.12",
    amount: 1200000,
    owner: "Mina",
  },
];

const invoices = [
  { id: "INV-2608-018", client: "Northstar Studio", amount: 2400000, issued: "08.02", due: "08.16", status: "pending" },
  { id: "INV-2608-017", client: "Arc Foods", amount: 3200000, issued: "08.01", due: "08.12", status: "paid" },
  { id: "INV-2607-042", client: "Plainworks", amount: 1800000, issued: "07.22", due: "08.05", status: "overdue" },
  { id: "INV-2607-039", client: "Morrow Market", amount: 1200000, issued: "07.18", due: "08.01", status: "paid" },
] as const;

const tickets = [
  { id: "T-108", project: "PRJ-025", titleKo: "모바일 필터 버튼 겹침", titleEn: "Mobile filter buttons overlap", type: "defect", priority: "P1", age: "2h" },
  { id: "T-107", project: "PRJ-024", titleKo: "예약 완료 메일 문구 변경", titleEn: "Change booking email copy", type: "change", priority: "P2", age: "5h" },
  { id: "T-106", project: "PRJ-028", titleKo: "정렬 기준 완료 조건 확인", titleEn: "Confirm sorting acceptance rule", type: "clarification", priority: "P2", age: "1d" },
  { id: "T-105", project: "PRJ-027", titleKo: "빈 상태 안내 누락", titleEn: "Missing empty-state guidance", type: "defect", priority: "P2", age: "1d" },
] as const;

const auditEvents = [
  { time: "14:32", actor: "Mina", actionKo: "PRJ-025를 검수 단계로 이동", actionEn: "Moved PRJ-025 to QA", meta: "Project · stage" },
  { time: "13:48", actor: "Joon", actionKo: "T-108을 하자로 분류", actionEn: "Classified T-108 as a defect", meta: "Support · classification" },
  { time: "11:06", actor: "Finance", actionKo: "INV-2608-017 수금 완료 처리", actionEn: "Marked INV-2608-017 as paid", meta: "Finance · payment status" },
  { time: "09:21", actor: "Mina", actionKo: "PRJ-024 마일스톤 수정", actionEn: "Updated PRJ-024 milestone", meta: "Project · milestone" },
] as const;

const rolePermissions: Record<Role, View[]> = {
  owner: ["overview", "projects", "finance", "support", "audit"],
  operations: ["overview", "projects", "support", "audit"],
  finance: ["overview", "finance", "audit"],
};

const viewMark: Record<View, string> = {
  overview: "⌂",
  projects: "▦",
  finance: "₩",
  support: "◇",
  audit: "↺",
};

function formatMoney(value: number, language: Language) {
  return new Intl.NumberFormat(language === "ko" ? "ko-KR" : "en-US", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ko");
  const [role, setRole] = useState<Role>("owner");
  const [view, setView] = useState<View>("overview");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteCount, setQuoteCount] = useState(3);
  const [toast, setToast] = useState("");
  const [quote, setQuote] = useState({ customer: "", service: "", amount: "" });
  const t = copy[language];

  const kpis = useMemo(
    () => [
      { label: t.thisMonth, value: "₩12.8M", note: `+18% ${t.vsLastMonth}`, tone: "mint" },
      { label: t.outstanding, value: "₩2.4M", note: t.dueThisWeek, tone: "amber" },
      { label: t.activeProjects, value: "7", note: `5 ${t.onSchedule}`, tone: "blue" },
      { label: t.sla, value: "92%", note: t.within24h, tone: "violet" },
    ],
    [t],
  );

  const navItems: { id: View; label: string }[] = [
    { id: "overview", label: t.overview },
    { id: "projects", label: t.projects },
    { id: "finance", label: t.finance },
    { id: "support", label: t.support },
    { id: "audit", label: t.audit },
  ];

  const handleRole = (nextRole: Role) => {
    setRole(nextRole);
    if (!rolePermissions[nextRole].includes(view)) setView("overview");
  };

  const handleQuote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuoteCount((value) => value + 1);
    setQuoteOpen(false);
    setQuote({ customer: "", service: "", amount: "" });
    setToast(t.quoteSaved);
    window.setTimeout(() => setToast(""), 3200);
  };

  const exportInvoices = () => {
    const rows = ["invoice,customer,amount,status", ...invoices.map((item) => `${item.id},${item.client},${item.amount},${item.status}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "serviceos-invoice-demo.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <span className="brand-mark">S</span>
          <div>
            <strong>serviceos.</strong>
            <small>FORBLUNE LAB</small>
          </div>
        </div>

        <div className="workspace-card">
          <span className="workspace-avatar">FL</span>
          <div>
            <strong>Forblune Studio</strong>
            <small>{t.workspace}</small>
          </div>
          <span className="chevron">⌄</span>
        </div>

        <nav aria-label={language === "ko" ? "주요 메뉴" : "Primary navigation"}>
          {navItems.map((item) => {
            const allowed = rolePermissions[role].includes(item.id);
            return (
              <button
                key={item.id}
                className={view === item.id ? "nav-item active" : "nav-item"}
                onClick={() => allowed && setView(item.id)}
                aria-current={view === item.id ? "page" : undefined}
                aria-disabled={!allowed}
                title={!allowed ? t.locked : undefined}
              >
                <span className="nav-icon">{viewMark[item.id]}</span>
                <span>{item.label}</span>
                {!allowed && <span className="lock">×</span>}
                {item.id === "support" && allowed && <span className="nav-count">4</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <div>
            <strong>{t.demo}</strong>
            <small>{t.localOnly}</small>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark">S</span>
            <strong>serviceos.</strong>
          </div>
          <div className="topbar-actions">
            <label className="role-select">
              <span>{t.role}</span>
              <select value={role} onChange={(event) => handleRole(event.target.value as Role)}>
                <option value="owner">{t.ownerRole}</option>
                <option value="operations">{t.operationsRole}</option>
                <option value="finance">{t.financeRole}</option>
              </select>
            </label>
            <div className="language-toggle" aria-label="Language">
              <button className={language === "ko" ? "selected" : ""} onClick={() => setLanguage("ko")}>한국어</button>
              <button className={language === "en" ? "selected" : ""} onClick={() => setLanguage("en")}>EN</button>
            </div>
            <button className="primary-button compact" onClick={() => setQuoteOpen(true)}>＋ {t.newQuote}</button>
          </div>
        </header>

        <div className="content-wrap">
          {view === "overview" && (
            <>
              <section className="hero-block">
                <div>
                  <span className="eyebrow">SERVICE BUSINESS MINI ERP</span>
                  <h1 aria-label={t.title}>
                    <span>{t.titleLine1}</span>
                    <span>{t.titleLine2}</span>
                  </h1>
                  <p>{t.subtitle}</p>
                </div>
                <button className="primary-button hero-action" onClick={() => setQuoteOpen(true)}>＋ {t.newQuote}</button>
              </section>

              <section className="kpi-grid" aria-label="Key performance indicators">
                {kpis.map((item) => (
                  <article className={`kpi-card ${item.tone}`} key={item.label}>
                    <div className="kpi-head"><span>{item.label}</span><span>↗</span></div>
                    <strong>{item.value}</strong>
                    <small>{item.note}</small>
                  </article>
                ))}
              </section>

              <section className="overview-grid">
                <article className="panel revenue-panel">
                  <div className="panel-heading">
                    <div><span className="section-kicker">01</span><h2>{t.revenueFlow}</h2></div>
                    <span className="period-chip">2026.08</span>
                  </div>
                  <div className="chart-wrap" aria-label={language === "ko" ? "최근 6개월 매출 그래프" : "Six month revenue chart"}>
                    {[42, 58, 49, 76, 66, 91].map((height, index) => (
                      <div className="bar-column" key={height + index}>
                        <span className={index === 5 ? "bar current" : "bar"} style={{ height: `${height}%` }} />
                        <small>{["Mar", "Apr", "May", "Jun", "Jul", "Aug"][index]}</small>
                      </div>
                    ))}
                    <div className="chart-total"><span>{language === "ko" ? "예상 수금" : "Forecast"}</span><strong>₩15.2M</strong></div>
                  </div>
                </article>

                <article className="panel attention-panel">
                  <div className="panel-heading">
                    <div><span className="section-kicker">02</span><h2>{t.attention}</h2></div>
                    <button className="text-button" onClick={() => setView("support")}>{t.viewAll} →</button>
                  </div>
                  <div className="attention-list">
                    <button onClick={() => setView("finance")}>
                      <span className="attention-icon amber">!</span>
                      <span><strong>{language === "ko" ? "기한이 지난 청구서 1건" : "1 overdue invoice"}</strong><small>INV-2607-042 · ₩1.8M</small></span>
                      <span>→</span>
                    </button>
                    <button onClick={() => setView("support")}>
                      <span className="attention-icon red">P1</span>
                      <span><strong>{language === "ko" ? "긴급 하자 확인 필요" : "Urgent defect needs triage"}</strong><small>T-108 · PRJ-025</small></span>
                      <span>→</span>
                    </button>
                    <button onClick={() => setView("projects")}>
                      <span className="attention-icon blue">QA</span>
                      <span><strong>{language === "ko" ? "오늘 검수 마감 2건" : "2 QA reviews due today"}</strong><small>PRJ-025 · PRJ-028</small></span>
                      <span>→</span>
                    </button>
                  </div>
                </article>
              </section>

              <section className="panel pipeline-panel">
                <div className="panel-heading">
                  <div><span className="section-kicker">03</span><h2>{t.pipeline}</h2></div>
                  <span className="draft-count">{quoteCount} {language === "ko" ? "견적 초안" : "quote drafts"}</span>
                </div>
                <div className="pipeline-flow">
                  {[
                    [language === "ko" ? "견적" : "Quote", 3, "#e0f0ff"],
                    [language === "ko" ? "승인" : "Approved", 2, "#e6e7ff"],
                    [language === "ko" ? "진행" : "In progress", 4, "#d9f6eb"],
                    [language === "ko" ? "검수" : "QA", 2, "#fff0c8"],
                    [language === "ko" ? "수금" : "Collected", 5, "#dff5d4"],
                  ].map(([label, count, color], index) => (
                    <div className="flow-stage" key={String(label)}>
                      <span className="flow-index">0{index + 1}</span>
                      <div className="flow-count" style={{ background: String(color) }}>{count}</div>
                      <strong>{label}</strong>
                      {index < 4 && <span className="flow-arrow">→</span>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel transactions-panel">
                <div className="panel-heading">
                  <div><span className="section-kicker">04</span><h2>{t.recent}</h2></div>
                  <button className="text-button" onClick={() => setView("projects")}>{t.viewAll} →</button>
                </div>
                <div className="data-table compact-table">
                  <div className="table-row table-head"><span>{t.customer}</span><span>{t.work}</span><span>{t.stage}</span><span>{t.amount}</span><span>{t.next}</span></div>
                  {projects.slice(0, 4).map((project) => (
                    <button className="table-row" key={project.id} onClick={() => setSelectedProject(project)}>
                      <span><strong>{project.client}</strong><small>{project.id}</small></span>
                      <span>{language === "ko" ? project.titleKo : project.titleEn}</span>
                      <span><i className={`status-pill ${project.status}`}>{t[project.status]}</i></span>
                      <span>{formatMoney(project.amount, language)}</span>
                      <span>{project.due} →</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {view === "projects" && (
            <section className="view-section">
              <div className="view-heading"><div><span className="eyebrow">PROJECT DELIVERY</span><h1>{t.allProjects}</h1><p>{t.demoBoundary}</p></div><button className="primary-button" onClick={() => setQuoteOpen(true)}>＋ {t.newQuote}</button></div>
              <div className="kanban-board">
                {(["planned", "active", "qa"] as const).map((status) => (
                  <div className="kanban-column" key={status}>
                    <div className="kanban-title"><span><i className={`status-dot-large ${status}`} />{t[status]}</span><strong>{projects.filter((project) => project.status === status).length}</strong></div>
                    {projects.filter((project) => project.status === status).map((project) => (
                      <button className="project-card" key={project.id} onClick={() => setSelectedProject(project)}>
                        <div className="project-id"><span>{project.id}</span><span>•••</span></div>
                        <h3>{language === "ko" ? project.titleKo : project.titleEn}</h3>
                        <p>{project.client}</p>
                        <div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div>
                        <div className="project-meta"><span>{project.progress}%</span><span>{t.due} {project.due}</span></div>
                        <div className="project-footer"><span className="avatar-small">{project.owner.slice(0, 1)}</span><strong>{formatMoney(project.amount, language)}</strong></div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {view === "finance" && (
            <section className="view-section">
              <div className="view-heading"><div><span className="eyebrow">FINANCE CONTROL</span><h1>{t.invoices}</h1><p>{t.demoBoundary}</p></div><button className="secondary-button" onClick={exportInvoices}>↓ {t.exportCsv}</button></div>
              <div className="finance-summary">
                <article><span>{t.paid}</span><strong>₩4.4M</strong><small>2 invoices</small></article>
                <article><span>{t.pending}</span><strong>₩2.4M</strong><small>1 invoice</small></article>
                <article className="danger"><span>{t.overdue}</span><strong>₩1.8M</strong><small>1 invoice</small></article>
              </div>
              <div className="panel invoice-panel">
                <div className="data-table invoice-table">
                  <div className="table-row table-head"><span>{t.invoice}</span><span>{t.customer}</span><span>{t.issueDate}</span><span>{t.paymentDate}</span><span>{t.amount}</span><span>{t.stage}</span></div>
                  {invoices.map((invoice) => (
                    <div className="table-row" key={invoice.id}>
                      <span><strong>{invoice.id}</strong></span><span>{invoice.client}</span><span>{invoice.issued}</span><span>{invoice.due}</span><span>{formatMoney(invoice.amount, language)}</span><span><i className={`status-pill ${invoice.status}`}>{t[invoice.status]}</i></span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {view === "support" && (
            <section className="view-section">
              <div className="view-heading"><div><span className="eyebrow">SCOPE & QUALITY</span><h1>{t.tickets}</h1><p>{t.ticketRule}</p></div><span className="boundary-chip">{t.demoBoundary}</span></div>
              <div className="ticket-grid">
                {(["defect", "change", "clarification"] as const).map((type) => (
                  <div className="ticket-column" key={type}>
                    <div className="ticket-column-title"><span className={`type-dot ${type}`} /> <strong>{t[type]}</strong><span>{tickets.filter((ticket) => ticket.type === type).length}</span></div>
                    {tickets.filter((ticket) => ticket.type === type).map((ticket) => (
                      <article className="ticket-card" key={ticket.id}>
                        <div><span className={`priority ${ticket.priority === "P1" ? "urgent" : ""}`}>{ticket.priority}</span><small>{ticket.age}</small></div>
                        <h3>{language === "ko" ? ticket.titleKo : ticket.titleEn}</h3>
                        <p>{ticket.project} · {ticket.id}</p>
                        <button>{language === "ko" ? "검토하기" : "Review"} →</button>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {view === "audit" && (
            <section className="view-section audit-view">
              <div className="view-heading"><div><span className="eyebrow">TRACEABLE OPERATIONS</span><h1>{t.activityLog}</h1><p>{t.logRule}</p></div><span className="boundary-chip">{t.demoBoundary}</span></div>
              <div className="panel audit-panel">
                <div className="audit-date">2026.08.11 · KST</div>
                {auditEvents.map((event, index) => (
                  <div className="audit-row" key={event.time}>
                    <span className="audit-time">{event.time}</span>
                    <span className="audit-line"><i />{index < auditEvents.length - 1 && <b />}</span>
                    <span className="audit-avatar">{event.actor.slice(0, 1)}</span>
                    <div><strong>{language === "ko" ? event.actionKo : event.actionEn}</strong><small>{event.actor} · {event.meta}</small></div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {selectedProject && (
        <div className="drawer-backdrop">
          <button className="backdrop-dismiss" onClick={() => setSelectedProject(null)} aria-label={t.cancel} />
          <aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={t.detail}>
            <button className="close-button" onClick={() => setSelectedProject(null)} aria-label={t.cancel}>×</button>
            <span className="eyebrow">{selectedProject.id}</span>
            <h2>{language === "ko" ? selectedProject.titleKo : selectedProject.titleEn}</h2>
            <p>{selectedProject.client}</p>
            <div className="drawer-summary"><div><span>{t.progress}</span><strong>{selectedProject.progress}%</strong></div><div><span>{t.amount}</span><strong>{formatMoney(selectedProject.amount, language)}</strong></div></div>
            <div className="progress-track large"><span style={{ width: `${selectedProject.progress}%` }} /></div>
            <h3>{t.milestones}</h3>
            <ol className="milestone-list">
              <li className="done"><span>✓</span><div><strong>{language === "ko" ? "요구사항 확정" : "Scope confirmed"}</strong><small>08.05</small></div></li>
              <li className="done"><span>✓</span><div><strong>{language === "ko" ? "1차 구현" : "First implementation"}</strong><small>08.09</small></div></li>
              <li className="current"><span>3</span><div><strong>{language === "ko" ? "반응형·오류 QA" : "Responsive & error QA"}</strong><small>{selectedProject.due}</small></div></li>
              <li><span>4</span><div><strong>{language === "ko" ? "검수·인계" : "Acceptance & handoff"}</strong><small>—</small></div></li>
            </ol>
            <div className="drawer-boundary"><strong>{t.demoBoundary}</strong><span>{t.localOnly}</span></div>
          </aside>
        </div>
      )}

      {quoteOpen && (
        <div className="modal-backdrop">
          <button className="backdrop-dismiss" onClick={() => setQuoteOpen(false)} aria-label={t.cancel} />
          <form className="quote-modal" onSubmit={handleQuote}>
            <div className="modal-heading"><div><span className="eyebrow">LOCAL DRAFT</span><h2>{t.quoteTitle}</h2></div><button type="button" onClick={() => setQuoteOpen(false)} aria-label={t.cancel}>×</button></div>
            <label>{t.customer}<input required value={quote.customer} onChange={(event) => setQuote({ ...quote, customer: event.target.value })} placeholder="Northstar Studio" /></label>
            <label>{t.service}<input required value={quote.service} onChange={(event) => setQuote({ ...quote, service: event.target.value })} placeholder={language === "ko" ? "반응형 웹 개선" : "Responsive web refresh"} /></label>
            <label>{t.amount}<input required inputMode="numeric" value={quote.amount} onChange={(event) => setQuote({ ...quote, amount: event.target.value.replace(/[^0-9]/g, "") })} placeholder="2400000" /></label>
            <p className="form-boundary">● {t.localOnly} · {t.demoBoundary}</p>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setQuoteOpen(false)}>{t.cancel}</button><button className="primary-button" type="submit">{t.saveDraft}</button></div>
          </form>
        </div>
      )}

      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </div>
  );
}
