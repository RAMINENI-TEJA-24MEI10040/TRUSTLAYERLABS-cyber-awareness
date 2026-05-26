import { useEffect } from "react";

type BodyAttributes = Record<string, string | undefined>;

const qrScriptUrls = import.meta.glob("./js/*.js", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

export function useQrPage(scripts: string[], title: string, bodyAttributes: BodyAttributes = {}) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousBodyClassName = document.body.className;
    const previousAttributes = Object.fromEntries(
      Object.keys(bodyAttributes).map((key) => [key, document.body.getAttribute(key)])
    ) as Record<string, string | null>;

    document.title = title;
    document.body.classList.add("qr-body");
    Object.entries(bodyAttributes).forEach(([key, value]) => {
      if (value === undefined) {
        document.body.removeAttribute(key);
      } else {
        document.body.setAttribute(key, value);
      }
    });

    const addedScripts: HTMLScriptElement[] = scripts.map((scriptPath) => {
      const script = document.createElement("script");
      script.src = qrScriptUrls[scriptPath] ?? new URL(scriptPath, import.meta.url).href;
      script.async = false;
      script.type = "text/javascript";
      document.body.appendChild(script);
      return script;
    });

    return () => {
      document.title = previousTitle;
      document.body.className = previousBodyClassName;
      Object.entries(previousAttributes).forEach(([key, value]) => {
        if (value === null) {
          document.body.removeAttribute(key);
        } else {
          document.body.setAttribute(key, value);
        }
      });
      addedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [scripts.join(","), title, JSON.stringify(bodyAttributes)]);
}
