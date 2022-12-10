import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface ItemForm {
  name: string;
  value: string;
}

function ItemForm(itemForm: ItemForm, key: string) {
  return (
    <InputGroup className="mb-1" key={key + "-group"}>
      <Form.Control
        aria-label={"newname"}
        key={key + "-key"}
        defaultValue={itemForm.name}
      />
      <Form.Control
        aria-label={"newvalue"}
        key={key + "-value"}
        className="text-right"
        defaultValue={itemForm.value}
      />
    </InputGroup>
  );
}

export default { ItemForm };
