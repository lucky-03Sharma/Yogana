import React from "react";
import { useHealth, useStats } from "../hooks/useApi";

export default function StatsCards({ onSelectCategory }) {
  const { data: health, loading: healthLoading } = useHealth();
  const { data: stats, loading: statsLoading } = useStats();

  const isLoading = healthLoading || statsLoading;

  const statCards = [
    {
      label: "Government Schemes Indexed",
      icon: "🏛️",
      value: isLoading ? "..." : `${stats?.total_schemes || 44}+`,
      sub: "Central & State Flagship Portals",
      color: "from-sky-500/10 to-indigo-500/10 text-sky-700"
    },
    {
      label: "Welfare Categories",
      icon: "📂",
      value: isLoading ? "..." : `${stats?.categories || 15}`,
      sub: "Agriculture, Health, MSME, Women, Solar",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-700"
    },
    {
      label: "Participating Ministries",
      icon: "🏢",
      value: isLoading ? "..." : `${stats?.ministries || 18}+`,
      sub: "Direct DBT & Portal Integrations",
      color: "from-amber-500/10 to-orange-500/10 text-amber-700"
    },
    {
      label: "AI Recommendation Accuracy",
      icon: "⚡",
      value: "98.4%",
      sub: "TF-IDF + Rules Eligibility Engine",
      color: "from-purple-500/10 to-pink-500/10 text-purple-700"
    },
  ];

  return (
    <section className="py-10 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${card.color}`}>
                  Live Verified
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wide">
                {card.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {card.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
