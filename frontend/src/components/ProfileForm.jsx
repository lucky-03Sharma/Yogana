import React, { useState } from "react";
import { fetchRecommendations } from "../services/api";

export default function ProfileForm({ onSubmit, loading: submitLoading, onCancel }) {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    age: 28,
    income: 150000,
    gender: "male",
    caste: "general",
    location_type: "rural",
    state: "maharashtra",
    employment_status: "farmer",
    education: "graduate",
    interests: "farming irrigation subsidy crop insurance",
    description: "",
    has_land: true,
    bpl_card: false,
    pregnant: false,
    disabled: false,
  });

  const states = [
    "andhra pradesh", "arunachal pradesh", "assam", "bihar", "chandigarh",
    "chhattisgarh", "delhi", "goa", "gujarat", "haryana", "himachal pradesh",
    "jharkhand", "karnataka", "kerala", "ladakh", "lakshadweep",
    "madhya pradesh", "maharashtra", "manipur", "meghalaya", "mizoram",
    "nagaland", "odisha", "puducherry", "punjab", "rajasthan", "sikkim",
    "tamil nadu", "telangana", "tripura", "uttarakhand", "uttar pradesh",
    "west bengal",
  ];

  const occupations = [
    { value: "farmer", label: "Farmer / Cultivator", icon: "🧑‍🌾" },
    { value: "student", label: "Student / Aspirant", icon: "🎓" },
    { value: "entrepreneur", label: "Startup / Business Owner", icon: "🚀" },
    { value: "artisan", label: "Artisan / Craftsman (Vishwakarma)", icon: "🛠️" },
    { value: "daily_wage", label: "Daily Wage / Informal Worker", icon: "🏗️" },
    { value: "street_vendor", label: "Street Vendor / Hawker", icon: "🛒" },
    { value: "salaried", label: "Salaried Private/Govt Employee", icon: "💼" },
    { value: "homemaker", label: "Homemaker", icon: "🏠" },
    { value: "retired", label: "Retired / Senior Citizen", icon: "👴" },
    { value: "unemployed", label: "Unemployed Job Seeker", icon: "🔍" },
  ];

  const interestSuggestions = [
    "🌾 Crop Insurance", "💧 Drip Irrigation", "₹78k Solar Subsidy",
    "🎓 College Scholarship", "💼 MUDRA Loan", "🏥 Free Ayushman Card",
    "🛠️ Vishwakarma Toolkit", "👵 Old Age Pension", "👩 Sukanya Samriddhi",
    "🏠 PMAY Housing Grant", "🛒 PM SVANidhi Loan", "🌱 Fertilizer Subsidy"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInterestTagClick = (tag) => {
    const cleanTag = tag.replace(/^[^\w\s]+/, "").trim().toLowerCase();
    const current = formData.interests ? formData.interests.trim() : "";
    if (!current.includes(cleanTag)) {
      setFormData((prev) => ({
        ...prev,
        interests: current ? `${current} ${cleanTag}` : cleanTag,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profile = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : undefined,
      income: formData.income !== undefined ? parseInt(formData.income, 10) : undefined,
      state: formData.state || undefined,
      employment_status: formData.employment_status || undefined,
      education: formData.education || undefined,
      interests: formData.interests || undefined,
      description: formData.description || undefined,
    };

    try {
      const result = await fetchRecommendations(profile);
      onSubmit(result, profile);
    } catch (err) {
      console.error("Failed to get recommendations:", err);
    }
  };

  const formatIncome = (amt) => {
    if (!amt || amt === 0) return "₹0 (No Income)";
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)} Lakhs / year`;
    return `₹${amt.toLocaleString()} / year`;
  };

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200/60" id="profile-form">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold mb-2">
            <span>🎯 3-Step Recommendation Wizard</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tell Us Your Profile Details
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-xl mx-auto">
            Our AI engine evaluates your demographic eligibility against 45+ Central and State welfare rules to find guaranteed matching schemes.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-6 bg-white rounded-xl p-1.5 shadow-sm">
          {[
            { step: 1, title: "1. Demographics & Income", icon: "👤" },
            { step: 2, title: "2. Occupation & State", icon: "📍" },
            { step: 3, title: "3. Special Needs & Goals", icon: "🎯" },
          ].map((tab) => (
            <button
              key={tab.step}
              type="button"
              onClick={() => setActiveTab(tab.step)}
              className={`flex-1 py-3 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.step
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.title}</span>
              <span className="sm:hidden">Step {tab.step}</span>
            </button>
          ))}
        </div>

        {/* The Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl shadow-slate-950/5 border border-slate-200/80 p-6 sm:p-8"
        >
          
          {/* STEP 1: Demographics & Income */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Age Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Age (Years): <span className="text-sky-600 text-sm">{formData.age || "—"}</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-base focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                  <div className="flex gap-2 mt-2">
                    {[18, 25, 35, 45, 60].map((quickAge) => (
                      <button
                        key={quickAge}
                        type="button"
                        onClick={() => setFormData({ ...formData, age: quickAge })}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                      >
                        {quickAge} yrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Radio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "male", label: "Male", icon: "👨" },
                      { id: "female", label: "Female", icon: "👩" },
                      { id: "other", label: "Other", icon: "🧑" },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g.id })}
                        className={`py-3 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          formData.gender === g.id
                            ? "bg-sky-50 border-sky-500 text-sky-700 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{g.icon}</span>
                        <span>{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Annual Household Income Slider */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Annual Family Income
                  </label>
                  <span className="text-sm font-extrabold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                    {formatIncome(formData.income)}
                  </span>
                </div>
                <input
                  type="range"
                  name="income"
                  min="0"
                  max="1500000"
                  step="25000"
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                  <span>₹0 (BPL / None)</span>
                  <span>₹2.5 Lakhs (Income Limit)</span>
                  <span>₹8 Lakhs (EWS)</span>
                  <span>₹15 Lakhs+</span>
                </div>
              </div>

              {/* Caste / Social Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Social Category / Caste
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "general", label: "General", desc: "Open Category" },
                    { id: "obc", label: "OBC", desc: "Other Backward Class" },
                    { id: "sc", label: "SC", desc: "Scheduled Caste" },
                    { id: "st", label: "ST", desc: "Scheduled Tribe" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, caste: c.id })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.caste === c.id
                          ? "bg-sky-50 border-sky-500 shadow-sm"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className={`text-sm font-bold uppercase ${formData.caste === c.id ? "text-sky-800" : "text-slate-800"}`}>
                        {c.label}
                      </div>
                      <div className="text-[11px] text-slate-500">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Next: Occupation & State</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Occupation & Location */}
          {activeTab === 2 && (
            <div className="space-y-6">
              
              {/* Occupation Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Occupation / Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {occupations.map((occ) => (
                    <button
                      key={occ.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, employment_status: occ.value })}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        formData.employment_status === occ.value
                          ? "bg-sky-50 border-sky-500 shadow-sm"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xl">{occ.icon}</span>
                      <div>
                        <div className={`text-xs font-bold ${formData.employment_status === occ.value ? "text-sky-900" : "text-slate-800"}`}>
                          {occ.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* State & Urban/Rural Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Resident State / UT
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none capitalize"
                  >
                    <option value="">Select State</option>
                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Area Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "rural", label: "Rural (Village / Gaon)", icon: "🌾" },
                      { id: "urban", label: "Urban (City / Town)", icon: "🏙️" },
                    ].map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, location_type: loc.id })}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          formData.location_type === loc.id
                            ? "bg-sky-50 border-sky-500 text-sky-800 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{loc.icon}</span>
                        <span>{loc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Next: Special Needs</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Special Needs, Interests & Submit */}
          {activeTab === 3 && (
            <div className="space-y-6">
              
              {/* Special Eligibility Flags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Special Eligibility Flags
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="has_land"
                      checked={formData.has_land}
                      onChange={handleChange}
                      className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">🌾 Owns Agricultural Land</div>
                      <div className="text-[11px] text-slate-500">Eligible for PM-KISAN, PMFBY, PMKSY</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="bpl_card"
                      checked={formData.bpl_card}
                      onChange={handleChange}
                      className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">📜 Holds BPL / Ration Card</div>
                      <div className="text-[11px] text-slate-500">Qualifies for PMAY-G, Ujjwala 2.0, NSAP</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="pregnant"
                      checked={formData.pregnant}
                      onChange={handleChange}
                      className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">🤰 Expecting / Pregnant Mother</div>
                      <div className="text-[11px] text-slate-500">Eligible for ₹6,000 under PMMVY</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                    <input
                      type="checkbox"
                      name="disabled"
                      checked={formData.disabled}
                      onChange={handleChange}
                      className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">♿ Person with Disability (Divyangjan)</div>
                      <div className="text-[11px] text-slate-500">UDID cards, 5% interest loans, assistive aids</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Interests & Keywords */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What specific benefits are you looking for?
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. crop loan, 78k solar subsidy, college fees scholarship, street vendor credit..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                />
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {interestSuggestions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInterestTagClick(tag)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 rounded-lg text-xs font-medium transition-all"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className="w-full sm:w-auto px-4 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-4 py-3 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Computing Matches...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Get Guaranteed Recommendations</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </form>
      </div>
    </section>
  );
}
