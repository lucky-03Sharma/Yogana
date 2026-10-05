import React from "react";

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

const categoryBadgeColors = {
  agriculture: "bg-emerald-50 text-emerald-800 border-emerald-200",
  health: "bg-rose-50 text-rose-800 border-rose-200",
  housing: "bg-amber-50 text-amber-800 border-amber-200",
  employment: "bg-blue-50 text-blue-800 border-blue-200",
  finance: "bg-purple-50 text-purple-800 border-purple-200",
  social_welfare: "bg-pink-50 text-pink-800 border-pink-200",
  women: "bg-rose-50 text-rose-800 border-rose-200",
  pension: "bg-indigo-50 text-indigo-800 border-indigo-200",
  infrastructure: "bg-slate-100 text-slate-800 border-slate-200",
  digital: "bg-cyan-50 text-cyan-800 border-cyan-200",
  energy: "bg-yellow-50 text-yellow-800 border-yellow-200",
  insurance: "bg-teal-50 text-teal-800 border-teal-200",
  business: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
  education: "bg-orange-50 text-orange-800 border-orange-200",
  environment: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export default function SchemeCard({
  result,
  onClick,
  isBookmarked = false,
  onBookmarkToggle,
  isCompared = false,
  onCompareToggle
}) {
  const scheme = result.scheme || result;
  const matchPercentage = result.match_percentage || (result.match_score ? Math.min(99, Math.round(result.match_score * 25)) : null);
  const reasons = result.eligibility_reasons || [];
  const cautions = result.eligibility_cautions || [];
  const category = scheme.category || "social_welfare";
  const icon = categoryIcons[category] || "📋";
  const badgeColor = categoryBadgeColors[category] || "bg-slate-100 text-slate-800 border-slate-200";

  const getMatchBadge = () => {
    if (!matchPercentage) return null;
    if (matchPercentage >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-sm shadow-emerald-500/20">
          <span>⚡ {matchPercentage}% Match</span>
        </span>
      );
    }
    if (matchPercentage >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-600 text-white rounded-full text-xs font-bold shadow-sm shadow-sky-600/20">
          <span>👍 {matchPercentage}% Match</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold">
        <span>{matchPercentage}% Match</span>
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className="scheme-card bg-white rounded-2xl shadow-md shadow-slate-950/5 border border-slate-200/80 hover:border-sky-400 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group relative"
    >
      <div className="p-5 sm:p-6">
        
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
              {icon}
            </span>
            <div>
              <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wide border ${badgeColor}`}>
                {category.replace("_", " ")}
              </span>
              {scheme.scheme_type && (
                <span className="ml-1.5 text-[10px] text-slate-500 font-medium hidden sm:inline">
                  • {scheme.scheme_type}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {getMatchBadge()}
            
            {/* Bookmark Action Button */}
            {onBookmarkToggle && (
              <button
                type="button"
                onClick={() => onBookmarkToggle(scheme)}
                className={`p-1.5 rounded-xl border transition-all ${
                  isBookmarked
                    ? "bg-amber-100 border-amber-300 text-amber-700"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                }`}
                title={isBookmarked ? "Saved in Bookmarks" : "Save Scheme"}
              >
                <span className="text-sm">{isBookmarked ? "★" : "☆"}</span>
              </button>
            )}

            {/* Compare Action Button */}
            {onCompareToggle && (
              <button
                type="button"
                onClick={() => onCompareToggle(scheme)}
                className={`p-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isCompared
                    ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                }`}
                title={isCompared ? "Remove from Compare" : "Add to Compare"}
              >
                ⚖️
              </button>
            )}
          </div>
        </div>

        {/* Scheme Title & Ministry */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug mb-1">
          {scheme.name}
        </h3>
        {scheme.hindi_name && (
          <p className="text-xs text-slate-500 mb-2 font-medium">{scheme.hindi_name}</p>
        )}
        <p className="text-xs font-medium text-slate-400 mb-3">{scheme.ministry}</p>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {scheme.description}
        </p>

        {/* Key Benefits Highlight */}
        {scheme.benefits && scheme.benefits.length > 0 && (
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <span className="text-emerald-500">💰</span>
              <span>Key Benefit Highlight:</span>
            </div>
            <div className="text-xs text-slate-700 line-clamp-2 font-medium">
              {scheme.benefits[0]}
            </div>
          </div>
        )}

        {/* Why this matches you / Reason Tags */}
        {reasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {reasons.slice(0, 2).map((reason, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-medium"
              >
                ✓ {reason.split(":")[0]}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClick}
          className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 transition-colors"
        >
          <span>View Criteria & Documents</span>
          <span>→</span>
        </button>

        {scheme.apply_link && (
          <a
            href={scheme.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Apply Now</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

    </div>
  );
}
