import { useEffect } from "react";
import { LawsUI } from "./js/laws.js";

/** Single init per laws subroute visit — avoids duplicate laws.js auto-init on import. */
export function useLawsPage(pageKey: string) {
  useEffect(() => {
    document.body.dataset.page = pageKey;
    try {
      LawsUI.init();
    } catch {
      /* legacy script optional */
    }
    return () => {
      delete document.body.dataset.page;
    };
  }, [pageKey]);
}
