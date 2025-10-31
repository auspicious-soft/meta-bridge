// useDetectCountry.ts
import { useEffect, useState } from "react";
import axios from "axios";

const useDetectCountry = () => {
  const [countryCode, setCountryCode] = useState<string>(() => {
    // Check cache first
    const cached = localStorage.getItem("user_country");
    if (cached) return cached;
    
    // Fallback to browser language (instant)
    const browserLang = navigator.language; // e.g., "it-IT", "en-US"
    const country = browserLang.split("-")[1] || "US";
    return country;
  });

  useEffect(() => {
    // Verify with IP in background (optional, doesn't block rendering)
    const fetchCountry = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        const country = response.data.country_code;
        
        // Only update if different
        if (country !== countryCode) {
          setCountryCode(country);
        }
        
        // Cache for next visit
        localStorage.setItem("user_country", country);
      } catch (error) {
        console.error("Error fetching location:", error);
        // Keep the browser language fallback
      }
    };

    fetchCountry();
  }, []); // Empty dependency array - only run once

  return countryCode;
};

export default useDetectCountry;