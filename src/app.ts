import { v4 as uuid } from "uuid";
import { createFields, Field, PlantAction } from "./Fields";
import { createInventory } from "./Inventory";
import { Ressources, RessourcesInformations } from "./Ressources";

window.$inventory = createInventory();
window.$fields = createFields();

class Actions {
  private static actions: Record<string, (...args: any[]) => void> = {
    plant: Actions.plant,
    harvest: Actions.harvest,
    craft: Actions.craft,
  };

  static plant(ressource: Ressources) {
    console.log("Must plant this: ", ressource);
    const id = uuid();

    const data: PlantAction = {
      id,
      type: "plant",
      ressource: ressource,
      quantity: 1,
      ready: false,
      start: ((id: string) => {
        return setTimeout(() => {
          console.log("ready for harvest", id);
          const plantAction = window.$fields.find((item) => item.id === id);
          if (plantAction) {
            plantAction.ready = true;
          }
        }, RessourcesInformations[ressource].baseCraftTime);
      }).bind(this, id),
    };

    window.$fields.push(data);
    data.start();
  }

  static harvest(ressource: Ressources) {
    console.log("Must harvest this: ", ressource);
    const toHarvest = window.$fields.filter(
      (item) => item.ready && item.ressource === ressource
    );

    toHarvest.forEach((item) => {
      window.$fields.splice(
        window.$fields.findIndex((i) => i.id === item.id),
        1
      );
      window.$inventory[item.ressource] += item.quantity;
    });
  }

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

  static callAction(actionName: string, ...rest) {
    const action = Actions.actions[actionName];
    if (action) {
      action.call(Actions, ...rest);
    } else {
      console.error(`[Actions] Method: ${actionName} doesnt exist.`);
    }
  }
}

const handleButtonClick = (event: MouseEvent) => {
  console.log(
    "Clicked on button with action: ",
    (event.target as HTMLElement)?.dataset.action,
    (event.target as HTMLElement)?.dataset.ressource
  );

  const action: string | null = (event.target as HTMLElement)?.getAttribute(
    "data-action"
  );

  if (action) {
    Actions.callAction(
      action,
      (event.target as HTMLElement)?.dataset.ressource
    );
  }
};

document.querySelectorAll("button").forEach((el) => {
  el.addEventListener("click", handleButtonClick);
});

const fieldContainer = document.querySelector("#field-container");
if (fieldContainer) {
  const myField = new Field(fieldContainer);
}
