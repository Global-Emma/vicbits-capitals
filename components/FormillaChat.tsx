"use client";

import { useEffect } from "react";

export const FormillaChat = () => {
  useEffect(() => {
    // Prevent injecting the script multiple times during re-renders
    if (document.getElementById("formilla-script")) return;

    (function () {
      const head = document.getElementsByTagName("head").item(0);
      const script = document.createElement("script");

      const src =
        document.location.protocol == "https:"
          ? "https://www.formilla.com/scripts/feedback.js"
          : "http://www.formilla.com/scripts/feedback.js";

      script.id = "formilla-script";
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", src);
      script.setAttribute("async", "true");

      let complete = false;

      script.onload = script.onreadystatechange = function () {
        // @ts-ignore
        if (!complete && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
          complete = true;
          // @ts-ignore
          if (typeof window.Formilla !== "undefined") {
            // @ts-ignore
            window.Formilla.guid = "cs0794ea-bc9e-43e2-b98f-eca4cd4456f6";
            // @ts-ignore
            window.Formilla.loadWidgets();
          }
        }
      };

      if (head) {
        head.appendChild(script);
      }
    })();
  }, []);

  return null; // This component handles the script injection invisibly
};
