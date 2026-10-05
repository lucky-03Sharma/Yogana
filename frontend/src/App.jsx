import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import StatsCards from "./components/StatsCards";
import HowItWorks from "./components/HowItWorks";
import ProfileForm from "./components/ProfileForm";
import DemoProfileSelector from "./components/DemoProfileSelector";
import SchemeList from "./components/SchemeList";
import BrowseSchemes from "./components/BrowseSchemes";
import SchemeDetail from "./components/SchemeDetail";
import AiChatAssistant from "./components/AiChatAssistant";
import SchemeCompare from "./components/SchemeCompare";
import SavedSchemes from "./components/SavedSchemes";
import { fetchRecommendations } from "./services/api";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [showForm, setShowForm] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [browseCategory, setBrowseCategory] = useState("all");
  const [browseSearch, setBrowseSearch] = useState("");

  // Bookmarked / Saved Schemes from localStorage
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState(() => {
    try {
      const saved = localStorage.getItem("schemeseva_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison list (max 3 schemes)
  const [compareList, setCompareList] = useState([]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("schemeseva_bookmarks", JSON.stringify(bookmarkedSchemes));
    } catch (e) {
      console.error("Failed to save bookmarks:", e);
    }
  }, [bookmarkedSchemes]);

  const handleBookmarkToggle = (scheme) => {
    setBookmarkedSchemes((prev) => {
      const exists = prev.some((s) => s.id === scheme.id);
      if (exists) {
        return prev.filter((s) => s.id !== scheme.id);
      } else {
        return [...prev, scheme];
      }
    });
  };

  const isBookmarked = (schemeId) => {
    return bookmarkedSchemes.some((s) => s.id === schemeId);
  };

  const handleCompareToggle = (scheme) => {
    setCompareList((prev) => {
      const exists = prev.some((s) => s.id === scheme.id);
      if (exists) {
        return prev.filter((s) => s.id !== scheme.id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 schemes at a time. Please remove one first.");
          return prev;
        }
        return [...prev, scheme];
      }
    });
  };

  const isCompared = (schemeId) => {
    return compareList.some((s) => s.id === schemeId);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGetStarted = () => {
    setShowForm(true);
    setCurrentView("home");
    setTimeout(() => {
      document.getElementById("profile-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleRecommendations = (results, profile) => {
    setRecommendations(results.schemes || []);
    setUserProfile(profile);
    setCurrentView("results");
    setShowForm(false);
    setSubmitLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDemoSelect = (result, profile) => {
    setRecommendations(result.schemes || []);
    setUserProfile(profile);
    setCurrentView("results");
    setSubmitLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickSearch = async (queryText) => {
    setSubmitLoading(true);
    try {
      const result = await fetchRecommendations({
        interests: queryText,
        description: queryText,
        state: selectedState || undefined,
      });
      setRecommendations(result.schemes || []);
      setUserProfile({ interests: queryText, state: selectedState });
      setCurrentView("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Quick search error:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSelectPersona = (queryText, personaLabel) => {
    handleQuickSearch(queryText);
  };

  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <>
            <Hero
              onGetStarted={handleGetStarted}
              onQuickSearch={handleQuickSearch}
              onSelectPersona={handleSelectPersona}
              onOpenChat={() => handleViewChange("chat")}
            />
            <StatsCards onSelectCategory={(cat) => {
              setBrowseCategory(cat);
              setCurrentView("browse");
            }} />
            {showForm ? (
              <ProfileForm
                onSubmit={handleRecommendations}
                loading={submitLoading}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <DemoProfileSelector onProfileSelect={handleDemoSelect} />
            )}
            <HowItWorks />
          </>
        );

      case "chat":
        return (
          <AiChatAssistant
            onSchemeSelect={(scheme) => setSelectedScheme(scheme)}
            onBookmarkToggle={handleBookmarkToggle}
            isBookmarked={isBookmarked}
          />
        );

      case "results":
        return (
          <SchemeList
            results={recommendations}
            profile={userProfile}
            onBack={() => {
              setCurrentView("home");
              setShowForm(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSchemeSelect={(scheme) => setSelectedScheme(scheme)}
            onBookmarkToggle={handleBookmarkToggle}
            isBookmarked={isBookmarked}
            onCompareToggle={handleCompareToggle}
            isCompared={isCompared}
            onOpenChat={() => handleViewChange("chat")}
          />
        );

      case "browse":
        return (
          <BrowseSchemes
            onSchemeSelect={(scheme) => setSelectedScheme(scheme)}
            onBack={() => handleViewChange("home")}
            onBookmarkToggle={handleBookmarkToggle}
            isBookmarked={isBookmarked}
            onCompareToggle={handleCompareToggle}
            isCompared={isCompared}
            initialCategory={browseCategory}
            initialSearch={browseSearch}
          />
        );

      case "compare":
        return (
          <SchemeCompare
            compareList={compareList}
            onRemoveFromCompare={(id) => setCompareList((prev) => prev.filter((s) => s.id !== id))}
            onClearCompare={() => setCompareList([])}
            onSchemeSelect={(scheme) => setSelectedScheme(scheme)}
            onBrowseMore={() => handleViewChange("browse")}
          />
        );

      case "saved":
        return (
          <SavedSchemes
            savedSchemes={bookmarkedSchemes}
            onRemoveBookmark={(id) => setBookmarkedSchemes((prev) => prev.filter((s) => s.id !== id))}
            onClearAll={() => setBookmarkedSchemes([])}
            onSchemeSelect={(scheme) => setSelectedScheme(scheme)}
            onBrowseMore={() => handleViewChange("browse")}
          />
        );

      default:
        return (
          <>
            <Hero onGetStarted={handleGetStarted} onQuickSearch={handleQuickSearch} />
            <StatsCards />
            <HowItWorks />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        savedCount={bookmarkedSchemes.length}
        compareCount={compareList.length}
        selectedState={selectedState}
        onStateChange={(st) => setSelectedState(st)}
      />

      <main className="flex-1">
        {renderView()}
      </main>

      <Footer onViewChange={handleViewChange} />

      <SchemeDetail
        scheme={selectedScheme}
        isOpen={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        isBookmarked={selectedScheme ? isBookmarked(selectedScheme.id) : false}
        onBookmarkToggle={handleBookmarkToggle}
      />
    </div>
  );
}

export default App;
