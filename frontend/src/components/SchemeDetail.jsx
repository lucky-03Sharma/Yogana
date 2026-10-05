import React, { useState } from "react";

const categoryIcons = {
  agriculture: "🌾",
  health: "🏥",
  housing: "🏠",
  employment: "💼",
  finance: "💰",
  social_welfare: "🤝",
  women: "👩",
  pension: "👴",
  infrastructure: "🛣️",
  digital: "💻",
  energy: "☀️",
  insurance: "🛡️",
  business: "🚀",
  education: "🎓",
  environment: "🌱",
};

export default function SchemeDetail({
  scheme,
  isOpen,
  onClose,
  isBookmarked = false,
  onBookmarkToggle
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [checkedDocs, setCheckedDocs] = useState({});

  if (!isOpen || !scheme) return null;

  const elig = scheme.eligibility || {};
  const icon = categoryIcons[scheme.category] || "📋";
  const docs = scheme.documents_required || [];
  const steps = scheme.application_process || [];

  const handleDocToggle = (doc) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;

  const eligRows = [
    {
      label: "Age Requirement",
      value:
        elig.age_min !== undefined && elig.age_max !== undefined
          ? `${elig.age_min} to ${elig.age_max} Years`
          : "Open to All Ages",
      icon: "🎂",
    },
    {
      label: "Annual Income Limit",
      value: elig.income_limit
        ? `Up to ₹${elig.income_limit.toLocaleString()} / year`
        : "No Income Ceiling",
      icon: "💵",
    },
    {
      label: "Agricultural Land Holding",
      value: elig.land_holding_required ? "Mandatory (Landowners)" : "Not Required",
      icon: "🌾",
    },
    {
      label: "Applicable Gender",
      value:
        elig.gender_applicable?.includes("all")
          ? "All Genders (Male, Female, Other)"
          : elig.gender_applicable?.map((g) => g.toUpperCase()).join(", ") || "All Genders",
      icon: "🚻",
    },
    {
      label: "Social Category / Caste",
      value:
        elig.caste_applicable?.includes("all")
          ? "All Categories (General, OBC, SC, ST)"
          : elig.caste_applicable?.map((c) => c.toUpperCase()).join(", ") || "All Categories",
      icon: "📜",
    },
    {
      label: "Target Geography",
      value:
        scheme.state === "central"
          ? "Nationwide (All Indian States & UTs)"
          : `${scheme.state?.toUpperCase()} State Specific`,
      icon: "📍",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-6 overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-700 via-indigo-800 to-slate-900 px-6 py-5 text-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-sky-400/20 text-sky-200 border border-sky-300/30 rounded-full">
                  {scheme.category?.replace("_", " ")}
                </span>
                <span className="text-xs text-sky-200 font-medium">
                  • {scheme.scheme_type || "Central Sector"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug">
                {scheme.name}
              </h2>
              {scheme.hindi_name && (
                <p className="text-xs text-sky-200/90 mt-0.5">{scheme.hindi_name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(scheme)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-sm"
                title="Save Scheme"
              >
                {isBookmarked ? "★" : "☆"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-all text-sm"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 overflow-x-auto text-xs sm:text-sm font-semibold text-slate-600">
          {[
            { id: "overview", label: "Overview & Benefits", icon: "✨" },
            { id: "eligibility", label: "Eligibility Rules", icon: "📋" },
            { id: "documents", label: `Documents (${checkedCount}/${docs.length})`, icon: "📄" },
            { id: "process", label: "How to Apply", icon: "🚀" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-4 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-sky-600 text-sky-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW & BENEFITS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About the Scheme
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Comprehensive Benefits
                </h3>
                <div className="space-y-2.5">
                  {(scheme.benefits || []).map((benefit, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl flex items-start gap-3 text-sm text-slate-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Beneficiaries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(scheme.target_audience || []).map((aud) => (
                    <span
                      key={aud}
                      className="px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-xs font-semibold"
                    >
                      {aud.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY RULES */}
          {activeTab === "eligibility" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {eligRows.map((row) => (
                  <div
                    key={row.label}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{row.icon}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        {row.label}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 ml-6">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Conditions */}
              {(elig.bpl_required || elig.pregnant_required || elig.disabled_required) && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1.5">
                    ⚠️ Priority Conditions
                  </div>
                  <ul className="text-xs text-amber-800 space-y-1">
                    {elig.bpl_required && <li>• Below Poverty Line (BPL) / Ration card mandatory.</li>}
                    {elig.pregnant_required && <li>• Applicant must be pregnant or lactating mother.</li>}
                    {elig.disabled_required && <li>• Reserved for Divyangjan (minimum 40% certified disability).</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS CHECKLIST */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-sky-50 border border-sky-200 p-4 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-sky-900 uppercase">Document Readiness Tracker</div>
                  <div className="text-xs text-sky-700 mt-0.5">
                    Tick the documents you have ready to see if you can apply right away.
                  </div>
                </div>
                <div className="text-lg font-extrabold text-sky-800 bg-white px-3 py-1 rounded-xl shadow-sm">
                  {checkedCount} / {docs.length}
                </div>
              </div>

              <div className="space-y-2">
                {docs.map((doc, i) => {
                  const isChecked = !!checkedDocs[doc];
                  return (
                    <label
                      key={i}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleDocToggle(doc)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm">{doc}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: APPLICATION PROCESS */}
          {activeTab === "process" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Step-by-Step Official Application Flow
              </h3>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3.5 text-sm text-slate-800"
                  >
                    <div className="w-7 h-7 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="leading-relaxed font-medium mt-0.5">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>📞 Helpline:</span>
            <span className="font-bold text-sky-700 font-mono">
              {scheme.helpline_number || "1800-11-0001"}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100"
            >
              Close
            </button>

            {scheme.apply_link && (
              <a
                href={scheme.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Apply on Official Portal</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
