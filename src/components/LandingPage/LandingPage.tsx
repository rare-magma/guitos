import { useRef } from "react";
import {
  Button,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from "react-bootstrap";
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

  const showLandingPage =
    !loadingFromDB && !budget && budgetList && budgetList.length < 1;

  return (
    <>
      {loadingFromDB && <Loading />}

      {showLandingPage && (
        <Container className="position-absolute top-50 start-50 translate-middle">
          <Row className="justify-content-center align-content-center">
            <Stack gap={3}>
              <Button
                className="w-25 align-self-center"
                aria-label="new budget"
                variant="outline-success"
                onClick={createBudget}
              >
                new
              </Button>
              <Form.Group className="w-25 align-self-center" controlId="import">
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
                className="w-25 align-self-center"
                aria-label="open instructions in new tab"
                variant="outline-info"
                href="https://github.com/rare-magma/guitos#getting-started"
                target="_blank"
              >
                help
              </Button>
              <OverlayTrigger
                delay={250}
                placement="bottom"
                overlay={
                  <Tooltip
                    id={`tooltip-guitos-version`}
                    style={{ position: "fixed" }}
                  >
                    guitos version
                  </Tooltip>
                }
              >
                <a
                  className="version align-self-center"
                  aria-label="open guitos changelog"
                  href="https://github.com/rare-magma/guitos/blob/main/CHANGELOG.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  v{APP_VERSION}
                </a>
              </OverlayTrigger>
            </Stack>
          </Row>
        </Container>
      )}
    </>
  );
}
