import {
  FarmableRessourcesInformations,
  RessourceHelpers,
  Ressources,
  RessourcesInformations,
} from "./../../Ressources";

enum FieldStates {
  fallow = "fallow",
  seeding = "seeding",
  growth = "growth",
  mature = "mature",
}
export class Field {
  element: HTMLElement;
  actionsContainer: HTMLElement;
  private _state: FieldStates = FieldStates.fallow;

  private timeModifier: number = 1;
  private yieldModifier: number = 1;
  private ressource: Ressources | null = null;
  private growingTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(container: Element) {
    this.state = FieldStates.fallow;
    this.element = this.generateFieldElement(container);
    this.actionsContainer = this.generateActionContainer();
    this.setActions();
  }

  get state() {
    return this._state;
  }

  set state(value: FieldStates) {
    this._state = value;
    if (this.element) {
      this.element.dataset.state = value;
      this.setActions();
    }
  }

  private generateFieldElement(container: Element): HTMLElement {
    const field = document.createElement("field-block");
    field.dataset.state = this.state;
    container.appendChild(field);
    return field;
  }

  private generateActionContainer() {
    if (!this.element) {
      throw new Error("There is no element in Field class");
    }

    const actionsContainer = document.createElement("div");
    actionsContainer.setAttribute("slot", "actions");
    this.element.appendChild(actionsContainer);
    return actionsContainer;
  }

  private setActions() {
    this.actionsContainer.innerHTML = "";

    if (this.state === FieldStates.fallow) {
      this.generatePlantButtons();
    } else if (
      this.state === FieldStates.growth ||
      this.state === FieldStates.seeding
    ) {
      this.actionsContainer.innerHTML = `<button data-action="harvest" disabled>Harvest field</button>`;
    } else if (this.state === FieldStates.mature) {
      this.actionsContainer.innerHTML = `<button data-action="harvest">Harvest field</button>`;
      this.actionsContainer
        .querySelectorAll('button[data-action="harvest"]')
        .forEach((el) => {
          el.addEventListener("click", this.handleHarvest.bind(this));
        });
    }
  }

  private generatePlantButtons() {
    Object.keys(FarmableRessourcesInformations)
      .map((key) => RessourceHelpers.getRessourceFromString(key))
      .filter((ressource) => !!ressource)
      .forEach((ressource) => {
        const button = document.createElement("button");
        button.dataset.action = "plant";
        button.dataset.ressource = ressource;
        button.textContent = `Plant ${ressource}`;
        button.addEventListener("click", this.handleActionPlant.bind(this));
        this.actionsContainer.appendChild(button);
      });
  }

  private handleActionPlant(e: Event) {
    const ressource = RessourceHelpers.getRessourceFromString(
      (e.target as HTMLElement).dataset.ressource
    );

    if (ressource && RessourceHelpers.isPlantableRessource(ressource)) {
      this.plant(ressource);
    }
  }

  private handleHarvest() {
    this.state = FieldStates.fallow;

    if (this.ressource) {
      window.$inventory[this.ressource] += 1 * this.yieldModifier;
    }
    this.ressource = null;

    if (this.growingTimeout) {
      clearTimeout(this.growingTimeout);
    }
    this.growingTimeout = null;
  }

  private plant(ressource: Ressources) {
    this.state = FieldStates.seeding;

    this.ressource = ressource;

    this.growingTimeout = setTimeout(() => {
      this.state = FieldStates.mature;
    }, RessourcesInformations[ressource].baseCraftTime * this.timeModifier);
  }
}
