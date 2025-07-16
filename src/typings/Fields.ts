import { Ressources } from "../Ressources";

export type PlantAction = {
  id: string;
  type: "plant";
  ressource: Ressources;
  quantity: number;
  ready: boolean;
  start: () => number;
};

const plantElementProxy = {
  set(obj, prop, value) {
    console.log("Single element changed", { obj, prop, value });

    const harvestBtn = document.querySelector(
      `[data-action="harvest"][data-ressource="${obj.ressource}"]`
    ) as HTMLButtonElement;

    obj[prop] = value;

    if (obj.ready) {
      console.log("Remove the disabled");
      harvestBtn.disabled = false;
    }

    return true;
  },
};

const fieldArrayValidator = {
  set(obj, prop, value) {
    console.log("Fields changed", { obj, prop, value });

    if (value.type === "plant") {
      obj[prop] = new Proxy(value, plantElementProxy);
    } else {
      obj[prop] = value;
    }

    if (obj.every((item) => !item.ready)) {
      const harvestBtns = document.querySelectorAll<HTMLButtonElement>(
        `[data-action="harvest"]`
      );
      harvestBtns.forEach((el) => (el.disabled = true));
    }

    return true;
  },
};

export const createFields = () => {
  const fields: PlantAction[] = [];

  return new Proxy(fields, fieldArrayValidator);
};
