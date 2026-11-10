import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollManager() {
  const { hash, pathname } = useLocation();

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const targetId = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(targetId);
      if (!target) return;

      target.scrollIntoView();
      if (target.matches("a[href], button, input, select, textarea, [tabindex]")) {
        target.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname]);

  return null;
}
