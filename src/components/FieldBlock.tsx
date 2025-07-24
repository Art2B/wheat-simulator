import { h, render } from "@libs/hyper";

const FieldBlocTemplate = () => {
  return (
    <template id="field-block-template">
      <div class="field" data-state="fallow">
        <div class="field-visual"></div>
      </div>
    </template>
  );
};

export default class FieldBlock extends HTMLElement {
  constructor() {
    super();

    const templateDOM = document.getElementById("field-block-template");
    console.log(templateDOM);
    if (templateDOM) {
      const templateContent = templateDOM.content;
      console.log(templateContent);

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  }

  static readonly define = () => {
    customElements.define("field-block", FieldBlock);
  };

  static readonly injectTemplate = () => {
    const dom = render(FieldBlocTemplate());
    document.body.appendChild(dom);
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

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}
