import { h, render } from "@libs/hyper";

import * as fieldCssText from "bundle-text:./field.css";

const FieldBlockTemplate = () => {
  return (
    <div class="field" data-state="fallow">
      <button class="menu-button" id="menu-toggle" popovertarget="menu-actions">
        <div class="field-visual"></div>
      </button>

      <div class="menu-popover" id="menu-actions" popover="auto">
        <slot name="actions"></slot>
      </div>
    </div>
  );
};

export default class FieldBlock extends HTMLElement {
  shadowRoot: ShadowRoot;

  static observedAttributes = ["data-state"];

  constructor() {
    super();

    this.shadowRoot = this.attachShadow({ mode: "open" });

    const templateDOM = document.getElementById(
      "field-block-template"
    ) as HTMLTemplateElement | null;

    if (templateDOM) {
      this.shadowRoot.appendChild(templateDOM.content.cloneNode(true));
    }
  }

  static readonly define = () => {
    customElements.define("field-block", FieldBlock);
  };

  static readonly injectTemplate = () => {
    const template = document.createElement("template");
    template.setAttribute("id", "field-block-template");

    // inject <style> tag
    let style = document.createElement("style");
    style.textContent = fieldCssText;
    template.content.appendChild(style);

    // Inject template DOM
    const dom = render(FieldBlockTemplate());
    template.content.appendChild(dom);

    document.body.appendChild(template);
  };

  connectedCallback() {
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  connectedMoveCallback() {
    console.log("Custom element moved with moveBefore()");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    const field = this.shadowRoot.querySelector(".field") as HTMLElement;
    if (name === "data-state" && field) {
      field.dataset.state = newValue;
    }
  }
}
