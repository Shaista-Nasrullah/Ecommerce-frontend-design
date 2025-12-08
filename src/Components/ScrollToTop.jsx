// src/components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "document.documentElement.scrollTo" is the modern compatible way to scroll to top
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Optional: for smooth scrolling
    });
  }, [pathname]); // Re-run this effect whenever the pathname changes

  return null; // This component doesn't render anything itself
}

export default ScrollToTop;
