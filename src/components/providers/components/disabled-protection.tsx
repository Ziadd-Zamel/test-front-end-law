// components/DisabledProtection.tsx
"use client";

import { useEffect } from "react";

export default function DisabledProtection() {
  useEffect(() => {
    const protectedStates = new WeakMap<Element, boolean>();

    // Capture initial state
    const captureState = () => {
      document.querySelectorAll("button, input").forEach((el) => {
        const element = el as HTMLButtonElement;
        protectedStates.set(element, element.disabled);
      });
    };

    captureState();

    let isReactUpdating = false;

    // Intercept React updates
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if (name === "disabled") {
        isReactUpdating = true;
        protectedStates.set(this, value !== null);
      }
      return originalSetAttribute.call(this, name, value);
    };

    const originalRemoveAttribute = Element.prototype.removeAttribute;
    Element.prototype.removeAttribute = function (name) {
      if (name === "disabled") {
        isReactUpdating = true;
        protectedStates.set(this, false);
      }
      return originalRemoveAttribute.call(this, name);
    };

    // Watch for manual changes via DevTools
    const observer = new MutationObserver((mutations) => {
      if (isReactUpdating) {
        isReactUpdating = false;
        return;
      }

      // This is a manual change from DevTools
      mutations.forEach((mutation) => {
        const target = mutation.target as HTMLButtonElement;
        const shouldBeDisabled = protectedStates.get(target);

        if (
          shouldBeDisabled !== undefined &&
          target.disabled !== shouldBeDisabled
        ) {
          target.disabled = shouldBeDisabled;
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["disabled"],
      childList: true,
    });

    // Periodic check
    const interval = setInterval(() => {
      document.querySelectorAll("button, input").forEach((el) => {
        const element = el as HTMLButtonElement;
        const shouldBeDisabled = protectedStates.get(element);

        if (
          shouldBeDisabled !== undefined &&
          element.disabled !== shouldBeDisabled
        ) {
          element.disabled = shouldBeDisabled;
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      Element.prototype.setAttribute = originalSetAttribute;
      Element.prototype.removeAttribute = originalRemoveAttribute;
    };
  }, []);

  return null;
}
