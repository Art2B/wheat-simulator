import { PlantAction } from "../Fields";
import { Inventory } from "../Inventory";

declare global {
  interface Window {
    $inventory: Inventory;
    $fields: PlantAction[];
  }
}
