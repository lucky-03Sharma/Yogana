import React, { useState } from "react";
import { fetchDemoRecommendation } from "../services/api";
import { useDemoProfiles } from "../hooks/useApi";

export default function DemoProfileSelector({ onProfileSelect }) {
  const { data, loading, error } = useDemoProfiles();
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleSelect = async (profile) => {
    setSelectedProfile(profile.name);
    try {
      const result = await fetchDemoRecommendation(profile.name);
      onProfileSelect(result, profile);
    } catch (err) {
      console.error("Demo recommendation error:", err);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
          <div className="text-slate-400 text-sm">Loading Citizen Demo Personas...</div>
        </div>
      </section>
    );
  }

  if (error || !data?.profiles) {
    return null;
  }

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold mb-2">
            <span>⚡ Instant 1-Click Personas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Try a Pre-Configured Citizen Profile
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            Test how the NLP matching model instantly tailors benefits for different Indian demographic groups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.profiles.map((profile) => {
            const isSelected = selectedProfile === profile.name;
            return (
              <div
                key={profile.name}
                onClick={() => handleSelect(profile)}
                className={`bg-white rounded-2xl shadow-sm border-2 cursor-pointer transition-all p-5 flex flex-col justify-between hover:shadow-lg ${
                  isSelected
                    ? "border-sky-500 ring-2 ring-sky-500/20 shadow-md"
                    : "border-slate-200/80 hover:border-sky-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-50 border border-slate-100 rounded-xl">
                        {profile.avatar || "👤"}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {profile.name}
                        </h3>
                        <span className="text-xs font-semibold text-sky-600 capitalize">
                          {profile.employment_status?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {profile.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                      Age: {profile.age} yrs
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium capitalize">
                      {profile.state}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium uppercase">
                      {profile.caste}
                    </span>
                    {profile.has_land && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-xs font-medium">
                        🌾 Landowner
                      </span>
                    )}
                    {profile.bpl_card && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-xs font-medium">
                        📜 BPL Card
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1">
                    {isSelected ? "Loading..." : "Test Matches →"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {profile.location_type?.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
