import { useEffect, useRef } from "react";
import template from "./hangingIDCard.html?raw";
import styles from "./hangingIDCard.css?inline";

export default function HangingIDCard({ student }) {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;

    if (!host.shadowRoot) {
      const shadow = host.attachShadow({ mode: "open" });

      shadow.innerHTML = `
        <style>${styles}</style>
        ${template}
      `;

      applyData(shadow, student);
    } else {
      applyData(host.shadowRoot, student);
    }
  }, [student]);

  function applyData(root, data) {
    root.querySelectorAll("[data-bind]").forEach(el => {
      const key = el.dataset.bind;
      const value = data[key];

      if (!value) return;

      // IMAGE HANDLING
      if (el.tagName === "IMG") {
        el.src = value;
        return;
      }

      // SVG TEXT / TEXT / HTML
      el.textContent = value;
    });
  }

  return <div ref={ref}></div>;
}