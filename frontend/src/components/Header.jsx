import React, { useState, useEffect } from "react";

export default function Header({
  currentView,
  onViewChange,
  savedCount = 0,
  compareCount = 0,
  selectedState,
  onStateChange
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (id) => {
    onViewChange(id);
    setMobileOpen(false);
  };

  const links = [
    { id: "home",   label: "Home" },
    { id: "chat",   label: "AI Assistant", accent: true },
    { id: "browse", label: "Schemes" },
  ];

  return (
    <header
      className="no-print sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(255,255,255,0.82)"
          : "rgba(255,255,255,0.96)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: scrolled
          ? "1px solid rgba(148,163,184,0.18)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 1px 12px rgba(15,23,42,0.06)"
          : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex h-[60px] items-center justify-between">

          {/* ── Logo ── */}
          <button
            onClick={() => nav("home")}
            className="flex items-center gap-2.5 group select-none"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold transition-transform duration-300 group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0369a1 0%, #4f46e5 100%)",
              }}
            >
              S
            </div>
            <span className="text-[1.1rem] font-semibold tracking-tight text-slate-900">
              Scheme<span className="text-sky-600">Seva</span>
            </span>
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = currentView === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => nav(l.id)}
                  className="relative px-4 py-2 text-[0.82rem] font-medium transition-colors duration-200"
                  style={{
                    color: active ? "#0369a1" : "#475569",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "#0369a1";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = "#475569";
                  }}
                >
                  {l.label}
                  {l.accent && (
                    <span
                      className="ml-1.5 px-[5px] py-[1px] text-[9px] font-bold uppercase rounded tracking-wider"
                      style={{
                        background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                        color: "#fff",
                        letterSpacing: "0.05em",
                      }}
                    >
                      AI
                    </span>
                  )}
                  {/* Active underline indicator */}
                  <span
                    className="absolute bottom-0 left-1/2 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      width: active ? "60%" : "0%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(90deg, #0ea5e9, #6366f1)",
                    }}
                  />
                </button>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1">
            {/* Compare button */}
            <button
              onClick={() => nav("compare")}
              title="Compare Schemes"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
              style={{
                color: currentView === "compare" ? "#0369a1" : "#64748b",
                background: currentView === "compare" ? "#f0f9ff" : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f9ff";
                e.currentTarget.style.color = "#0369a1";
              }}
              onMouseLeave={(e) => {
                if (currentView !== "compare") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h8m-8 6h8m-8 6h8m5-12v12m0 0l-3-3m3 3l3-3"/>
              </svg>
              {compareCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold rounded-full px-1"
                  style={{ background: "#6366f1", color: "#fff" }}
                >
                  {compareCount}
                </span>
              )}
            </button>

            {/* Saved button */}
            <button
              onClick={() => nav("saved")}
              title="Saved Schemes"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
              style={{
                color: currentView === "saved" ? "#0369a1" : "#64748b",
                background: currentView === "saved" ? "#f0f9ff" : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f9ff";
                e.currentTarget.style.color = "#0369a1";
              }}
              onMouseLeave={(e) => {
                if (currentView !== "saved") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }
              }}
            >
              <svg width="18" height="18" fill={savedCount > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              {savedCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold rounded-full px-1"
                  style={{ background: "#f59e0b", color: "#1e293b" }}
                >
                  {savedCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 mx-2" style={{ background: "#e2e8f0" }} />

            {/* CTA — visible on desktop */}
            <button
              onClick={() => nav("home")}
              className="hidden md:flex items-center gap-1.5 px-4 py-[7px] rounded-lg text-[0.8rem] font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-sky-600/20"
              style={{
                background: "linear-gradient(135deg, #0369a1 0%, #4f46e5 100%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #075985 0%, #4338ca 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #0369a1 0%, #4f46e5 100%)";
              }}
            >
              Find Schemes
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors ml-1"
            >
              {mobileOpen ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: "rgba(148,163,184,0.15)",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="max-w-6xl mx-auto px-5 py-3 space-y-0.5">
            {links.map((l) => {
              const active = currentView === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => nav(l.id)}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  style={{
                    color: active ? "#0369a1" : "#334155",
                    background: active ? "#f0f9ff" : "transparent",
                  }}
                >
                  {l.label}
                  {l.accent && (
                    <span
                      className="px-1.5 py-0.5 text-[9px] font-bold rounded"
                      style={{ background: "#6366f1", color: "#fff" }}
                    >
                      AI
                    </span>
                  )}
                </button>
              );
            })}
            <div className="h-px my-2" style={{ background: "#e2e8f0" }} />
            <button
              onClick={() => nav("compare")}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors"
              style={{
                color: currentView === "compare" ? "#0369a1" : "#334155",
                background: currentView === "compare" ? "#f0f9ff" : "transparent",
              }}
            >
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full" style={{ background: "#6366f1", color: "#fff" }}>
                  {compareCount}
                </span>
              )}
            </button>
            <button
              onClick={() => nav("saved")}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors"
              style={{
                color: currentView === "saved" ? "#0369a1" : "#334155",
                background: currentView === "saved" ? "#f0f9ff" : "transparent",
              }}
            >
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full" style={{ background: "#f59e0b", color: "#1e293b" }}>
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
