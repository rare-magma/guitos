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
import { currencyCode, userLang } from "../utils";
import { ItemForm } from "./ItemForm";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";

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
  const [intlConfig] = useState<CurrencyInputProps["intlConfig"]>({
    locale: userLang,
    currency: currencyCode,
  });

  const handleRemove = (item: ItemForm) => {
    onRemove(item);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItemForm = new ItemForm({
      id: itemForm.id,
      name: event.target.value,
      value: isNaN(itemForm.value) ? 0 : itemForm.value,
    });

    setItemForm(newItemForm);
    onChange(newItemForm);
  };

  function handleValueChange(value: string | undefined): void {
    const newItemForm = new ItemForm({
      id: itemForm.id,
      name: itemForm.name,
      value: isNaN(Number(value)) ? 0 : Number(value),
    });

    setItemForm(newItemForm);
    onChange(newItemForm);
  }

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
          aria-label={"item-name"}
          key={itemForm.id + "-key"}
          defaultValue={itemForm.name}
          onChange={handleNameChange}
          type="text"
          maxLength={255}
        />
        <Col xs="3">
          <CurrencyInput
            id="item-value"
            key={itemForm.id + "-value"}
            className="text-right form-control"
            aria-label={"item-value"}
            name="item-value"
            intlConfig={intlConfig}
            defaultValue={itemForm.value}
            allowNegativeValue={false}
            maxLength={14}
            onValueChange={(value) => handleValueChange(value)}
          />
        </Col>
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
