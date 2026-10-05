import { useState, useEffect } from "react";
import {
  fetchCategories,
  fetchHealth,
  fetchStats,
  fetchDemoProfiles,
} from "../services/api";

export function useApi(urlFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await urlFn();
      setData(result);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
}

export function useHealth() {
  return useApi(fetchHealth, []);
}

export function useCategories() {
  return useApi(fetchCategories, []);
}

export function useStats() {
  return useApi(fetchStats, []);
}

export function useDemoProfiles() {
  return useApi(fetchDemoProfiles, []);
}
