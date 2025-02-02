import type React from "react";
import { type Dispatch, type SetStateAction, useRef } from "react";
import {
  Button,
  Form,
  InputGroup,
  Nav,
  OverlayTrigger,
  Popover,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { BsArrowDownUp, BsUpload } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { Budget } from "../../domain/budget";
import { useDB } from "../../hooks/useDB";

interface NavBarImpExpProps {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

export function NavBarImpExp({ expanded, setExpanded }: NavBarImpExpProps) {
  const { budget, budgetList, budgetNameList } = useBudget();
  const { handleImport } = useDB();
  const importRef = useRef<HTMLInputElement>(null);
  const importButtonRef = useRef<HTMLButtonElement>(null);
  const exportCSVButtonRef = useRef<HTMLButtonElement>(null);
  const impExpButtonRef = useRef<HTMLButtonElement>(null);
  const hasOneOrMoreBudgets = budgetNameList && budgetNameList.length > 0;

  useHotkeys("o", (e) => !e.repeat && impExpButtonRef.current?.click(), {
    preventDefault: true,
  });

  useHotkeys("s", (e) => !e.repeat && handleExportJSON(), {
    preventDefault: true,
  });

  useHotkeys("d", (e) => !e.repeat && handleExportCSV(), {
    preventDefault: true,
  });

  function handleExportJSON() {
    if (budget) {
      const date = new Date().toISOString();
      const filename = `guitos-${date.slice(0, -5)}.json`;
      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(budgetList)]),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    }
  }

  function handleExportCSV() {
    if (budget) {
      const filename = `${budget.name}.csv`;
      const url = window.URL.createObjectURL(new Blob([Budget.toCsv(budget)]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    }
  }

  return hasOneOrMoreBudgets ? (
    <Nav className={expanded ? "m-4 flex-grow-1 h-25" : "m-2"}>
      <OverlayTrigger
        trigger="click"
        key="nav-imp-exp-overlay"
        placement="bottom"
        rootClose={true}
        overlay={
          <Popover id={"nav-popover-imp-exp-button"}>
            <Popover.Body>
              <Stack gap={3}>
                <Stack className="align-self-center" direction="horizontal">
                  <InputGroup
                    size="sm"
                    className="mb-1"
                    key={"export-button-group"}
                  >
                    <Button
                      aria-label="import budget"
                      variant="outline-primary"
                      type="button"
                      ref={importButtonRef}
                      onClick={() => importRef.current?.click()}
                    >
                      import
                    </Button>
                    <Form.Control
                      data-testid="import-form-control"
                      className="straight-corners"
                      type="file"
                      multiple={true}
                      ref={importRef}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setExpanded(false);
                        handleImport(event);
                      }}
                      style={{ display: "none" }}
                    />
                    <Button
                      id={"budget-export-csv-button"}
                      aria-label="export budget as csv"
                      key={"budget-export-csv-button"}
                      variant="outline-primary"
                      type="button"
                      ref={exportCSVButtonRef}
                      style={{
                        minWidth: "7ch",
                      }}
                      onClick={handleExportCSV}
                    >
                      csv
                    </Button>
                    <Button
                      id={"budget-export-json-button"}
                      aria-label="export budget as json"
                      key={"budget-export-json-button"}
                      variant="outline-primary"
                      type="button"
                      style={{
                        minWidth: "7ch",
                      }}
                      onClick={handleExportJSON}
                    >
                      json
                    </Button>
                  </InputGroup>
                </Stack>
              </Stack>
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          className={expanded ? "w-100 h-100" : "w-100"}
          aria-label="import or export budget"
          variant="outline-primary"
          ref={impExpButtonRef}
          onClick={() => {
            setTimeout(() => {
              importButtonRef.current?.focus();
            }, 0);
          }}
        >
          {<BsArrowDownUp size={expanded ? 50 : 0} aria-hidden={true} />}
        </Button>
      </OverlayTrigger>
    </Nav>
  ) : (
    <Nav className={expanded ? "m-4 flex-grow-1 h-75 w-25" : "m-2"}>
      <OverlayTrigger
        delay={250}
        placement="bottom"
        overlay={
          <Tooltip id={"tooltip-import-budget"} style={{ position: "fixed" }}>
            import budget
          </Tooltip>
        }
      >
        <Form.Group className="w-100 h-100" controlId="import">
          <Button
            className="w-100 h-100"
            aria-label="import budget"
            variant="outline-primary"
            onClick={() => importRef.current?.click()}
          >
            {<BsUpload size={expanded ? 50 : 0} aria-hidden={true} />}
          </Button>
          <Form.Control
            data-testid="import-form-control"
            type="file"
            multiple={true}
            ref={importRef}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setExpanded(false);
              handleImport(event);
            }}
            style={{ display: "none" }}
          />
        </Form.Group>
      </OverlayTrigger>
    </Nav>
  );
}
