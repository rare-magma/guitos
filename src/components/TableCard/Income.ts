import { ItemForm } from "../ItemForm/ItemForm";

export class Income {
  items: ItemForm[] = [];
  total = 0;

  constructor(initializer?: Income) {
    if (!initializer) return;
    if (initializer.items) this.items = initializer.items;
    if (initializer.total) this.total = initializer.total;
  }
}
