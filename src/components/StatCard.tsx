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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (item: any) => {
    let updatedStat: Stat;
    setStat((s) => {
      updatedStat = new Stat({
        ...s,
        goal: item.target.valueAsNumber,
        isNew: true,
      });
      onChange(updatedStat);
      return updatedStat;
    });
  };

  return (
    <Card>
      <Card.Header>Stats</Card.Header>
      <Card.Body>
        <InputGroup className="mb-1" key={stat.id + "stats"}>
          <InputGroup.Text>available</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"available"}
            key={stat.id + "available"}
            value={stat.available}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "withGoal"}>
          <InputGroup.Text>with goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"withGoal"}
            key={stat.id + "withGoal"}
            value={stat.withGoal}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "goal"}>
          <InputGroup.Text>goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"goal"}
            key={stat.id + "goal"}
            defaultValue={stat.goal}
            onChange={handleChange}
            onWheelCapture={numberInputOnWheelPreventChange}
            type="number"
            maxLength={2}
            max={100}
          />
          <InputGroup.Text>%</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "saved"}>
          <InputGroup.Text>saved</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"saved"}
            key={stat.id + "saved"}
            value={stat.saved}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "savings"}>
          <InputGroup.Text>savings</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"savings"}
            key={stat.id + "savings"}
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
