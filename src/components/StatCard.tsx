import { Stat } from "./Stat";
import { Button, Card, Form, InputGroup } from "react-bootstrap";

function formatDescription(description: string): string {
  return description.substring(0, 60) + "...";
}

interface StatCardProps {
  stat: Stat;
  onEdit: (stat: Stat) => void;
}

function StatCard(props: StatCardProps) {
  const { stat, onEdit } = props;

  const handleEditClick = (statBeingEdited: Stat) => {
    onEdit(statBeingEdited);
  };

  return (
    <Card>
      <Card.Header>Stats</Card.Header>
      <Card.Body>
        <InputGroup className="mb-1" key={stat.id + "stats"}>
          <InputGroup.Text>available</InputGroup.Text>
          <Form.Control
            aria-label={"available"}
            key={stat.id + "available"}
            defaultValue={stat.available}
            disabled
            readOnly
          />
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "withGoal"}>
          <InputGroup.Text>with goal</InputGroup.Text>
          <Form.Control
            aria-label={"withGoal"}
            key={stat.id + "withGoal"}
            defaultValue={stat.withGoal}
            disabled
            readOnly
          />
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "saved"}>
          <InputGroup.Text>saved</InputGroup.Text>
          <Form.Control
            aria-label={"saved"}
            key={stat.id + "saved"}
            defaultValue={stat.saved}
            disabled
            readOnly
          />
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "goal"}>
          <InputGroup.Text>goal</InputGroup.Text>
          <Form.Control
            aria-label={"goal"}
            key={stat.id + "goal"}
            defaultValue={stat.goal}
          />
        </InputGroup>
        <InputGroup className="mb-1" key={stat.id + "savings"}>
          <InputGroup.Text>savings</InputGroup.Text>
          <Form.Control
            aria-label={"savings"}
            key={stat.id + "savings"}
            defaultValue={stat.savings}
            disabled
            readOnly
          />
          <Button variant="primary" id="button-addon1">
            +
          </Button>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}

export default StatCard;
