import { Inventory } from "../Inventory";

declare global {
  interface Window {
    $inventory: Inventory;
  }
}
