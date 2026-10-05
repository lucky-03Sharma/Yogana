import React, { useState } from "react";

export default function Hero({ onGetStarted, onQuickSearch, onSelectPersona, onOpenChat }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onQuickSearch(searchInput.trim());
    } else {
      onGetStarted();
    }
  };

  const personas = [
    { label: "Small Farmer", icon: "🧑‍🌾", query: "farmer agriculture irrigation crop insurance kisan" },
    { label: "Women Entrepreneur", icon: "👩‍💼", query: "women self help group lakhpati didi business loan mudra" },
    { label: "College Student", icon: "🎓", query: "scholarship post matric tuition fee waiver skill training" },
    { label: "Artisan / Craftsman", icon: "🛠️", query: "pm vishwakarma artisan toolkit grant loan 5 percent" },
    { label: "Senior Citizen", icon: "👴", query: "old age pension monthly cash ayushman health card" },
    { label: "Street Vendor / Shop", icon: "🏙️", query: "street vendor loan svanidhi working capital" },
    { label: "Rooftop Solar", icon: "☀️", query: "surya ghar rooftop solar subsidy free electricity" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200/60 pt-12 pb-16 md:py-20">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/3 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 bg-sky-100/80 border border-sky-300/60 text-sky-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
            <span>AI-Powered Indian Welfare Recommendation Engine</span>
            <span className="text-slate-400">•</span>
            <span className="text-sky-700">45+ Flagship Schemes</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Discover Government Schemes{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600">
              Tailored Exactly for You
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Tell us your situation in plain words or fill your profile. Our NLP matching engine scans central and state schemes to verify your eligibility and guide you directly to official application portals.
          </p>

          {/* Instant NLP Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto mb-8 relative flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-sky-950/5 border border-slate-200/80"
          >
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-4 text-slate-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Try: 'scholarship for SC girls', '₹78,000 solar subsidy', or 'loan for grocery store'..."
                className="w-full pl-11 pr-4 py-3.5 bg-transparent text-slate-800 placeholder-slate-400 text-sm md:text-base outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span>Instant Match</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {/* Persona Quick Click Pills */}
          <div className="mb-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Or Choose a Citizen Persona for Instant Recommendations:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {personas.map((p) => (
                <button
                  key={p.label}
                  onClick={() => onSelectPersona ? onSelectPersona(p.query, p.label) : onQuickSearch(p.query)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/90 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 rounded-xl text-xs font-semibold shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-slate-900/10 transition-all flex items-center gap-2"
            >
              <span>📋 Smart Eligibility Calculator</span>
            </button>
            <button
              onClick={onOpenChat}
              className="px-7 py-3.5 bg-white hover:bg-slate-50 border-2 border-sky-600 text-sky-700 rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>🤖 Chat with AI SevaSaathi</span>
            </button>
          </div>

          {/* Benefit Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 max-w-4xl mx-auto text-left">
            <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
              <span className="text-xl">🏥</span>
              <div className="text-lg font-bold text-slate-900 mt-1">₹5 Lakh/Yr</div>
              <div className="text-xs text-slate-500 font-medium">Free Hospital Cover (PM-JAY)</div>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
              <span className="text-xl">🌾</span>
              <div className="text-lg font-bold text-slate-900 mt-1">₹6,000/Yr</div>
              <div className="text-xs text-slate-500 font-medium">Direct Cash to Farmers (PM-KISAN)</div>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
              <span className="text-xl">☀️</span>
              <div className="text-lg font-bold text-slate-900 mt-1">₹78,000</div>
              <div className="text-xs text-slate-500 font-medium">Rooftop Solar Subsidy</div>
            </div>
            <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
              <span className="text-xl">💼</span>
              <div className="text-lg font-bold text-slate-900 mt-1">Up to ₹20L</div>
              <div className="text-xs text-slate-500 font-medium">Collateral-Free MUDRA Loans</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
