import React, { useState, useEffect } from "react";
import { fetchSchemes, fetchCategories, fetchMinistries } from "../services/api";
import SchemeCard from "./SchemeCard";

export default function BrowseSchemes({
  onSchemeSelect,
  onBack,
  onBookmarkToggle,
  isBookmarked,
  onCompareToggle,
  isCompared,
  initialCategory,
  initialSearch
}) {
  const [allSchemes, setAllSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [selectedMinistry, setSelectedMinistry] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [categories, setCategories] = useState([]);
  const [ministries, setMinistries] = useState([]);

  const states = [
    "all", "central", "delhi", "madhya pradesh", "maharashtra",
    "rajasthan", "telangana", "west bengal", "uttar pradesh"
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [schemesRes, catsRes, minsRes] = await Promise.all([
          fetchSchemes({
            category: selectedCategory,
            ministry: selectedMinistry,
            state: selectedState,
            gender: selectedGender,
            q: searchQuery,
          }),
          fetchCategories(),
          fetchMinistries(),
        ]);
        setAllSchemes(schemesRes.schemes || []);
        setCategories(catsRes.categories || []);
        setMinistries(minsRes.ministries || []);
      } catch (err) {
        console.error("Failed to load schemes:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCategory, selectedMinistry, selectedState, selectedGender, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedMinistry("all");
    setSelectedState("all");
    setSelectedGender("all");
    setSearchQuery("");
  };

  return (
    <section id="browse" className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Heading */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="mb-2 inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-bold text-xs"
            >
              ← Back to Home
            </button>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore All Government Schemes
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Comprehensive registry of verified Central & State social welfare programs, subsidies, and loans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by scheme name, benefits, tags, or ministry..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all font-medium"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 capitalize cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Ministry Dropdown */}
            <div className="w-full lg:w-56">
              <select
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="all">All Ministries</option>
                {ministries.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* State Dropdown */}
            <div className="w-full lg:w-40">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500 capitalize cursor-pointer"
              >
                <option value="all">All States</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st === "central" ? "Central (Nationwide)" : st}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs sm:text-sm font-bold text-slate-700">
            Showing <span className="text-sky-700">{allSchemes.length}</span> verified schemes
          </div>
        </div>

        {/* Content Listing */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <div className="text-slate-500 text-sm font-semibold">Filtering Government Schemes...</div>
          </div>
        ) : allSchemes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No schemes match your filter criteria</h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">
              Try adjusting your category, state, or search keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-sky-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                result={scheme}
                onClick={() => onSchemeSelect(scheme)}
                isBookmarked={isBookmarked ? isBookmarked(scheme.id) : false}
                onBookmarkToggle={onBookmarkToggle}
                isCompared={isCompared ? isCompared(scheme.id) : false}
                onCompareToggle={onCompareToggle}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
