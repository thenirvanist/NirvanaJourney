import { useState, useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Preview Mode Hook
 * 
 * Checks if the app is in "preview mode" by looking for ?preview=true in the URL.
 * When preview mode is ON: All sections are visible (for development/editing)
 * When preview mode is OFF: Hidden sections are not rendered (public view)
 * 
 * Usage:
 * - Add ?preview=true to the URL to see all sections
 * - Remove the parameter to see the public view
 * 
 * Example: https://thenirvanist.com/?preview=true
 */
export function usePreviewMode(): boolean {
  const [location] = useLocation();
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsPreview(false);
      return;
    }
    
    const params = new URLSearchParams(window.location.search);
    setIsPreview(params.get("preview") === "true");
  }, [location]);

  return isPreview;
}

export default usePreviewMode;
