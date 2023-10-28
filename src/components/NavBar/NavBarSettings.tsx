import { useRef } from "react";
import {
  Button,
  InputGroup,
  Nav,
  OverlayTrigger,
  Popover,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useHotkeys } from "react-hotkeys-hook";
import { BsGear } from "react-icons/bs";
import { useBudget } from "../../context/BudgetContext";
import { useConfig } from "../../context/ConfigContext";
import { currenciesList } from "../../lists/currenciesList";
import { budgetToCsv } from "../../utils";

interface NavBarSettingsProps {
  expanded: boolean;
}

export function NavBarSettings({ expanded }: NavBarSettingsProps) {
  const { currency, handleCurrency } = useConfig();
  const { budget, budgetList } = useBudget();
  const exportCSVButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  useHotkeys("s", (e) => !e.repeat && handleExportJSON(), {
    preventDefault: true,
  });
  useHotkeys("d", (e) => !e.repeat && handleExportCSV(), {
    preventDefault: true,
  });

  useHotkeys("t", (e) => !e.repeat && settingsButtonRef.current?.click(), {
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
        key="nav-settings-overlay"
        placement="bottom"
        rootClose={true}
        overlay={
          <Popover id={`nav-popover-settings-button`}>
            <Popover.Body>
              <Stack gap={3}>
                <Stack className="align-self-center" direction="horizontal">
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
                      ref={exportCSVButtonRef}
                      style={{
                        minWidth: "7ch",
                      }}
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
                      style={{
                        minWidth: "7ch",
                      }}
                      onClick={handleExportJSON}
                    >
                      JSON
                    </Button>
                    <Typeahead
                      id="currency-option-list"
                      maxResults={currenciesList.length}
                      maxHeight="30vh"
                      paginate={false}
                      onChange={(c: Option[]) => {
                        if (currenciesList.includes(c[0] as string)) {
                          handleCurrency(c[0] as string);
                        }
                      }}
                      className="w-100 fixed-width-font"
                      style={
                        expanded
                          ? {
                              maxWidth: "10ch",
                              minWidth: "10ch",
                            }
                          : {
                              maxWidth: "7ch",
                              minWidth: "7ch",
                            }
                      }
                      options={currenciesList.sort((a, b) =>
                        a.localeCompare(b),
                      )}
                      placeholder={currency}
                    />
                  </InputGroup>
                </Stack>
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
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          className="w-100"
          aria-label="budget settings"
          variant="outline-info"
          ref={settingsButtonRef}
          onClick={() => {
            setTimeout(() => {
              exportCSVButtonRef.current?.focus();
            }, 0);
          }}
        >
          {expanded ? "settings" : <BsGear aria-hidden />}
        </Button>
      </OverlayTrigger>
    </Nav>
  );
}
