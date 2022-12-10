import { Form, InputGroup } from "react-bootstrap";
import { ItemForm } from "./ItemForm";

interface ItemFormProps {
  itemForm: ItemForm;
  onEdit: (itemForm: ItemForm) => void;
}

function ItemFormGroup(props: ItemFormProps, key: string) {
  const { itemForm, onEdit } = props;
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

export default ItemFormGroup;
