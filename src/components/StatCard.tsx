import { Stat } from "./Stat";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { Budget } from "./Budget";
import {
  calcAvailable,
  calcWithGoal,
  numberInputOnWheelPreventChange,
} from "../utils";

interface StatCardProps {
  budget: Budget;
  onChange: (stat: Stat) => void;
}

function StatCard({ budget: initialStat, onChange }: StatCardProps) {
  const [stat, setStat] = useState(initialStat);
  const [available, setAvailable] = useState(calcAvailable(stat));
  const [withGoal, setWithGoal] = useState(calcWithGoal(stat));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (item: any) => {
    const newStat = new Budget();
    newStat.name = stat.name;
    newStat.incomes = stat.incomes;
    newStat.expenses = stat.expenses;
    newStat.stats = stat.stats;
    newStat.stats.goal = item.target.value;

    setAvailable(calcAvailable(newStat));
    setWithGoal(calcWithGoal(newStat));
    onChange(newStat.stats);
  };

  return (
    <Card>
      <Card.Header>Stats</Card.Header>
      <Card.Body>
        <InputGroup className="mb-1" key={stat.stats.id + "stats"}>
          <InputGroup.Text>available</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"available"}
            key={stat.stats.id + "available"}
            value={available}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.stats.id + "withGoal"}>
          <InputGroup.Text>with goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"withGoal"}
            key={stat.stats.id + "withGoal"}
            value={withGoal}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.stats.id + "goal"}>
          <InputGroup.Text>goal</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"goal"}
            key={stat.stats.id + "goal"}
            defaultValue={stat.stats.goal}
            onChange={handleChange}
            onWheelCapture={numberInputOnWheelPreventChange}
            type="number"
            maxLength={2}
            max={100}
          />
          <InputGroup.Text>%</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.stats.id + "saved"}>
          <InputGroup.Text>saved</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"saved"}
            key={stat.stats.id + "saved"}
            value={stat.stats.saved}
            onChange={handleChange}
            disabled
            readOnly
          />
          <InputGroup.Text>€</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mb-1" key={stat.stats.id + "savings"}>
          <InputGroup.Text>savings</InputGroup.Text>
          <Form.Control
            className="text-right"
            aria-label={"savings"}
            key={stat.stats.id + "savings"}
            value={stat.stats.savings}
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
