import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  KanbanSquare,
  BarChart3,
  RefreshCw,
  Briefcase,
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  Shield,
} from "lucide-react";

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = "Task Flow - Master Your Workflow";

    const description =
      "The all-in-one Kanban and task management workspace for professionals. Beautifully designed, lightning-fast.";

    let metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = description;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <Navbar scrolled={scrolled} />

      <main>
        <Hero />
        <Features />
        <Pricing />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar({ scrolled }: { scrolled: boolean }) {
    return (
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 opacity-0 blur-md transition group-hover:opacity-60" />
            </span>
  
            <span className="text-lg font-semibold tracking-tight">
              Task
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Flow
              </span>
            </span>
          </Link>
  
          <ul className="hidden items-center gap-1 text-sm text-slate-300 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
  
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Log In
            </Link>
  
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>
      </header>
    );
  }

/* ---------------- Hero ---------------- */
function Hero() {
    const previewColumns = [
      {
        title: "To Do",
        color: "from-slate-500/30 to-slate-500/0",
        items: [
          { title: "Design onboarding", code: "TASK-124" },
          { title: "Write release notes", code: "TASK-238" },
          { title: "Audit color tokens", code: "TASK-319" },
        ],
      },
      {
        title: "In Progress",
        color: "from-indigo-500/30 to-indigo-500/0",
        items: [
          { title: "Build Kanban DnD", code: "TASK-451" },
          { title: "Refactor API client", code: "TASK-572" },
        ],
      },
      {
        title: "Completed",
        color: "from-emerald-500/30 to-emerald-500/0",
        items: [
          { title: "Setup auth", code: "TASK-683" },
          { title: "Migrate DB", code: "TASK-744" },
          { title: "Ship landing", code: "TASK-895" },
        ],
      },
    ];
  
    return (
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            New - AI auto-breakdown is live
          </div>
  
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Master Your Workflow{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              with Task Flow.
            </span>
          </h1>
  
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            The all-in-one Kanban and task management workspace for professionals
            who want to get things done. Beautifully designed, lightning-fast.
          </p>
  
          <div className="mt-8 flex items-center justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition hover:shadow-indigo-500/60"
            >
              Start Your Pro Workspace
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
  
          <p className="mt-4 text-xs text-slate-500">
            Free 14-day trial - No credit card required
          </p>
        </div>
  
        <div className="relative mx-auto mt-16 max-w-6xl">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-fuchsia-500/30 blur-2xl" />
  
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900/60 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
  
              <div className="ml-4 hidden flex-1 sm:block">
                <div className="mx-auto w-72 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-center text-xs text-slate-400">
                  app.taskflow.io/dashboard
                </div>
              </div>
            </div>
  
            <div className="grid gap-4 p-5 sm:grid-cols-12">
              <aside className="hidden flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:col-span-3 sm:flex lg:col-span-2">
                {["Inbox", "Today", "Upcoming", "Kanban", "Analytics"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2 text-xs ${
                        index === 3
                          ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-white"
                          : "text-slate-400"
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </aside>
  
              <div className="grid gap-3 sm:col-span-9 sm:grid-cols-3 lg:col-span-10">
                {previewColumns.map((column) => (
                  <div
                    key={column.title}
                    className="rounded-xl border border-white/10 bg-slate-950/40 p-3"
                  >
                    <div
                      className={`mb-3 rounded-md bg-gradient-to-r ${column.color} px-2 py-1 text-xs font-medium text-slate-200`}
                    >
                      {column.title}
                    </div>
  
                    <div className="flex flex-col gap-2">
                      {column.items.map((item) => (
                        <div
                          key={item.code}
                          className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs text-slate-200"
                        >
                          <div className="font-medium">{item.title}</div>
  
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="rounded bg-white/5 px-1.5 py-0.5">
                              {item.code}
                            </span>
                            <span className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-widest text-slate-500">
          <span>Trusted by teams at</span>
          {["Northwind", "Acme", "Pied Piper", "Globex", "Initech"].map(
            (name) => (
              <span key={name} className="text-slate-400">
                {name}
              </span>
            )
          )}
        </div>
      </section>
    );
  }

/* ---------------- Features ---------------- */
const FEATURES = [
    {
      icon: KanbanSquare,
      title: "Visual Kanban Boards",
      desc: "Drag, drop, and organize. Customizable columns and swimlanes that fit your team's flow.",
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      desc: "Velocity, burndown, heatmaps. Understand exactly where your time goes - and where it should.",
    },
    {
      icon: RefreshCw,
      title: "Real-time Sync",
      desc: "Every change appears instantly across devices. Built on a blazing-fast realtime engine.",
    },
    {
      icon: Briefcase,
      title: "Pro Workspaces",
      desc: "Isolated workspaces with roles, permissions, and SSO for serious teams.",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      desc: "Tap play, get back to work. Per-task timers, automatic timesheets, zero friction.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "SOC 2, encryption at rest, audit logs. Your data is protected end-to-end.",
    },
  ];
  
  function Features() {
    return (
      <section
        id="features"
        className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Zap className="h-3 w-3 text-indigo-400" />
            Features
          </div>
  
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need.{" "}
            <span className="text-slate-400">Nothing you don't.</span>
          </h2>
  
          <p className="mt-4 text-slate-400">
            Task Flow combines the speed of a hotkey-driven app with the polish
            of a design tool.
          </p>
        </div>
  
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
  
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                  <Icon className="h-5 w-5 text-white" />
                </div>
  
                <h3 className="text-base font-semibold text-white">
                  {feature.title}
                </h3>
  
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.desc}
                </p>
  
                <div className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </section>
    );
  }

/* ---------------- Pricing ---------------- */
const TIERS = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      blurb: "Perfect for individuals getting organized.",
      cta: "Get Started",
      features: [
        "Up to 3 boards",
        "Basic analytics",
        "Mobile + desktop sync",
        "Community support",
      ],
      popular: false,
    },
    {
      name: "Pro Workspace",
      price: "$12",
      period: "/user / mo",
      blurb: "For professionals and growing teams.",
      cta: "Start Pro Trial",
      features: [
        "Unlimited boards & tasks",
        "Deep analytics & reporting",
        "Time tracking + timesheets",
        "AI auto-breakdown",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      blurb: "Advanced security & scale for orgs.",
      cta: "Contact Sales",
      features: [
        "SSO / SAML",
        "Audit logs & SOC 2",
        "Dedicated CSM",
        "Custom SLAs",
        "On-prem option",
      ],
      popular: false,
    },
  ];
  
  function Pricing() {
    return (
      <section
        id="pricing"
        className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, honest pricing.
          </h2>
  
          <p className="mt-4 text-slate-400">
            Start free. Upgrade when your workflow demands it.
          </p>
        </div>
  
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.name} className="relative">
              {tier.popular && (
                <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-90 blur-[2px]" />
              )}
  
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 backdrop-blur-xl ${
                  tier.popular
                    ? "border-white/15 bg-slate-900/80 shadow-2xl shadow-indigo-500/20"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/40">
                    Most Popular
                  </div>
                )}
  
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
  
                <p className="mt-1 text-sm text-slate-400">{tier.blurb}</p>
  
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-sm text-slate-400">{tier.period}</span>
                </div>
  
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-slate-300"
                    >
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
  
                <Link
                  to="/register"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    tier.popular
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/60"
                      : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

/* ---------------- Final CTA ---------------- */
function FinalCTA() {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-10 text-center shadow-2xl shadow-indigo-900/40 sm:p-16">
          <div
            className="absolute inset-0 -z-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px, 60px 60px",
            }}
          />
  
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to flow through your tasks?
          </h2>
  
          <p className="relative mx-auto mt-4 max-w-xl text-white/80">
            Join thousands of professionals shipping more, with less friction.
          </p>
  
          <div className="relative mt-8 flex justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-xl transition hover:bg-slate-100"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

/* ---------------- Footer ---------------- */
function Footer() {
    return (
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
  
            <span className="text-sm font-semibold">
              Task
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Flow
              </span>
            </span>
  
            <span className="ml-3 text-xs text-slate-500">
              © {new Date().getFullYear()} Task Flow, Inc.
            </span>
          </div>
  
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Security
            </a>
          </div>
  
          <div className="flex items-center gap-3 text-slate-400">
            <a
              href="#"
              aria-label="X"
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-xs font-semibold">X</span>
            </a>
  
            <a
              href="#"
              aria-label="GitHub"
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-xs font-semibold">GH</span>
            </a>
  
            <a
              href="#"
              aria-label="LinkedIn"
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-xs font-semibold">IN</span>
            </a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default LandingPage;