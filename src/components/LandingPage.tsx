import { Button, Container, Form, Row, Spinner, Stack } from "react-bootstrap";
import { Budget } from "./Budget";
import { RefObject } from "react";

interface LandingPageProps {
  loading: boolean;
  budget: Budget | null;
  budgetList: Budget[];
  inputRef: RefObject<HTMLInputElement>;
  onNew: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LandingPage({
  loading,
  budget,
  budgetList,
  inputRef,
  onNew,
  onImport,
}: LandingPageProps) {
  const handleNew = () => {
    onNew();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImport(e);
  };

  return (
    <>
      {loading && (
        <Container
          fluid
          className="position-absolute top-50 start-50 translate-middle"
        >
          <Row className="justify-content-center">
            <Spinner animation="border" role="status" />
          </Row>
        </Container>
      )}

      {!loading && !budget && budgetList.length < 1 && (
        <Container className="position-absolute top-50 start-50 translate-middle">
          <Row className="justify-content-center align-content-center">
            <Stack gap={3}>
              <Button
                className="w-25 align-self-center"
                aria-label="new budget"
                variant="outline-success"
                onClick={handleNew}
              >
                new
              </Button>
              <Form.Group className="w-25 align-self-center" controlId="import">
                <Button
                  className="w-100"
                  aria-label="import budget"
                  variant="outline-primary"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  import
                </Button>
                <Form.Control
                  type="file"
                  multiple
                  ref={inputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleImport(e);
                  }}
                  style={{ display: "none" }}
                />
              </Form.Group>
            </Stack>
          </Row>
        </Container>
      )}
    </>
  );
}

export default LandingPage;
