import React from "react";

export default function SchemeCompare({
  compareList = [],
  onRemoveFromCompare,
  onClearCompare,
  onSchemeSelect,
  onBrowseMore
}) {
  if (!compareList || compareList.length === 0) {
    return (
      <section className="py-16 bg-slate-50 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            ⚖️
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No Schemes Selected for Comparison
          </h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            You can select up to 3 schemes from the catalog or recommendation list to compare their benefits, eligibility criteria, and required documents side by side.
          </p>
          <button
            onClick={onBrowseMore}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            Browse All Schemes
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mb-1.5">
              <span>⚖️ Side-by-Side Scheme Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compare Selected Schemes ({compareList.length}/3)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBrowseMore}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              + Add Another Scheme
            </button>
            <button
              onClick={onClearCompare}
              className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-950/5 border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 sm:p-6 w-1/4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Feature / Parameter
                </th>
                {compareList.map((scheme) => (
                  <th key={scheme.id} className="p-4 sm:p-6 w-1/4 align-top">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg uppercase">
                        {scheme.category}
                      </span>
                      <button
                        onClick={() => onRemoveFromCompare(scheme.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {scheme.name}
                    </h3>
                    {scheme.hindi_name && (
                      <p className="text-xs text-slate-500 mt-0.5">{scheme.hindi_name}</p>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
              
              {/* Ministry */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Nodal Ministry
                </td>
                {compareList.map((s) => (
                  <td key={s.id} className="p-4 sm:p-6">
                    {s.ministry}
                  </td>
                ))}
              </tr>

              {/* Scheme Type */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Scheme Type
                </td>
                {compareList.map((s) => (
                  <td key={s.id} className="p-4 sm:p-6 font-semibold text-slate-800">
                    {s.scheme_type || "Central Sector"} ({s.state === "central" ? "Nationwide" : s.state.toUpperCase()})
                  </td>
                ))}
              </tr>

              {/* Core Benefits */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Key Financial Benefits
                </td>
                {compareList.map((s) => (
                  <td key={s.id} className="p-4 sm:p-6 align-top">
                    <ul className="space-y-1.5">
                      {s.benefits.slice(0, 4).map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs">
                          <span className="text-emerald-500 flex-shrink-0">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Age Limits */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Eligible Age Range
                </td>
                {compareList.map((s) => {
                  const elig = s.eligibility || {};
                  return (
                    <td key={s.id} className="p-4 sm:p-6 font-medium">
                      {elig.age_min !== undefined && elig.age_max !== undefined
                        ? `${elig.age_min} to ${elig.age_max} Years`
                        : "No Age Restrictions"}
                    </td>
                  );
                })}
              </tr>

              {/* Income Limits */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Annual Income Limit
                </td>
                {compareList.map((s) => {
                  const elig = s.eligibility || {};
                  return (
                    <td key={s.id} className="p-4 sm:p-6 font-medium">
                      {elig.income_limit
                        ? `Under ₹${elig.income_limit.toLocaleString()} / year`
                        : "No Income Ceiling"}
                    </td>
                  );
                })}
              </tr>

              {/* Target Audience */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Target Beneficiaries
                </td>
                {compareList.map((s) => (
                  <td key={s.id} className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-1">
                      {s.target_audience.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                          {tag.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Required Documents */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Key Documents Needed
                </td>
                {compareList.map((s) => (
                  <td key={s.id} className="p-4 sm:p-6 align-top">
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(s.documents_required || []).slice(0, 4).map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span>📄</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Helpline */}
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-900 bg-slate-50/50">
                  Toll-Free Helpline
                </td>
                {compareList.map((s) => (
                  <td key={s.id} className="p-4 sm:p-6 font-mono text-xs font-bold text-sky-700">
                    {s.helpline_number || "1800-11-0001"}
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr className="bg-slate-50/80">
                <td className="p-4 sm:p-6 font-bold text-slate-900">
                  Actions
                </td>
                {compareList.map((s) => (
                  <td key={s.id} className="p-4 sm:p-6">
                    <div className="space-y-2">
                      {s.apply_link && (
                        <a
                          href={s.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                        >
                          <span>Apply on Portal</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      <button
                        onClick={() => onSchemeSelect(s)}
                        className="w-full py-2 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold transition-all"
                      >
                        View Full Details
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
