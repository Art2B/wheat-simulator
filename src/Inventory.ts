import { verifyInventoryToggleCraftBtns } from "./Craft";
import { Ressources } from "./Ressources";

export type Inventory = Record<Ressources, number>;

const defaultInventory: Inventory = {
  wheat: 0,
  bread: 0,
  parsnip: 0,
};

const inventoryProxyHandler = {
  set(obj: Inventory, prop: Ressources, value: Inventory[keyof Inventory]) {
    const result = Reflect.set(obj, prop, value);

    const ressourceElements = document.querySelectorAll(
      `[data-inventory="${prop}"]`
    );

    if (ressourceElements.length > 0) {
      ressourceElements.forEach((el) => {
        el.innerHTML = `${value} ${prop}`;
      });
    } else {
      const newInventoryEl = document.createElement("li");
      newInventoryEl.setAttribute("data-inventory", prop);
      newInventoryEl.innerText = `${value} ${prop}`;
      document.querySelector("#ressource-list")?.appendChild(newInventoryEl);
    }

    verifyInventoryToggleCraftBtns(obj);

    return result;
  },
};

export function createInventory(
  defaultState: Partial<Inventory> = {}
): Inventory {
  const inventory: Inventory = {
    ...defaultInventory,
    ...defaultState,
  };

  return new Proxy(inventory, inventoryProxyHandler);
}
