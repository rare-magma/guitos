import { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { BsCurrencyEuro, BsXLg } from "react-icons/bs";
import { numberInputOnWheelPreventChange } from "../utils";
import { ItemForm } from "./ItemForm";

interface ItemFormProps {
  itemForm: ItemForm;
  onRemove: (itemForm: ItemForm) => void;
  onChange: (itemForm: ItemForm) => void;
}

function ItemFormGroup({
  itemForm: initialItemForm,
  onRemove,
  onChange,
}: ItemFormProps) {
  const [itemForm, setItemForm] = useState(initialItemForm);

  const handleRemove = (item: ItemForm) => {
    onRemove(item);
  };

  const editItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItemForm = new ItemForm({
      id: itemForm.id,
      name: event.target.value,
      value: itemForm.value,
    });

    setItemForm(newItemForm);
    onChange(newItemForm);
  };

  const editItemValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItemForm = new ItemForm({
      id: itemForm.id,
      name: itemForm.name,
      value: event.target.valueAsNumber,
    });

    setItemForm(newItemForm);
    onChange(newItemForm);
  };

  return (
    <Form>
      <InputGroup size="sm" className="mb-1" key={itemForm.id + "-group"}>
        <Col xs={7}>
          <Form.Control
            aria-label={"newname"}
            key={itemForm.id + "-key"}
            defaultValue={itemForm.name}
            onChange={editItemName}
            type="text"
            maxLength={255}
          />
        </Col>
        <Col xs={3}>
          <Form.Control
            aria-label={"newvalue"}
            key={itemForm.id + "-value"}
            className="text-right"
            defaultValue={itemForm.value}
            onChange={editItemValue}
            type="number"
            onWheelCapture={numberInputOnWheelPreventChange}
            maxLength={11}
          />
        </Col>
        <Col xs={1}>
          <InputGroup.Text>
            <BsCurrencyEuro />
          </InputGroup.Text>
        </Col>
        <Col xs={1}>
          <Button
            key={itemForm.id + "button"}
            variant="text"
            type="button"
            onClick={() => {
              handleRemove(itemForm);
            }}
          >
            <BsXLg />
          </Button>
        </Col>
      </InputGroup>
    </Form>
  );
}

export default ItemFormGroup;
