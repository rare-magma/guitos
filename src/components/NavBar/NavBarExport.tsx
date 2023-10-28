import {
  Button,
  InputGroup,
  Nav,
  OverlayTrigger,
  Popover,
  Tooltip,
} from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { BsDownload } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { budgetToCsv } from "../../utils";

interface NavBarExportProps {
  exportButtonRef: React.RefObject<HTMLButtonElement>;
  exportJSONButtonRef: React.RefObject<HTMLButtonElement>;
  expanded: boolean;
}

export function NavBarExport({
  exportButtonRef,
  exportJSONButtonRef,
  expanded,
}: NavBarExportProps) {
  const { budget, budgetList } = useBudget();

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
      const url = window.URL.createObjectURL(new Blob([budgetToCsv(budget)]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    }
  }

  return (
    <Nav className="m-2">
      <OverlayTrigger
        trigger="click"
        key="nav-export-overlay"
        placement="bottom"
        rootClose={true}
        overlay={
          <Popover id={`nav-popover-export-button`}>
            <Popover.Body>
              <OverlayTrigger
                delay={250}
                placement="bottom"
                overlay={
                  <Tooltip
                    id={`nav-tooltip-export-budget`}
                    style={{ position: "fixed" }}
                  >
                    export budget
                  </Tooltip>
                }
              >
                <InputGroup
                  size="sm"
                  className="mb-1"
                  key={`export-button-group`}
                >
                  <Button
                    id={"budget-export-csv-button"}
                    aria-label="export budget as csv"
                    key={"budget-export-csv-button"}
                    variant="outline-info"
                    type="button"
                    onClick={handleExportCSV}
                  >
                    CSV
                  </Button>
                  <Button
                    id={"budget-export-json-button"}
                    aria-label="export budget as json"
                    key={"budget-export-json-button"}
                    variant="outline-info"
                    type="button"
                    ref={exportJSONButtonRef}
                    onClick={handleExportJSON}
                  >
                    JSON
                  </Button>
                </InputGroup>
              </OverlayTrigger>
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          className="w-100"
          aria-label="export budget"
          ref={exportButtonRef}
          variant="outline-info"
          onClick={() => {
            setTimeout(() => {
              exportJSONButtonRef.current?.focus();
            }, 0);
          }}
        >
          {expanded ? "export" : <BsDownload aria-hidden />}
        </Button>
      </OverlayTrigger>
    </Nav>
  );
}
