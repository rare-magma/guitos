import { InputGroup, Form, Button } from "react-bootstrap";

interface Stats {
  available: number;
  withGoal: number;
  saved: number;
  goal: number;
  savings: number;
}

function Stats() {
  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control aria-label="First name" />
        <Form.Control aria-label="Amount (to the nearest dollar)" />
      </InputGroup>
      <div className="d-grid gap-2">
        <Button variant="primary" size="sm">
          +
        </Button>
      </div>
    </>
  );
}

export default Stats;
