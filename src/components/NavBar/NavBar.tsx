import { useEffect, useRef, useState } from "react";
import { Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  BsPlusLg,
  BsXLg,
  BsUpload,
  BsArrowLeft,
  BsArrowRight,
  BsQuestionLg,
} from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useHotkeys } from "react-hotkeys-hook";
import { focusRef } from "../../utils";
import { currenciesList } from "../../lists/currenciesList";
import TypeaheadRef from "react-bootstrap-typeahead/types/core/Typeahead";
import { NavBarItem } from "./NavBarItem";
import { NavBarDelete } from "./NavBarDelete";
import { NavBarExport } from "./NavBarExport";

interface NavBarProps {
  budgetNameList: { id: string; name: string }[];
  id?: string | null;
  selected?: string | null;
  currency: string;
  onClone: () => void;
  onExport: (t: string) => void;
  onGoBack: () => void;
  onGoHome: () => void;
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
  onGoHome,
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
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const exportJSONButtonRef = useRef<HTMLButtonElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");

  useHotkeys("pageup", () => handleGoForward(), { preventDefault: true });
  useHotkeys("pagedown", () => handleGoBack(), { preventDefault: true });
  useHotkeys("Home", () => handleGoHome(), { preventDefault: true });
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

  const handleExport = (t: string) => {
    setExpanded(false);
    onExport(t);
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

  const handleGoHome = () => {
    onGoHome();
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
          <OverlayTrigger
            delay={250}
            placement="bottom"
            overlay={
              <Tooltip id={`tooltip-guitos-repo`} style={{ position: "fixed" }}>
                open repository in new tab
              </Tooltip>
            }
          >
            <Navbar.Brand className="flex-sm-row">
              <a
                className="brand"
                aria-label="open guitos repository"
                href="https://github.com/rare-magma/guitos"
                target="_blank"
                rel="noreferrer"
              >
                guitos
              </a>
            </Navbar.Brand>
          </OverlayTrigger>
        )}
        <Nav className="flex-row flex-grow-1">
          {initialSelectedName && (
            <Nav className="flex-row">
              {initialBudgetNameList && initialBudgetNameList.length > 1 && (
                <>
                  <NavBarItem
                    itemClassName={"me-1 my-2"}
                    onClick={handleGoBack}
                    tooltipID={"tooltip-go-to-older-budget"}
                    tooltipText={"go to older budget"}
                    buttonAriaLabel={"go to older budget"}
                    buttonVariant={"Expenses-plus-button"}
                    buttonIcon={<BsArrowLeft />}
                  />
                  <NavBarItem
                    itemClassName={"m-2"}
                    onClick={handleGoForward}
                    tooltipID={"tooltip-go-to-newer-budget"}
                    tooltipText={"go to newer budget"}
                    buttonAriaLabel={"go to newer budget"}
                    buttonVariant={"Expenses-plus-button"}
                    buttonIcon={<BsArrowRight />}
                  />
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
              <NavBarItem
                itemClassName={"m-2"}
                onClick={() => {
                  handleNew();
                }}
                tooltipID={"tooltip-new-budget"}
                tooltipText={"new budget"}
                buttonAriaLabel={"new budget"}
                buttonClassName="w-100"
                buttonVariant={"outline-success"}
                buttonIcon={expanded ? "new" : <BsPlusLg />}
              />
              {initialBudgetNameList && initialBudgetNameList.length > 0 && (
                <>
                  <NavBarItem
                    itemClassName={"m-2"}
                    onClick={handleClone}
                    tooltipID={"tooltip-clone-budget"}
                    tooltipText={"clone budget"}
                    buttonAriaLabel={"clone budget"}
                    buttonClassName="w-100"
                    buttonVariant={"outline-success"}
                    buttonIcon={expanded ? "clone" : <FaRegClone />}
                  />
                  <NavBarDelete
                    deleteButtonRef={deleteButtonRef}
                    handleRemove={() => handleRemove(initialId)}
                    initialId={initialId}
                    expanded={expanded}
                  />
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
                  <NavBarExport
                    exportButtonRef={exportButtonRef}
                    exportJSONButtonRef={exportJSONButtonRef}
                    handleExport={handleExport}
                    expanded={expanded}
                  />
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
              <NavBarItem
                itemClassName={"m-2"}
                onClick={() => {
                  return undefined;
                }}
                tooltipID={"tooltip-guitos-instructions"}
                tooltipText={"open instructions in new tab"}
                buttonAriaLabel={"open instructions in new tab"}
                buttonClassName="w-100"
                buttonVariant={"outline-info"}
                buttonLink="https://github.com/rare-magma/guitos#getting-started"
                buttonIcon={expanded ? "instructions" : <BsQuestionLg />}
                target="_blank"
              />
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
                    target="_blank"
                    rel="noreferrer"
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
