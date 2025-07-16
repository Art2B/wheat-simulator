import { Inventory } from "../Inventory";
import { PlantAction } from "./Fields";

declare global {
  interface Window {
    $inventory: Inventory;
    $fields: PlantAction[];
  }
}
