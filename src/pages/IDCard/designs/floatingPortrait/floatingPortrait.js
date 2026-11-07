import htmlTemplate from "./floatingPortrait.html?raw";
import { createStudentQRCode } from "../studentQRCode";

class FloatingPortraitIDCard extends HTMLElement {
    static observedAttributes = [
        "school-name",
        "school-udise",
        "school-logo",
        "session-year",
        "qr-value",
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

    connectedCallback() {
        this.shadowRoot.innerHTML = htmlTemplate;
        this.updateContent();
        this.updateQRCode();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue || !this.shadowRoot.firstElementChild) return;

        if (name === "qr-value") {
            this.updateQRCode();
            return;
        }

        this.updateField(name);
    }

    updateContent() {
        FloatingPortraitIDCard.observedAttributes.forEach((name) => {
            if (name !== "qr-value") this.updateField(name);
        });
    }

    updateField(name) {
        const element = this.shadowRoot.querySelector(`[data-field="${name}"]`);
        if (!element) return;

        const value = this.getAttribute(name)?.trim() || "";
        if (element.tagName === "IMG") {
            element.onerror = () => {
                element.style.display = "none";
            };
            element.style.display = value ? "block" : "none";
            if (value) element.src = value;
            else element.removeAttribute("src");
            return;
        }

        element.textContent = value;
    }

    updateQRCode() {
        const container = this.shadowRoot.getElementById("student-qr");
        const code = this.shadowRoot.getElementById("student-qr-code");
        if (!container || !code) return;

        const qrCode = createStudentQRCode(this.getAttribute("qr-value"), "10mm", "10mm");
        code.innerHTML = qrCode;
        container.style.display = qrCode ? "flex" : "none";
    }
}

customElements.define("floating-portrait-id-card", FloatingPortraitIDCard);