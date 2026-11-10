import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronRight,
  CircleAlert,
  Clock3,
  Fingerprint,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import api from "./api";
import "./index.css";

const initialUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("jobshield_user") || "null");
  } catch {
    return null;
  }
})();

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getLevelColor(level) {
  if (level === "High") return "text-rose-300 bg-rose-400/10 border-rose-400/20";
  if (level === "Medium") return "text-amber-300 bg-amber-400/10 border-amber-400/20";
  return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
}

function Button({ children, onClick, disabled, variant = "primary", type = "button" }) {
  const style = variant === "primary"
    ? "bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-950/40"
    : "border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${style}`}
    >
      {children}
    </button>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
      />
    </label>
  );
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".auth-item", {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, root);

    return () => ctx.revert();
  }, [mode]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, { name, email, password });
      onLogin(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main ref={root} className="grid-bg flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="auth-item mb-8 flex items-center justify-center gap-3">
          <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">JobShield<span className="text-violet-400">.</span></h1>
            <p className="text-xs text-slate-500">CAREER SECURITY INTELLIGENCE</p>
          </div>
        </div>

        <section className="auth-item glass rounded-3xl p-7 sm:p-9">
          <div className="mb-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-200">
              <Sparkles size={13} /> Protect your next move
            </div>
            <h2 className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {mode === "login"
                ? "Sign in to inspect suspicious job opportunities."
                : "Build a safer job search with your personal dashboard."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {mode === "register" && (
              <Field
                label="Full name"
                placeholder="Your name"
                value={name}
                onChange={event => setName(event.target.value)}
                autoComplete="name"
                required
                maxLength={80}
              />
            )}

            <Field
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <Field
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              maxLength={128}
              required
            />

            {error && (
              <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" size={17} /> : null}
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              {!loading && <ArrowRight size={17} />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === "login" ? "New to JobShield?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-semibold text-violet-300 hover:text-violet-200"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </section>

        <p className="auth-item mt-5 text-center text-xs text-slate-600">
          JobShield provides screening indicators, not a guarantee of legitimacy.
        </p>
      </div>
    </main>
  );
}

function Sidebar({ page, setPage, user, onLogout, mobileOpen, setMobileOpen }) {
  const items = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "scanner", label: "Job scanner", icon: Search },
    { id: "history", label: "Scan history", icon: Clock3 }
  ];

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.07] bg-[#0c0e1b] p-5 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/15 p-2.5 text-violet-300">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight">JobShield<span className="text-violet-400">.</span></h1>
              <p className="text-[10px] tracking-[0.18em] text-slate-500">SECURITY CENTER</p>
            </div>
          </div>
          <button aria-label="Close menu" className="text-slate-400 lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-600">WORKSPACE</p>

        <nav className="space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const active = page === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "border border-violet-400/15 bg-violet-500/10 text-violet-200" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"}`}
              >
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={15} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-5">
          <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
            <div className="mb-3 flex items-center gap-2 text-violet-300">
              <Fingerprint size={20} />
              <span className="text-sm font-semibold">Stay protected</span>
            </div>
            <p className="text-xs leading-5 text-slate-400">
              Verify employers independently before sharing sensitive information or paying fees.
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-white/[0.07] pt-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 font-bold text-violet-200">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <button aria-label="Sign out" onClick={onLogout} className="text-slate-500 transition hover:text-rose-300">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function StatCard({ title, value, note, icon: Icon, color, trend }) {
  return (
    <article className="stat-card glass rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/25">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <ArrowUpRight size={14} /> Activity
          </span>
        )}
      </div>
      <p className="mt-6 text-sm text-slate-400">{title}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        {note && <span className="text-xs text-slate-500">{note}</span>}
      </div>
    </article>
  );
}

function RiskBadge({ level }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getLevelColor(level)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level} risk
    </span>
  );
}

function Dashboard({ user, setPage, scans, refreshScans }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dashboard-item", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.075,
        ease: "power2.out"
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const stats = {
    total: scans.length,
    high: scans.filter(scan => scan.level === "High").length,
    medium: scans.filter(scan => scan.level === "Medium").length,
    low: scans.filter(scan => scan.level === "Low").length
  };

  const highPercent = stats.total ? Math.round(stats.high / stats.total * 100) : 0;

  async function loadDetail(id) {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/scans/${id}`);
      setSelected(response.data.scan);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load this report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={root} className="space-y-8">
      <section className="dashboard-item relative overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-[#191632] via-[#13152a] to-[#101321] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
              <Activity size={13} /> SECURITY WORKSPACE
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {user.name.split(" ")[0]}.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Review suspicious job offers, understand warning signs, and make more informed career decisions.
            </p>
          </div>
          <Button onClick={() => setPage("scanner")}>
            <Search size={17} /> Analyze a job <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total scans" value={stats.total} note="All time" icon={Search} color="bg-violet-400/10 text-violet-300" trend />
        <StatCard title="High risk" value={stats.high} note={`${highPercent}% of scans`} icon={ShieldAlert} color="bg-rose-400/10 text-rose-300" />
        <StatCard title="Medium risk" value={stats.medium} icon={CircleAlert} color="bg-amber-400/10 text-amber-300" />
        <StatCard title="Low risk" value={stats.low} icon={BadgeCheck} color="bg-emerald-400/10 text-emerald-300" />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <article className="dashboard-item glass rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Risk distribution</h3>
              <p className="mt-1 text-xs text-slate-500">Your saved scan results</p>
            </div>
            <ChartNoAxesCombined size={20} className="text-violet-300" />
          </div>

          {stats.total === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-2xl bg-white/[0.04] p-4 text-slate-400"><ChartNoAxesCombined size={25} /></div>
              <p className="text-sm font-medium">Your analytics start here</p>
              <p className="mt-2 text-xs text-slate-500">Complete your first scan to see the distribution.</p>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {[
                { label: "High risk", count: stats.high, color: "bg-rose-400" },
                { label: "Medium risk", count: stats.medium, color: "bg-amber-400" },
                { label: "Low risk", count: stats.low, color: "bg-emerald-400" }
              ].map(item => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-400">{item.count} · {Math.round(item.count / stats.total * 100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.count / stats.total * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs leading-5 text-slate-500">
            <Shield size={16} className="shrink-0 text-violet-300" />
            Categories represent heuristic scores, not independently confirmed scams.
          </div>
        </article>

        <article className="dashboard-item glass rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Recent activity</h3>
              <p className="mt-1 text-xs text-slate-500">Your latest analyses</p>
            </div>
            <button onClick={() => setPage("history")} className="text-xs font-semibold text-violet-300 hover:text-violet-200">View all</button>
          </div>

          {scans.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <Clock3 size={25} className="mb-3 text-slate-500" />
              <p className="text-sm font-medium">No recent activity</p>
              <p className="mt-2 text-xs text-slate-500">Your completed scans will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scans.slice(0, 5).map(scan => (
                <button
                  key={scan._id}
                  onClick={() => loadDetail(scan._id)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/[0.04]"
                >
                  <div className="rounded-lg bg-white/[0.05] p-2 text-slate-400"><BriefcaseBusiness size={17} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{scan.jobTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(scan.createdAt)}</p>
                  </div>
                  <span className="text-sm font-semibold">{scan.score}</span>
                </button>
              ))}
            </div>
          )}
        </article>
      </section>

      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}

      {selected && (
        <ReportModal scan={selected} loading={loading} onClose={() => setSelected(null)} />
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <LoaderCircle size={16} className="animate-spin" /> Loading report...
        </div>
      )}

      <div className="dashboard-item flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <ArrowDownRight size={19} className="mt-0.5 text-violet-300" />
        <div>
          <p className="text-sm font-semibold">A safer way to search</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">No automated score can guarantee that an offer is legitimate. Verify the employer and vacancy through independent, official sources.</p>
        </div>
      </div>
    </div>
  );
}

