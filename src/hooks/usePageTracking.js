// src/hooks/usePageTracking.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-G3454K2H21", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}
