import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface ItemForm {
  name: string;
  value: string;
}

function ItemForm(itemForm: React.ComponentType) {
  return (
    <InputGroup className="mb-1" key={itemForm.name + "-group"}>
      <Form.Control aria-label={"newname"} key={itemForm.name + "-key"} />
      <Form.Control
        aria-label={"newvalue"}
        key={itemForm.value + "-value"}
        className="text-right"
      />
    </InputGroup>
  );
}

export default { ItemForm };
