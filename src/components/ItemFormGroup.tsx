import { useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import { numberInputOnWheelPreventChange } from "../utils";
import { ItemForm } from "./ItemForm";

interface ItemFormProps {
  itemForm: ItemForm;
  costPercentage: number;
  onRemove: (itemForm: ItemForm) => void;
  onChange: (itemForm: ItemForm) => void;
}

function ItemFormGroup({
  itemForm: initialItemForm,
  costPercentage,
  onRemove,
  onChange,
}: ItemFormProps) {
  const [itemForm, setItemForm] = useState(initialItemForm);

  // const handleCurrency = (item: ItemForm) => {
  //   //TODO
  // };

  const handleRemove = (item: ItemForm) => {
    onRemove(item);
  };

  const editItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItemForm = new ItemForm({
      id: itemForm.id,
      name: event.target.value,
      value: isNaN(itemForm.value) ? 0 : itemForm.value,
    });

    setItemForm(newItemForm);
    onChange(newItemForm);
  };

  const editItemValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItemForm = new ItemForm({
      id: itemForm.id,
      name: itemForm.name,
      value: isNaN(event.target.valueAsNumber) ? 0 : event.target.valueAsNumber,
    });

    setItemForm(newItemForm);
    onChange(newItemForm);
  };

  return (
    <OverlayTrigger
      delay={100}
      placement="top"
      overlay={
        costPercentage > 0 ? (
          <Tooltip id={`tooltip-value-${itemForm.id}`}>
            {costPercentage}% of revenue
          </Tooltip>
        ) : (
          <></>
        )
      }
    >
      <InputGroup size="sm" className="mb-1" key={itemForm.id + "-group"}>
        <Form.Control
          aria-label={"newname"}
          key={itemForm.id + "-key"}
          defaultValue={itemForm.name}
          onChange={editItemName}
          type="text"
          maxLength={255}
        />
        <Col xs="3">
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
        {/* TODO currency support */}
        {/* <Col xs={1}>
          <Button
            key={itemForm.id + "button"}
            variant="currency"
            type="button"
            onClick={() => {
              // handleCurrency(itemForm);
            }}
          >
            <BsCurrencyEuro />
          </Button>
        </Col> */}
        <Button
          key={itemForm.id + "button"}
          variant="delete"
          type="button"
          onClick={() => {
            handleRemove(itemForm);
          }}
        >
          <BsXLg />
        </Button>
      </InputGroup>
    </OverlayTrigger>
  );
}

export default ItemFormGroup;
