import { Stat } from "./Stat";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { numberInputOnWheelPreventChange } from "../utils";

interface StatCardProps {
  stat: Stat;
  onChange: (stat: Stat) => void;
}

function StatCard({ stat: initialStat, onChange }: StatCardProps) {
  const [stat, setStat] = useState(initialStat);

  const handleChange = (item: React.ChangeEvent<HTMLInputElement>) => {
    let updatedStat: Stat;
    if (stat !== null) {
      updatedStat = stat;
      updatedStat.goal = item.target.valueAsNumber;
      setStat(updatedStat);
      onChange(updatedStat);
    }
  };

  return (
    <Card>
      <Card.Header>Stats</Card.Header>
      <Card.Body>
        <InputGroup className="mb-1" key={"stats"}>
          <InputGroup.Text>available</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"available"}
            key={"available"}
            value={stat.available}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"withGoal"}>
          <InputGroup.Text>with goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"withGoal"}
            key={"withGoal"}
            value={stat.withGoal}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"goal"}>
          <InputGroup.Text>goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"goal"}
            key={"goal"}
            defaultValue={stat.goal}
            onChange={handleChange}
            onWheelCapture={numberInputOnWheelPreventChange}
            type="number"
            maxLength={2}
            max={100}
          />
          <InputGroup.Text>%</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"saved"}>
          <InputGroup.Text>saved</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"saved"}
            key={"saved"}
            value={stat.saved}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={"savings"}>
          <InputGroup.Text>savings</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"savings"}
            key={"savings"}
            value={stat.savings}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
          <Button variant="primary" id="button-addon1">
            +
          </Button>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default StatCard;
