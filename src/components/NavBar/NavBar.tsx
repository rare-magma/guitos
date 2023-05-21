import { useEffect, useRef, useState } from "react";
import { Offcanvas, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  BsPlusLg,
  BsXLg,
  BsUpload,
  BsDownload,
  BsArrowLeft,
  BsArrowRight,
} from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useHotkeys } from "react-hotkeys-hook";
import { focusRef } from "../../utils";
import { currenciesList } from "../../lists/currenciesList";
import TypeaheadRef from "react-bootstrap-typeahead/types/core/Typeahead";

interface NavBarProps {
  budgetNameList: { id: string; name: string }[];
  id?: string | null;
  selected?: string | null;
  currency: string;
  onClone: () => void;
  onExport: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNew: () => void;
  onRemove: (name: string) => void;
  onRename: (name?: string | null) => void;
  onSelect: (budget: Option[]) => void;
  onSetCurrency: (currency: string) => void;
}

function NavBar({
  budgetNameList: initialBudgetNameList,
  id: initialId,
  selected: initialSelectedName,
  currency,
  onClone,
  onExport,
  onGoBack,
  onGoForward,
  onImport,
  onNew,
  onRemove,
  onRename,
  onSelect,
  onSetCurrency,
}: NavBarProps) {
  const importRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const typeRef = useRef<TypeaheadRef>(null);
  const currencyRef = useRef<TypeaheadRef>(null);
  const nameRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [theme, setTheme] = useState("light");

  useHotkeys(
    ["/", "f"],
    () =>
      focusRef(typeRef as unknown as React.MutableRefObject<HTMLInputElement>),
    { preventDefault: true }
  );
  useHotkeys("r", () => focusRef(nameRef), { preventDefault: true });
  useHotkeys(
    "t",
    () =>
      focusRef(
        currencyRef as unknown as React.MutableRefObject<HTMLInputElement>
      ),
    { preventDefault: true }
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    if (mediaQueryList.matches) {
      setTheme("dark");
    }

    mediaQueryList.addEventListener("change", (event) =>
      setTheme(event.matches ? "dark" : "light")
    );
  }, []);

  const setToggle = () => {
    setExpanded(!expanded);
  };

  const handleNew = () => {
    setExpanded(false);
    onNew();
  };

  const handleClone = () => {
    setExpanded(false);
    onClone();
  };

  const handleExport = () => {
    setExpanded(false);
    onExport();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpanded(false);
    onImport(event);
  };

  const handleRemove = (initialId?: string | null) => {
    if (initialId) {
      setExpanded(false);
      onRemove(initialId);
    }
  };

  const handleSelect = (budget: Option[]) => {
    setExpanded(false);
    onSelect(budget);
    if (typeRef.current) {
      typeRef.current.clear();
    }
  };

  const handleGoBack = () => {
    onGoBack();
  };

  const handleGoForward = () => {
    onGoForward();
  };

  const handleSetCurrency = (c: string) => {
    setExpanded(false);
    onSetCurrency(c);
    if (currencyRef.current) {
      currencyRef.current.clear();
    }
  };

  const editName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName) {
      onRename(newName);
    }
  };

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === "Escape") {
        setShowDelete(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <Navbar
      variant={theme}
      key="md"
      expand="md"
      onToggle={setToggle}
      data-testid="header"
    >
      <Container fluid className="flex-row">
        {initialBudgetNameList && initialBudgetNameList.length < 1 && (
          <Navbar.Brand className="flex-sm-row">guitos</Navbar.Brand>
        )}
        <Nav className="flex-row flex-grow-1">
          {initialSelectedName && (
            <Nav className="flex-row">
              {initialBudgetNameList && initialBudgetNameList.length > 1 && (
                <>
                  <Nav.Item
                    className="me-1 my-2"
                    onClick={() => {
                      handleGoBack();
                    }}
                  >
                    <OverlayTrigger
                      delay={250}
                      placement="bottom"
                      overlay={
                        <Tooltip
                          id={`tooltip-go-to-older-budget`}
                          style={{ position: "fixed" }}
                        >
                          go to older budget
                        </Tooltip>
                      }
                    >
                      <Button
                        aria-label="go to older budget"
                        variant="Expenses-plus-button"
                      >
                        <BsArrowLeft />
                      </Button>
                    </OverlayTrigger>
                  </Nav.Item>
                  <Nav.Item
                    className="m-2"
                    onClick={() => {
                      handleGoForward();
                    }}
                  >
                    <OverlayTrigger
                      delay={250}
                      placement="bottom"
                      overlay={
                        <Tooltip
                          id={`tooltip-go-to-newer-budget`}
                          style={{ position: "fixed" }}
                        >
                          go to newer budget
                        </Tooltip>
                      }
                    >
                      <Button
                        aria-label="go to newer budget"
                        variant="Expenses-plus-button"
                      >
                        <BsArrowRight />
                      </Button>
                    </OverlayTrigger>
                  </Nav.Item>
                </>
              )}
              <Nav.Item className="m-2 me-3">
                <OverlayTrigger
                  delay={250}
                  placement="bottom"
                  overlay={
                    <Tooltip
                      id={`tooltip-budget-name`}
                      style={{ position: "fixed" }}
                    >
                      budget name
                    </Tooltip>
                  }
                >
                  <Form.Control
                    aria-label={"budget name"}
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    key={"budget-name-key-" + initialId}
                    defaultValue={initialSelectedName}
                    ref={nameRef}
                    onChange={editName}
                    style={expanded ? {} : { minWidth: "12ch" }}
                    type="text"
                    maxLength={25}
                  />
                </OverlayTrigger>
              </Nav.Item>
            </Nav>
          )}
          <Nav className="flex-grow-1">
            <Navbar.Toggle
              className="ms-auto ms-2 my-2"
              aria-controls={`offcanvasNavbar-expand-md`}
            />
          </Nav>
        </Nav>
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end"
          show={expanded}
        >
          <Offcanvas.Header>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
              {initialSelectedName ? initialSelectedName : "guitos"}
            </Offcanvas.Title>
            <Button
              aria-label="close navigation"
              variant="outline-secondary"
              onClick={() => setExpanded(false)}
            >
              {<BsXLg />}
            </Button>
          </Offcanvas.Header>
          <Offcanvas.Body className="justify-content-end">
            <Nav>
              <Nav className="m-2">
                {initialBudgetNameList && initialBudgetNameList.length > 1 && (
                  <Typeahead
                    id="search-budget-list"
                    filterBy={["name"]}
                    labelKey="name"
                    ref={typeRef}
                    style={expanded ? {} : { minWidth: "10ch" }}
                    onChange={(budget: Option[]) => {
                      handleSelect(budget);
                    }}
                    className="w-100"
                    options={initialBudgetNameList
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .reverse()}
                    placeholder="Search list of budgets..."
                  />
                )}
              </Nav>
            </Nav>
            <Nav>
              <Nav
                className="m-2"
                onClick={() => {
                  handleNew();
                }}
              >
                <OverlayTrigger
                  delay={250}
                  placement="bottom"
                  overlay={
                    <Tooltip
                      id={`tooltip-new-budget`}
                      style={{ position: "fixed" }}
                    >
                      new budget
                    </Tooltip>
                  }
                >
                  <Button
                    className="w-100"
                    aria-label="new budget"
                    variant="outline-success"
                  >
                    {expanded ? "new" : <BsPlusLg />}
                  </Button>
                </OverlayTrigger>
              </Nav>
              {initialBudgetNameList && initialBudgetNameList.length > 0 && (
                <>
                  <Nav
                    className="m-2"
                    onClick={() => {
                      handleClone();
                    }}
                  >
                    <OverlayTrigger
                      delay={250}
                      placement="bottom"
                      overlay={
                        <Tooltip
                          id={`tooltip-clone-budget`}
                          style={{ position: "fixed" }}
                        >
                          clone budget
                        </Tooltip>
                      }
                    >
                      <Button
                        className="w-100"
                        aria-label="clone budget"
                        variant="outline-success"
                      >
                        {expanded ? "clone" : <FaRegClone />}
                      </Button>
                    </OverlayTrigger>
                  </Nav>
                  <Nav
                    className="m-2"
                    onClick={() => {
                      setShowDelete(!showDelete);
                    }}
                  >
                    <OverlayTrigger
                      trigger="click"
                      key="nav-deletion-overlay"
                      placement="bottom"
                      show={showDelete}
                      overlay={
                        <Popover id={`nav-popover-delete-button`}>
                          <Popover.Body>
                            <OverlayTrigger
                              delay={250}
                              placement="bottom"
                              overlay={
                                <Tooltip
                                  id={`nav-tooltip-delete-budget`}
                                  style={{ position: "fixed" }}
                                >
                                  delete budget
                                </Tooltip>
                              }
                            >
                              <Button
                                id={"budget-deletion-button"}
                                aria-label="confirm budget deletion"
                                key={"budget-deletion-button"}
                                variant="delete"
                                type="button"
                                ref={deleteButtonRef}
                                onClick={() => {
                                  setShowDelete(!showDelete);
                                  handleRemove(initialId);
                                }}
                              >
                                {expanded ? "delete budget" : <BsXLg />}
                              </Button>
                            </OverlayTrigger>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <Button
                        className="w-100"
                        aria-label="delete budget"
                        variant="outline-danger"
                        onClick={() => {
                          setTimeout(() => {
                            deleteButtonRef.current?.focus();
                          }, 0);
                        }}
                      >
                        {expanded ? "delete" : <BsXLg />}
                      </Button>
                    </OverlayTrigger>
                  </Nav>
                </>
              )}
              <Nav className="m-2" as="li">
                <OverlayTrigger
                  delay={250}
                  placement="bottom"
                  overlay={
                    <Tooltip
                      id={`tooltip-import-budget`}
                      style={{ position: "fixed" }}
                    >
                      import budget
                    </Tooltip>
                  }
                >
                  <Form.Group controlId="import">
                    <Button
                      className="w-100"
                      aria-label="import budget"
                      variant="outline-primary"
                      onClick={() => {
                        importRef.current?.click();
                      }}
                    >
                      {expanded ? "import" : <BsUpload />}
                    </Button>
                    <Form.Control
                      data-testid="import-form-control"
                      type="file"
                      multiple
                      ref={importRef}
                      onChange={handleImport}
                      style={{ display: "none" }}
                    />
                  </Form.Group>
                </OverlayTrigger>
              </Nav>
              {initialBudgetNameList && initialBudgetNameList.length > 0 && (
                <>
                  <Nav
                    className="m-2"
                    onClick={() => {
                      handleExport();
                    }}
                  >
                    <OverlayTrigger
                      delay={250}
                      placement="bottom"
                      overlay={
                        <Tooltip
                          id={`tooltip-export-budget`}
                          style={{ position: "fixed" }}
                        >
                          export budget
                        </Tooltip>
                      }
                    >
                      <Button
                        className="w-100"
                        aria-label="export budget"
                        variant="outline-info"
                      >
                        {expanded ? "export" : <BsDownload />}
                      </Button>
                    </OverlayTrigger>
                  </Nav>
                  <Nav className="m-2">
                    <Typeahead
                      id="currency-option-list"
                      aria-label="select currency option"
                      ref={currencyRef}
                      maxResults={currenciesList.length}
                      maxHeight="30vh"
                      paginate={false}
                      onChange={(c: Option[]) => {
                        if (currenciesList.includes(c[0] as string)) {
                          handleSetCurrency(c[0] as string);
                        }
                      }}
                      className="w-100 fixed-width-font"
                      style={
                        expanded
                          ? {}
                          : {
                              maxWidth: "6ch",
                              minWidth: "6ch",
                            }
                      }
                      options={currenciesList.sort((a, b) =>
                        a.localeCompare(b)
                      )}
                      placeholder={currency}
                    />
                  </Nav>
                </>
              )}
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
                <Navbar.Brand className="version justify-content-end align-self-end m-2">
                  <a
                    aria-label="open guitos changelog"
                    href="https://github.com/rare-magma/guitos/blob/main/CHANGELOG.md"
                  >
                    v{APP_VERSION}
                  </a>
                </Navbar.Brand>
              </OverlayTrigger>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavBar;
