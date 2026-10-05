import React, { useState } from "react";
import SchemeCard from "./SchemeCard";

export default function SchemeList({
  results = [],
  profile,
  onBack,
  onSchemeSelect,
  onBookmarkToggle,
  isBookmarked,
  onCompareToggle,
  isCompared,
  onOpenChat
}) {
  const [sortKey, setSortKey] = useState("match_percentage");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...new Set(results.map((r) => r.scheme?.category || r.category).filter(Boolean))];

  const filtered = results.filter((item) => {
    const s = item.scheme || item;
    if (categoryFilter === "all") return true;
    return s.category === categoryFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "match_percentage") {
      const aScore = a.match_percentage || (a.match_score * 25) || 0;
      const bScore = b.match_percentage || (b.match_score * 25) || 0;
      return bScore - aScore;
    }
    if (sortKey === "eligibility_score") {
      return (b.eligibility_score || 0) - (a.eligibility_score || 0);
    }
    if (sortKey === "text_similarity") {
      return (b.text_similarity || 0) - (a.text_similarity || 0);
    }
    return 0;
  });

  return (
    <section className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back and Summary Banner */}
        <div className="bg-gradient-to-r from-sky-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-950/10 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 hover:text-white mb-2 transition-colors"
              >
                ← Refine Profile Criteria
              </button>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Recommended Government Schemes
              </h2>
              <p className="text-xs sm:text-sm text-sky-200 mt-1">
                Based on your demographic profile, our NLP model identified <span className="font-bold text-white">{results.length} eligible schemes</span> with direct financial subsidies and grants.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all"
              >
                ✏️ Edit Profile
              </button>
              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 rounded-xl text-xs font-extrabold shadow-md transition-all"
                >
                  🤖 Ask AI Assistant
                </button>
              )}
            </div>
          </div>

          {/* Profile Attribute Pills */}
          {profile && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10 text-xs">
              <span className="text-sky-300 font-semibold">Evaluated Profile:</span>
              {profile.age && (
                <span className="px-2.5 py-0.5 bg-white/10 rounded-full font-medium">
                  Age: {profile.age} yrs
                </span>
              )}
              {profile.employment_status && (
                <span className="px-2.5 py-0.5 bg-white/10 rounded-full font-medium capitalize">
                  Occupation: {profile.employment_status.replace("_", " ")}
                </span>
              )}
              {profile.state && (
                <span className="px-2.5 py-0.5 bg-white/10 rounded-full font-medium capitalize">
                  State: {profile.state}
                </span>
              )}
              {profile.caste && (
                <span className="px-2.5 py-0.5 bg-white/10 rounded-full font-medium uppercase">
                  Category: {profile.caste}
                </span>
              )}
              {profile.has_land && (
                <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-full font-medium">
                  🌾 Landowner
                </span>
              )}
              {profile.bpl_card && (
                <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full font-medium">
                  📜 BPL Card
                </span>
              )}
            </div>
          )}
        </div>

        {/* Toolbar: Category Filters & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Sort by:
            </span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="match_percentage">Highest Match Score (%)</option>
              <option value="eligibility_score">Eligibility Rules Fit</option>
              <option value="text_similarity">Text Relevance</option>
            </select>
          </div>

        </div>

        {/* Schemes Results Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No matching schemes in this category
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              Switch back to All Categories or adjust your profile search parameters.
            </p>
            <button
              onClick={() => setCategoryFilter("all")}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 shadow-md"
            >
              Show All Matches
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((result) => (
              <SchemeCard
                key={result.scheme?.id || result.id}
                result={result}
                onClick={() => onSchemeSelect(result.scheme || result)}
                isBookmarked={isBookmarked ? isBookmarked(result.scheme?.id || result.id) : false}
                onBookmarkToggle={onBookmarkToggle}
                isCompared={isCompared ? isCompared(result.scheme?.id || result.id) : false}
                onCompareToggle={onCompareToggle}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
