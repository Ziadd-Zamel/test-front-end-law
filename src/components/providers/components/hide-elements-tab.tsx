// components/BlockDevTools.tsx
"use client";

import { useEffect } from "react";

export default function BlockDevTools() {
  useEffect(() => {
    // Block all DevTools shortcuts
    const blockShortcuts = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Mac shortcuts
      if (e.metaKey && e.altKey && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (e.metaKey && e.altKey && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (e.metaKey && e.altKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener("keydown", blockShortcuts, true);

    // Detect if DevTools is open
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          alert("Please close Developer Tools");
          window.location.reload();
        }
      } else {
        devtoolsOpen = false;
      }
    };

    const interval = setInterval(detectDevTools, 500);

    return () => {
      document.removeEventListener("keydown", blockShortcuts, true);
      clearInterval(interval);
    };
  }, []);

  return null;
}
