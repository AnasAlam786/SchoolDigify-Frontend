import htmlTemplate from "./hangingIDCard.html?raw";
import cssText from "./hangingIDCard.css?raw";

class IDCard extends HTMLElement {
  static htmlTemplate = htmlTemplate;
  static cssSheet = null;
  static loadingPromise = null;
  static imageCache = new Map();

  static observedAttributes = [
    "school-name",
    "school-udise",
    "school-logo",
    "session-year",
    "student-image",
    "student-name",
    "student-father",
    "student-class-roll",
    "student-dob",
    "student-phone",
    "student-address",
    "teacher-sign",
    "principal-sign",
    "school-address",
    "school-phone",
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }


  async loadSchoolLogo(url, img) {
    if (IDCard.imageCache.has(url)) {
      const cached = IDCard.imageCache.get(url);

      if (cached instanceof Promise) {
        img.src = await cached;
      } else {
        img.src = cached;
      }

      return;
    }

    const loading = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Image request failed: ${response.status}`);
        }

        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);

        IDCard.imageCache.set(url, blobUrl);

        return blobUrl;
      });

    // Store Promise immediately.
    // Other cards will wait for this same request.
    IDCard.imageCache.set(url, loading);

    try {
      img.src = await loading;
    } catch (error) {
      IDCard.imageCache.delete(url);
      console.error("School logo loading failed:", error);
    }
  }

  connectedCallback() {
    try {
      if (!IDCard.cssSheet) {

        IDCard.cssSheet = new CSSStyleSheet();
        IDCard.cssSheet.replaceSync(cssText);
      }

      this.shadowRoot.innerHTML = IDCard.htmlTemplate;
      this.shadowRoot.adoptedStyleSheets = [IDCard.cssSheet];

      this.updateContent();
    } catch (error) {
      console.error("Error loading ID card:", error);

      this.shadowRoot.innerHTML = `
        <div style="
          padding: 20px;
          color: red;
          border: 1px solid red;
          border-radius: 8px;
        ">
          <h3>Error Loading ID Card</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // The DOM may not be ready yet.
    if (!this.shadowRoot) return;

    this.updateContent();
  }

  updateContent() {
    const set = (attr, id) => {
      const el = this.shadowRoot.getElementById(id);
      if (!el) return;

      const value = this.getAttribute(attr) || "Unknown";

      if (el.tagName.toLowerCase() === "img") {
        if (attr === "school-logo") {
          this.loadSchoolLogo(value, el);
        } else {
          el.src = value;
        }
      } else {
        el.textContent = value;
      }
    };

    set("school-name", "school-name");
    set("school-udise", "school-UDISE");
    set("school-logo", "school-logo");
    set("session-year", "session-year");

    set("student-image", "student-image");
    set("student-name", "student-name");
    set("student-father", "student-father");

    set("student-class-roll", "student-class-roll");
    set("student-dob", "student-DOB");
    set("student-phone", "student-phone");
    set("student-address", "student-address");

    set("teacher-sign", "teacher-sign");
    set("principal-sign", "principal-sign");
    set("school-address", "school-address");
    set("school-phone", "school-phone");
  }
}

customElements.define("hanging-image-icard", IDCard);