export class ItemForm {
  id!: number;
  name!: string;
  value!: number;

  constructor(initializer?: ItemForm) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.name) this.name = initializer.name;
    if (initializer.value) this.value = initializer.value;
  }
}
