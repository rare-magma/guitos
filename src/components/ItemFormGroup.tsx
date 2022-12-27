import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { ItemForm } from "./ItemForm";

interface ItemFormProps {
  itemForm: ItemForm;
  onRemove: (itemForm: ItemForm) => void;
}

function ItemFormGroup({ itemForm: initialItemForm, onRemove }: ItemFormProps) {
  const [itemForm, setItemForm] = useState(initialItemForm);

  const handleRemove = (item: ItemForm) => {
    onRemove(item);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { type, name, value } = event.target;
    let updatedValue = value;

    if (type === "number") {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };

    let updatedItemForm: ItemForm;

    setItemForm((i) => {
      updatedItemForm = new ItemForm({ ...i, ...change });
      return updatedItemForm;
    });
  };

  return (
    <Form>
      <InputGroup size="sm" className="mb-1" key={itemForm.id + "-group"}>
        <Form.Control
          aria-label={"newname"}
          key={itemForm.id + "-key"}
          defaultValue={itemForm.name}
          onChange={handleChange}
          type="text"
          maxLength={255}
        />
        <Form.Control
          aria-label={"newvalue"}
          key={itemForm.id + "-value"}
          className="text-right"
          defaultValue={itemForm.value}
          onChange={handleChange}
          type="number"
          maxLength={11}
        />
        <InputGroup.Text>€</InputGroup.Text>
        <Button
          key={itemForm.id + "button"}
          variant="text"
          type="button"
          onClick={() => {
            handleRemove(itemForm);
          }}
        >
          -
        </Button>
      </InputGroup>
    </Form>
  );
}

export default ItemFormGroup;
