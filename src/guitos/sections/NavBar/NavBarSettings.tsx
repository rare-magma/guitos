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
import type { Option } from "react-bootstrap-typeahead/types/types";
import { useHotkeys } from "react-hotkeys-hook";
import { BsGear } from "react-icons/bs";
import { currenciesList } from "../../../lists/currenciesList";
import { useConfig } from "../../context/ConfigContext";
import { UserOptions } from "../../domain/userOptions";
import { useDB } from "../../hooks/useDB";

interface NavBarSettingsProps {
  expanded: boolean;
}

export function NavBarSettings({ expanded }: NavBarSettingsProps) {
  const { userOptions, setUserOptions } = useConfig();
  const { saveCurrencyOption } = useDB();
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const versionRef = useRef<HTMLAnchorElement>(null);

  useHotkeys("t", (e) => !e.repeat && settingsButtonRef.current?.click(), {
    preventDefault: true,
  });

  return (
    <Nav className={expanded ? "m-4 flex-grow-1 h-25" : "m-2"}>
      <OverlayTrigger
        trigger="click"
        key="nav-settings-overlay"
        placement={"auto"}
        rootClose={true}
        overlay={
          <Popover id={"nav-popover-settings-button"}>
            <Popover.Body>
              <Stack gap={3}>
                <Stack className="align-self-center" direction="horizontal">
                  <InputGroup
                    size="sm"
                    className="mb-1"
                    key={"export-button-group"}
                  >
                    <Typeahead
                      id="currency-option-list"
                      maxResults={currenciesList.length}
                      maxHeight="30vh"
                      paginate={false}
                      inputProps={{
                        "aria-label": "select display currency",
                      }}
                      onChange={(c: Option[]) => {
                        if (currenciesList.includes(c[0] as string)) {
                          setUserOptions(
                            new UserOptions(c[0] as string, navigator.language),
                          );
                          saveCurrencyOption(c[0] as string);
                        }
                      }}
                      className="w-100 fixed-width-font"
                      style={
                        expanded
                          ? {
                              maxWidth: "11ch",
                              minWidth: "11ch",
                            }
                          : {
                              maxWidth: "8ch",
                              minWidth: "8ch",
                            }
                      }
                      options={currenciesList.sort((a, b) =>
                        a.localeCompare(b),
                      )}
                      placeholder={userOptions.currencyCode}
                    />
                  </InputGroup>
                </Stack>
                <OverlayTrigger
                  delay={250}
                  placement="bottom"
                  overlay={
                    <Tooltip
                      id={"tooltip-guitos-version"}
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
                    ref={versionRef}
                    rel="noreferrer"
                  >
                    {/* biome-ignore lint/correctness/noUndeclaredVariables: <explanation> */}
                    v{APP_VERSION}
                  </a>
                </OverlayTrigger>
              </Stack>
            </Popover.Body>
          </Popover>
        }
      >
        <Button
          className="w-100 h-100"
          aria-label="budget settings"
          variant="outline-info"
          ref={settingsButtonRef}
          onClick={() => {
            setTimeout(() => {
              versionRef.current?.focus();
            }, 0);
          }}
        >
          {<BsGear size={expanded ? 50 : 0} aria-hidden={true} />}
        </Button>
      </OverlayTrigger>
    </Nav>
  );
}
