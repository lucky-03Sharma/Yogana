import React from "react";

export default function SavedSchemes({
  savedSchemes = [],
  onRemoveBookmark,
  onClearAll,
  onSchemeSelect,
  onBrowseMore
}) {
  const handlePrint = () => {
    window.print();
  };

  if (!savedSchemes || savedSchemes.length === 0) {
    return (
      <section className="py-16 bg-slate-50 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🔖
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No Bookmarked Schemes Yet
          </h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Click the bookmark icon (🔖) on any scheme card while exploring to save it here for later review, comparison, or to print an official document checklist.
          </p>
          <button
            onClick={onBrowseMore}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
          >
            Explore Schemes Catalog
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Print Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 no-print">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold mb-1.5">
              <span>🔖 Citizen Saved Dossier</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Bookmarked Schemes ({savedSchemes.length})
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Your saved welfare programs and printable document readiness checklist.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <span>🖨️ Print Application Checklist</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-3.5 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-all"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Printable Slip Container */}
        <div className="print-container">
          <div className="hidden print-only mb-6 pb-4 border-b-2 border-slate-900">
            <h1 className="text-2xl font-bold text-slate-900">SchemeSeva India - Citizen Scheme Checklist</h1>
            <p className="text-sm text-slate-600">Official Beneficiary Document & Application Reference Slip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-lg text-xs font-bold uppercase">
                      {scheme.category}
                    </span>
                    <button
                      onClick={() => onRemoveBookmark(scheme.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 text-xs no-print"
                      title="Remove Bookmark"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                    {scheme.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">{scheme.ministry}</p>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Key Benefits:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {(scheme.benefits || []).slice(0, 2).map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents Checklist */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Required Documents:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(scheme.documents_required || []).slice(0, 4).map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <input type="checkbox" className="rounded text-sky-600" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 no-print">
                  <button
                    onClick={() => onSchemeSelect(scheme)}
                    className="text-xs font-bold text-slate-700 hover:text-sky-600"
                  >
                    View Details
                  </button>

                  {scheme.apply_link && (
                    <a
                      href={scheme.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <span>Apply on Portal</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
