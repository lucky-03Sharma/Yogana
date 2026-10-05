import React from "react";

export default function Footer({ onViewChange }) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <span className="text-xl">🇮🇳</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Scheme<span className="text-sky-400">Seva</span>
                </h3>
                <p className="text-xs text-slate-400">AI-Powered Citizen Scheme Discovery</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-4">
              Empowering 1.4 billion Indian citizens with intelligent, eligibility-backed recommendations for central and state government welfare schemes, direct financial grants, and subsidies.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Direct access to official Government of India portals
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onViewChange && onViewChange("home")}
                  className="hover:text-white transition-colors"
                >
                  Scheme Matcher
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange && onViewChange("chat")}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>AI SevaSaathi Chat</span>
                  <span className="px-1.5 py-0.5 text-[10px] bg-sky-500 text-white rounded font-medium">AI</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange && onViewChange("browse")}
                  className="hover:text-white transition-colors"
                >
                  Browse 40+ Schemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange && onViewChange("compare")}
                  className="hover:text-white transition-colors"
                >
                  Compare Schemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onViewChange && onViewChange("saved")}
                  className="hover:text-white transition-colors"
                >
                  Saved Schemes & Checklist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Sectors */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Citizen Sectors
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <span>🌾</span> <span>Farmers & Krishi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>👩</span> <span>Women & Child Welfare</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>🎓</span> <span>Students & Education</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>💼</span> <span>MSME & Startups</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>👴</span> <span>Senior Citizens & Pensions</span>
              </li>
            </ul>
          </div>

          {/* Col 4: National Helplines */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              National Helplines
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-slate-500 text-xs block">PM-KISAN:</span>
                <span className="text-sky-300 font-mono font-medium">155261 / 1800-180-1551</span>
              </li>
              <li>
                <span className="text-slate-500 text-xs block">Ayushman Bharat (PM-JAY):</span>
                <span className="text-sky-300 font-mono font-medium">14555 / 1800-111-565</span>
              </li>
              <li>
                <span className="text-slate-500 text-xs block">Women Helpline:</span>
                <span className="text-sky-300 font-mono font-medium">181 / 1091</span>
              </li>
              <li>
                <span className="text-slate-500 text-xs block">National Portal Support:</span>
                <span className="text-sky-300 font-mono font-medium">1800-11-0001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Disclaimer: SchemeSeva is an AI-powered advisory platform for informational purposes. All scheme applications and final sanctionings occur on respective official Ministry portals.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span>Powered by Scikit-Learn NLP + React</span>
            <span>•</span>
            <span>&copy; 2026 SchemeSeva India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
