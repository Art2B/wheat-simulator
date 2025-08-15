import { Inventory } from "./Inventory";
import { CraftableRessourcesInformations } from "./Ressources";

export const verifyInventoryToggleCraftBtns = (inventory: Inventory) => {
  for (const [ressource, information] of Object.entries(
    CraftableRessourcesInformations
  )) {
    const craftBtns = document.querySelectorAll<HTMLButtonElement>(
      `[data-action="craft"][data-ressource="${ressource}"]`
    );

    if (
      information.materials &&
      information.materials.every((req) => {
        const inventoryValue = inventory[req.type];
        return inventoryValue && inventoryValue >= req.quantity;
      })
    ) {
      craftBtns.forEach((el) => {
        el.disabled = false;
      });
    } else {
      craftBtns.forEach((el) => {
        el.disabled = true;
      });
    }
  }
};
