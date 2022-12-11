import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { ItemForm } from "./ItemForm";

interface ItemFormProps {
  itemForm: ItemForm;
  onChange: (itemForm: ItemForm) => void;
}

function ItemFormGroup({ itemForm: initialItemForm }: ItemFormProps) {
  const [itemForm, setItemForm] = useState(initialItemForm);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { type, name, value } = event.target;
    // if input type is checkbox use checked
    // otherwise it's type is text, number etc. so use value
    let updatedValue = value;

    //if input type is number convert the updatedValue string to a +number
    if (type === "number") {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };

    let updatedItemForm: ItemForm;
    // need to do functional update b/c
    // the new project state is based on the previous project state
    // so we can keep the project properties that aren't being edited +like project.id
    // the spread operator (...) is used to
    // spread the previous project properties and the new change
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
      </InputGroup>
    </Form>
  );
}

export default ItemFormGroup;
