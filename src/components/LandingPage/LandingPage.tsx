import { RefObject } from "react";
import { Button, Container, Form, Row, Stack } from "react-bootstrap";
import { useBudget } from "../../context/BudgetContext";
import Loading from "../Loading/Loading";

interface LandingPageProps {
  loading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onNew: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LandingPage({ loading, inputRef, onNew, onImport }: LandingPageProps) {
  const { budget, budgetList } = useBudget();
  const showLandingPage =
    !loading && !budget && budgetList && budgetList.length < 1;

  function handleNew() {
    onNew();
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    onImport(e);
  }

  return (
    <>
      {loading && <Loading />}

      {showLandingPage && (
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
                  data-testid="import-form-control-landing-page"
                  multiple
                  ref={inputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleImport(e);
                  }}
                  style={{ display: "none" }}
                />
              </Form.Group>
              <Button
                className="w-25 align-self-center"
                aria-label="open instructions in new tab"
                variant="outline-info"
                href="https://github.com/rare-magma/guitos#getting-started"
                target="_blank"
              >
                help
              </Button>
            </Stack>
          </Row>
        </Container>
      )}
    </>
  );
}

export default LandingPage;
