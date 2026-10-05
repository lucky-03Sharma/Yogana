const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Failed to fetch health");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchMinistries() {
  const res = await fetch(`${API_BASE}/ministries`);
  if (!res.ok) throw new Error("Failed to fetch ministries");
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchSchemes(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && v !== "all") {
      params.append(k, v);
    }
  });
  const res = await fetch(`${API_BASE}/schemes?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch schemes");
  return res.json();
}

export async function fetchSchemeById(id) {
  const res = await fetch(`${API_BASE}/schemes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch scheme");
  return res.json();
}

export async function fetchRecommendations(profile, options = {}) {
  const params = new URLSearchParams();
  if (options.top_k) params.append("top_k", options.top_k);
  if (options.category) params.append("category", options.category);
  if (options.min_score) params.append("min_score", options.min_score);

  const res = await fetch(`${API_BASE}/recommend?${params.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to get recommendations");
  }
  return res.json();
}

export async function chatWithAssistant(message, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to communicate with AI Assistant");
  }
  return res.json();
}

export async function compareSchemes(schemeIds = []) {
  const res = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scheme_ids: schemeIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to compare schemes");
  }
  return res.json();
}

export async function fetchDemoProfiles() {
  const res = await fetch(`${API_BASE}/demo-profiles`);
  if (!res.ok) throw new Error("Failed to fetch demo profiles");
  return res.json();
}

export async function fetchDemoRecommendation(profileName) {
  const res = await fetch(`${API_BASE}/recommend/demo?profile=${encodeURIComponent(profileName)}`);
  if (!res.ok) throw new Error("Failed to fetch demo recommendation");
  return res.json();
}
