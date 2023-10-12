import {
  Button,
  InputGroup,
  Nav,
  OverlayTrigger,
  Popover,
  Tooltip,
} from "react-bootstrap";
import { BsDownload } from "react-icons/bs";

interface NavBarExportProps {
  exportButtonRef: React.RefObject<HTMLButtonElement>;
  exportJSONButtonRef: React.RefObject<HTMLButtonElement>;
  handleExport: (i: string) => void;
  expanded: boolean;
}

export function NavBarExport({
  exportButtonRef,
  exportJSONButtonRef,
  handleExport,
  expanded,
}: NavBarExportProps) {
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
                    onClick={() => {
                      handleExport("csv");
                    }}
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
                    onClick={() => {
                      handleExport("json");
                    }}
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
