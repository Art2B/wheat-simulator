import { Inventory } from "./Inventory";
import { RessourcesInformations } from "./Ressources";

export const verifyInventoryToggleCraftBtns = (inventory: Inventory) => {
  const ressourcesWithCraftingMaterials = Object.entries(
    RessourcesInformations
  ).filter(([_, value]) => {
    return value.materials;
  });

  for (const [ressource, information] of ressourcesWithCraftingMaterials) {
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
