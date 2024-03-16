import { useRef } from "react";
import { Button, Container, Form, Row, Stack } from "react-bootstrap";
import { useWindowSize } from "usehooks-ts";
import { useBudget } from "../../context/BudgetContext";
import { useGeneralContext } from "../../context/GeneralContext";
import { useDB } from "../../hooks/useDB";
import { Loading } from "../Loading/Loading";
import "./LandingPage.css";

export function LandingPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { budget, budgetList } = useBudget();
  const { loadingFromDB } = useGeneralContext();
  const { createBudget, handleImport } = useDB();
  const size = useWindowSize();
  const verticalScreen = size.width < 1000;
  const buttonWidth = verticalScreen ? "w-50" : "w-25";
  const titleWidth = verticalScreen ? "w-75" : "w-50";
  const showLandingPage =
    !loadingFromDB && !budget && budgetList && budgetList.length < 1;

  return (
    <>
      {loadingFromDB && <Loading />}

      {showLandingPage && (
        <>
          <Container className="position-absolute top-50 start-50 translate-middle">
            <Row className="justify-content-center align-content-center">
              <h1
                className={`${titleWidth} align-self-center justify-content-center text-center pb-5 balanced`}
              >
                <p>
                  Figure out where your money went, plan ahead of time and
                  analyze past expenditures.
                </p>
              </h1>
            </Row>
            <Row className="justify-content-center align-content-center">
              <Stack gap={3}>
                <Button
                  className={`${buttonWidth} align-self-center text-nowrap`}
                  aria-label="new budget"
                  variant="outline-success"
                  onClick={createBudget}
                >
                  get started
                </Button>
                <Form.Group
                  className={`${buttonWidth} align-self-center text-nowrap`}
                  controlId="import"
                >
                  <Button
                    className="w-100"
                    aria-label="import budget"
                    variant="outline-primary"
                    onClick={() => inputRef.current?.click()}
                  >
                    import
                  </Button>
                  <Form.Control
                    type="file"
                    data-testid="import-form-control-landing-page"
                    multiple
                    ref={inputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleImport(e)
                    }
                    style={{ display: "none" }}
                  />
                </Form.Group>
                <Button
                  className={`${buttonWidth} align-self-center text-nowrap`}
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
        </>
      )}
    </>
  );
}
