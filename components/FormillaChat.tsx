"use client";

import { useEffect } from "react";

// Declare global Formilla type to avoid TypeScript errors
declare global {
  interface Window {
    Formilla?: {
      guid: string;
      loadWidgets: () => void;
    };
  }
}

export const FormillaChat = () => {
  useEffect(() => {
    // Prevent injecting the script multiple times during re-renders
    if (document.getElementById("formilla-script")) return;

    const head = document.getElementsByTagName("head").item(0);
    if (!head) return;

    const script = document.createElement("script");
    const src =
      document.location.protocol === "https:"
        ? "https://www.formilla.com/scripts/feedback.js"
        : "http://www.formilla.com/scripts/feedback.js";

    script.id = "formilla-script";
    script.type = "text/javascript";
    script.src = src;
    script.async = true;

    // Standard `onload` is fully supported across all modern browsers
    script.onload = () => {
      if (typeof window.Formilla !== "undefined") {
        window.Formilla.guid = "cs0794ea-bc9e-43e2-b98f-eca4cd4456f6";
        window.Formilla.loadWidgets();
      }
    };

    head.appendChild(script);
  }, []);

  return null; // This component handles the script injection invisibly
};
