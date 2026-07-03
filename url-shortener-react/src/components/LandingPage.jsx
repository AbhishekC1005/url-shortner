import { useNavigate } from "react-router-dom";
import React from "react";
import { LuArrowRight, LuZap, LuShield, LuActivity, LuLink2 } from "react-icons/lu";
import Card from "./Card";
import { useStoreContext } from "../contextApi/ContextApi";

const FEATURES = [
  {
    icon: <LuLink2 />,
    color: "#4285f4",
    bg: "#e8f0fe",
    title: "Custom Branded Aliases",
    desc: "Replace generic links with short, professional custom domains that represent your brand. Boost click-through rates by up to 34%.",
  },
  {
    icon: <LuActivity />,
    color: "#34a853",
    bg: "#e6f4ea",
    title: "Real-Time Analytics",
    desc: "Track click events, referral sources, and geolocation metrics the moment they happen with our powerful analytics engine.",
  },
  {
    icon: <LuShield />,
    color: "#ea4335",
    bg: "#fce8e6",
    title: "Enterprise Security",
    desc: "TLS encryption, spam detection filters, and security protocols keep your traffic safe against malicious redirects.",
  },
  {
    icon: <LuZap />,
    color: "#fbbc05",
    bg: "#fef9e7",
    title: "Sub-Millisecond Redirects",
    desc: "A globally distributed routing network guarantees high-availability infrastructure and near-instant load speeds.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();

  const goToDashboard = () => navigate(token ? "/dashboard" : "/login");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 flex flex-col items-center text-center">
        
        {/* Product badge */}
        <div className="g-chip g-animate-up mb-6" style={{ animationDelay: "0s" }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "linear-gradient(135deg,#4285f4,#34a853)",
            display: "inline-block", flexShrink: 0
          }} />
          Trusted link intelligence platform
        </div>

        {/* Hero headline */}
        <h1
          className="g-hero-title g-animate-up g-delay-1"
          style={{ fontFamily: "var(--g-font-display)", maxWidth: "780px" }}
        >
          Shorten links.{" "}
          <span style={{ color: "#fbbc05" }}>Track </span>
          <span style={{ color: "#ea4335" }}>every </span>
          <span style={{ color: "#1a73e8" }}>click.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="g-body g-animate-up g-delay-2 mt-6 max-w-xl"
          style={{ fontFamily: "var(--g-font)", fontSize: "1.125rem" }}
        >
          Create branded short links and monitor engagement with real-time analytics — all from one clean, fast dashboard.
        </p>

        {/* CTA Strip */}
        <div className="w-full max-w-lg g-animate-up g-delay-3 mt-10 flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="Paste a long URL here…"
            onClick={goToDashboard}
            readOnly
            className="flex-grow g-input cursor-pointer hover:border-[#9aa0a6]"
            style={{ fontFamily: "var(--g-font)" }}
          />
          <button
            onClick={goToDashboard}
            className="g-btn-primary flex-shrink-0"
            style={{ fontFamily: "var(--g-font)", borderRadius: "8px", height: "48px", padding: "0 24px", fontSize: "0.9375rem" }}
          >
            Shorten
            <LuArrowRight className="text-base" />
          </button>
        </div>

        {/* Secondary CTA */}
        <div className="g-animate-up g-delay-4 mt-5 flex items-center gap-6">
          <button
            onClick={goToDashboard}
            className="g-btn-outlined"
            style={{ fontFamily: "var(--g-font)", borderRadius: "8px", height: "44px" }}
          >
            Get started free
          </button>
          <span style={{ fontSize: "0.8125rem", color: "var(--g-text-tertiary)", fontFamily: "var(--g-font)" }}>
            No credit card required
          </span>
        </div>

        {/* Google 4-color accent bar */}
        <div className="g-color-bar g-animate-up g-delay-5 mt-14 w-16 mx-auto" />
      </section>

      {/* ── Features Section ─────────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t"
        style={{ borderColor: "var(--g-border)" }}
      >
        <div className="text-center mb-14 g-animate-up">
          <h2 className="g-section-title" style={{ fontFamily: "var(--g-font-display)" }}>
            Everything you need to grow
          </h2>
          <p className="g-body mt-3 max-w-lg mx-auto" style={{ fontFamily: "var(--g-font)" }}>
            A complete link management platform built for individuals and teams.
          </p>
        </div>

        <div className="grid xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`g-card g-animate-up g-delay-${i + 1} p-6 flex flex-col gap-4`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="g-card-title mb-1.5" style={{ fontFamily: "var(--g-font)" }}>{f.title}</h3>
                <p style={{ fontFamily: "var(--g-font)", fontSize: "0.875rem", color: "var(--g-text-secondary)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA Banner ─────────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t"
        style={{ borderColor: "var(--g-border)" }}
      >
        <div
          className="rounded-2xl px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: "var(--g-surface-alt)", border: "1px solid var(--g-border)" }}
        >
          <div>
            <h2
              className="g-section-title"
              style={{ fontFamily: "var(--g-font-display)", fontSize: "1.5rem" }}
            >
              Ready to get started?
            </h2>
            <p
              className="g-body mt-1"
              style={{ fontFamily: "var(--g-font)", fontSize: "0.9375rem" }}
            >
              Join thousands of users who trust Linklytics.
            </p>
          </div>
          <button
            onClick={goToDashboard}
            className="g-btn-primary flex-shrink-0"
            style={{ fontFamily: "var(--g-font)", height: "48px", padding: "0 28px", borderRadius: "8px", fontSize: "0.9375rem" }}
          >
            Start for free
            <LuArrowRight className="text-base" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;