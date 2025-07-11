import { v4 as uuid } from "uuid";

type PlantAction = {
  id: string;
  type: "plant";
  ressource: string;
  quantity: number;
  ready: boolean;
  start: () => number;
};

type Inventory = {
  wheat: number;
  parsnip: number;
  bread: number;
};

window.inventory = {
  wheat: 0,
  parsnip: 0,
  bread: 0,
} as Inventory;

window.fields = [];

const CRAFTS = {
  bread: {
    ingredients: {
      wheat: 2,
    },
  },
};

const checkCraft = (state: Inventory) => {
  const breadCraftBtns = document.querySelectorAll<HTMLButtonElement>(
    '[data-action="craft"][data-ressource="bread"]'
  );

  if (state.wheat >= 2) {
    breadCraftBtns.forEach((el) => {
      el.disabled = false;
    });
  } else {
    breadCraftBtns.forEach((el) => {
      el.disabled = true;
    });
  }
};

const inventoryProxy = {
  set(obj, prop, value) {
    obj[prop] = value;

    const ressourceElements = document.querySelectorAll(
      `[data-ressource="${prop}"][data-inventory]`
    );

    if (ressourceElements.length > 0) {
      ressourceElements.forEach((el) => {
        el.innerHTML = `${value} ${prop}`;
      });
    } else {
      const newInventoryEl = document.createElement("li");
      newInventoryEl.setAttribute("data-ressource", prop);
      newInventoryEl.setAttribute("data-inventory", "");
      newInventoryEl.innerText = `${value} ${prop}`;
      document.querySelector("#ressource-list")?.appendChild(newInventoryEl);
    }

    checkCraft(obj);

    return true;
  },
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

const proxiedFields = new Proxy(window.fields, fieldArrayValidator);
const proxiedInventory = new Proxy(window.inventory, inventoryProxy);

class Actions {
  static plant(ressource) {
    console.log("Must plant this: ", ressource);
    const id = uuid();

    const data: PlantAction = {
      id,
      type: "plant",
      ressource: ressource,
      quantity: 1,
      ready: false,
      start: ((id) => {
        return setTimeout(() => {
          console.log("ready for harvest", id);
          const plantAction = proxiedFields.find((item) => item.id === id);
          if (plantAction) {
            plantAction.ready = true;
          }
        }, 1000);
      }).bind(this, id),
    };

    proxiedFields.push(data);
    data.start();
  }

  static harvest(ressource) {
    console.log("Must harvest this: ", ressource);
    const toHarvest = proxiedFields.filter(
      (item) => item.ready && item.ressource === ressource
    );

    toHarvest.forEach((item) => {
      proxiedFields.splice(
        proxiedFields.findIndex((i) => i.id === item.id),
        1
      );
      proxiedInventory[item.ressource] += item.quantity;
    });
  }

  static craft(ressource) {
    console.log("Must craft this: ", ressource);

    const ingredients = CRAFTS[ressource].ingredients;

    for (const [r, quantity] of Object.entries(ingredients)) {
      proxiedInventory[r] -= quantity;
    }

    proxiedInventory[ressource] += 1;
  }
}

const handleButtonClick = (event: MouseEvent) => {
  console.log(
    "Clicked on button with action: ",
    (event.target as HTMLElement)?.dataset.action,
    (event.target as HTMLElement)?.dataset.ressource
  );

  const action: string | undefined = (event.target as HTMLElement)?.dataset
    .action;

  if (action) {
    const actionMethod = Actions[action];

    if (typeof actionMethod === "function") {
      actionMethod.call(
        Actions,
        (event.target as HTMLElement)?.dataset.ressource
      );
    }
  }
};

document.querySelectorAll("button").forEach((el) => {
  el.addEventListener("click", handleButtonClick);
});