function ReportModal({ scan, onClose }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".report-panel", {
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-labelledby="report-title" className="report-panel my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111426] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-violet-300">SCAN REPORT</p>
            <h2 id="report-title" className="mt-2 text-2xl font-bold">{scan.jobTitle}</h2>
            <p className="mt-2 text-xs text-slate-500">{formatDate(scan.createdAt)}</p>
          </div>
          <button aria-label="Close report" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X size={20} /></button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-violet-400/40">
            <span className="text-3xl font-bold">{scan.score}</span>
            <span className="text-[10px] text-slate-500">OUT OF 100</span>
          </div>
          <div>
            <RiskBadge level={scan.level} />
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">This score reflects the indicators matched by the current rule engine.</p>
          </div>
        </div>

        <h3 className="mb-3 mt-7 font-semibold">Detected indicators ({scan.findings.length})</h3>

        {scan.findings.length === 0 ? (
          <p className="rounded-xl bg-white/[0.03] p-4 text-sm text-slate-400">No configured warning patterns matched. This does not establish that the job is safe.</p>
        ) : (
          <div className="space-y-3">
            {scan.findings.map((finding, index) => (
              <div key={`${finding.title}-${index}`} className="rounded-xl border border-white/[0.07] p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{finding.title}</p>
                  <span className="text-xs text-rose-300">+{finding.points}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{finding.description}</p>
              </div>
            ))}
          </div>
        )}

        <h3 className="mb-3 mt-7 font-semibold">Recommended actions</h3>
        <ul className="space-y-3">
          {scan.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
              <ShieldCheck size={17} className="mt-1 shrink-0 text-emerald-300" />
              {recommendation}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close report</Button>
        </div>
      </section>
    </div>
  );
}

function Scanner({ onScanned }) {
  const [jobTitle, setJobTitle] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scan, setScan] = useState(null);
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".scanner-item", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out"
      });
    }, root);

    return () => ctx.revert();
  }, []);

  async function analyze(event) {
    event.preventDefault();
    setError("");
    setScan(null);
    setLoading(true);

    try {
      const response = await api.post("/scans", { jobTitle, input });
      setScan(response.data.scan);
      onScanned();
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Check the server connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={root} className="mx-auto max-w-4xl space-y-7">
      <div className="scanner-item">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-200">
          <Sparkles size={14} /> RISK ANALYSIS ENGINE
        </div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Inspect a job offer.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Submit a job description or a URL. JobShield will match the text against configured warning indicators and return a saved report.</p>
      </div>

      <form onSubmit={analyze} className="scanner-item glass space-y-6 rounded-3xl p-5 sm:p-8">
        <Field
          label="Job title (optional)"
          placeholder="e.g. Remote frontend developer"
          value={jobTitle}
          onChange={event => setJobTitle(event.target.value)}
          maxLength={120}
        />

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Job description or URL</span>
          <textarea
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder="Paste the job description, recruiter message, or URL here..."
            required
            minLength={3}
            maxLength={15000}
            rows={9}
            className="w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
          />
          <span className="block text-right text-xs text-slate-600">{input.length.toLocaleString()} / 15,000</span>
        </label>

        <div className="flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs leading-5 text-slate-500">
            <ShieldCheck size={17} className="shrink-0 text-violet-300" />
            Input is analyzed as text; the website is not fetched or verified.
          </div>
          <Button type="submit" disabled={loading || input.trim().length < 3}>
            {loading ? <LoaderCircle size={17} className="animate-spin" /> : <Search size={17} />}
            {loading ? "Analyzing..." : "Analyze warning signs"}
          </Button>
        </div>

        {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">{error}</p>}
      </form>

      {scan && (
        <section className="scanner-item glass rounded-3xl p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-violet-300">ANALYSIS COMPLETE</p>
              <h3 className="mt-2 text-xl font-bold">{scan.jobTitle}</h3>
            </div>
            <RiskBadge level={scan.level} />
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-[6px] border-violet-400/30 bg-violet-400/[0.04]">
              <span className="text-4xl font-extrabold">{scan.score}</span>
              <span className="mt-1 text-xs text-slate-500">RISK SCORE</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{scan.findings.length} warning indicators detected</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">Review each indicator and recommendation below. A low score does not guarantee legitimacy.</p>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            {scan.findings.length ? scan.findings.map((finding, index) => (
              <div key={`${finding.title}-${index}`} className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <CircleAlert size={19} className="mt-0.5 shrink-0 text-amber-300" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{finding.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{finding.description}</p>
                </div>
                <span className="text-xs text-rose-300">+{finding.points}</span>
              </div>
            )) : (
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4 text-sm leading-6 text-slate-300">
                No configured warning patterns matched. Further verification is still necessary.
              </div>
            )}
          </div>

          <h4 className="mb-3 mt-7 font-semibold">Recommended next steps</h4>
          <ul className="space-y-3">
            {scan.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                <ShieldCheck size={17} className="mt-1 shrink-0 text-emerald-300" />
                {recommendation}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function History({ scans, refreshScans }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState("");

  const filtered = scans.filter(scan => {
    const matchesText = scan.jobTitle.toLowerCase().includes(query.toLowerCase());
    const matchesLevel = level === "All" || scan.level === level;
    return matchesText && matchesLevel;
  });

  async function openReport(id) {
    setError("");
    setLoadingId(id);

    try {
      const response = await api.get(`/scans/${id}`);
      setSelected(response.data.scan);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load the report.");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Scan history</h2>
        <p className="mt-2 text-sm text-slate-400">Review your previous analyses and open individual reports.</p>
      </div>

      <section className="glass overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search job titles..."
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400/60"
            />
          </div>
          <select
            value={level}
            onChange={event => setLevel(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#15172a] px-3 py-3 text-sm text-slate-200 outline-none"
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <Button onClick={refreshScans} variant="secondary">
            <Activity size={16} /> Refresh
          </Button>
        </div>

        {error && <p role="alert" className="p-4 text-sm text-rose-300">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-white/[0.07] text-xs text-slate-500">
                <th className="px-5 py-4 font-medium">JOB</th>
                <th className="px-5 py-4 font-medium">DATE</th>
                <th className="px-5 py-4 font-medium">SCORE</th>
                <th className="px-5 py-4 font-medium">RISK</th>
                <th className="px-5 py-4 font-medium">REPORT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(scan => (
                <tr key={scan._id} className="border-b border-white/[0.04] transition hover:bg-white/[0.025]">
                  <td className="px-5 py-4 text-sm font-medium">{scan.jobTitle}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{formatDate(scan.createdAt)}</td>
                  <td className="px-5 py-4 text-sm font-semibold">{scan.score}/100</td>
                  <td className="px-5 py-4"><RiskBadge level={scan.level} /></td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => openReport(scan._id)}
                      disabled={loadingId === scan._id}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-violet-200 disabled:opacity-50"
                    >
                      {loadingId === scan._id ? "Loading..." : "Open report"}
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Search size={25} className="mx-auto mb-3 text-slate-500" />
            <p className="text-sm font-medium">No matching scans</p>
            <p className="mt-2 text-xs text-slate-500">Run an analysis or adjust your filters.</p>
          </div>
        )}
      </section>

      {selected && <ReportModal scan={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Workspace({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshScans = useCallback(async () => {
    setError("");

    try {
      const response = await api.get("/scans");
      setScans(response.data.scans);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your scans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshScans();
  }, [refreshScans]);

  const pageNames = {
    overview: "Overview",
    scanner: "Job scanner",
    history: "Scan history"
  };

  return (
    <div className="min-h-screen bg-[#090b16] text-slate-100">
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.06] bg-[#090b16]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-semibold">{pageNames[page]}</p>
              <p className="mt-1 text-[11px] text-slate-500">JobShield / Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-300">API connected</span>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-9">
          {error && (
            <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">
              {error}
              <button onClick={refreshScans} className="underline">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-slate-400">
              <LoaderCircle className="animate-spin" size={20} /> Loading your workspace...
            </div>
          ) : (
            <>
              {page === "overview" && <Dashboard user={user} setPage={setPage} scans={scans} refreshScans={refreshScans} />}
              {page === "scanner" && <Scanner onScanned={refreshScans} />}
              {page === "history" && <History scans={scans} refreshScans={refreshScans} />}
            </>
          )}

          <footer className="mt-12 border-t border-white/[0.06] py-5 text-xs leading-5 text-slate-600">
            JobShield AI · University project · Risk indicators are informational and require independent verification.
          </footer>
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState(initialUser);
  const [checking, setChecking] = useState(Boolean(initialUser));
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!localStorage.getItem("jobshield_token")) {
        setUser(null);
        setChecking(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        if (active) {
          setUser(response.data.user);
          localStorage.setItem("jobshield_user", JSON.stringify(response.data.user));
        }
      } catch {
        localStorage.removeItem("jobshield_token");
        localStorage.removeItem("jobshield_user");

        if (active) setUser(null);
      } finally {
        if (active) setChecking(false);
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  function handleLogin(data) {
    localStorage.setItem("jobshield_token", data.token);
    localStorage.setItem("jobshield_user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/");
  }

  function handleLogout() {
    localStorage.removeItem("jobshield_token");
    localStorage.removeItem("jobshield_user");
    setUser(null);
    navigate("/");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b16] text-violet-300">
        <LoaderCircle className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Workspace user={user} onLogout={handleLogout} /> : <AuthPage onLogin={handleLogin} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}