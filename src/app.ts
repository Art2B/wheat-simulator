import { Field } from "./components/Field";
import { createInventory } from "./Inventory";
import {
  RessourceHelpers,
  Ressources,
  RessourcesInformations,
} from "./Ressources";

window.$inventory = createInventory();

class Actions {
  static craft(ressource: Ressources) {
    console.log("Must craft this: ", ressource);

    const materials = RessourcesInformations[ressource].materials;

    if (
      !materials ||
      !materials.every((m) => {
        return window.$inventory[m.type] >= m.quantity;
      })
    ) {
      return;
    }

    for (const material of materials) {
      window.$inventory[material.type] -= material.quantity;
    }

    window.$inventory[ressource] += 1;
  }
}

document.querySelectorAll('button[data-action="craft"]').forEach((el) => {
  el.addEventListener("click", (e) => {
    const ressource = RessourceHelpers.getRessourceFromString(
      (e.target as HTMLElement).dataset.ressource
    );
    if (ressource) {
      Actions.craft(ressource);
    }
  });
});

const fieldContainer = document.querySelector("#field-container");
if (fieldContainer) {
  for (let i = 0; i < 3; i++) {
    new Field(fieldContainer);
  }
}
