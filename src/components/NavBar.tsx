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
  BsDownload,
  BsArrowLeft,
  BsArrowRight,
} from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";
import { useHotkeys } from "react-hotkeys-hook";
import { focusRef } from "../utils";

interface NavBarProps {
  budgetNameList: { id: string; name: string }[];
  id?: string | null;
  selected?: string | null;
  onClone: () => void;
  onExport: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNew: () => void;
  onRemove: (name: string) => void;
  onRename: (name?: string | null) => void;
  onSelect: (budget: Option[]) => void;
}

function NavBar({
  budgetNameList: initialBudgetNameList,
  id: initialId,
  selected: initialSelectedName,
  onClone,
  onExport,
  onGoBack,
  onGoForward,
  onImport,
  onNew,
  onRemove,
  onRename,
  onSelect,
}: NavBarProps) {
  const inputRef = useRef<HTMLInputElement>();
  const typeRef = useRef();
  const nameRef = useRef<HTMLInputElement>();

  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");

  useHotkeys(["/", "f"], () => focusRef(typeRef), { preventDefault: true });
  useHotkeys("r", () => focusRef(nameRef), { preventDefault: true });

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

  const editName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName) {
      onRename(newName);
    }
  };

  return (
    <Navbar variant={theme} key="md" expand="md" onToggle={setToggle}>
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
                    key={"budget-name-key-" + initialId}
                    defaultValue={initialSelectedName}
                    ref={nameRef}
                    onChange={editName}
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
              aria-label="close menu"
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
                      handleRemove(initialId);
                    }}
                  >
                    <OverlayTrigger
                      delay={250}
                      placement="bottom"
                      overlay={
                        <Tooltip
                          id={`tooltip-delete-budget`}
                          style={{ position: "fixed" }}
                        >
                          delete budget
                        </Tooltip>
                      }
                    >
                      <Button
                        className="w-100"
                        aria-label="delete budget"
                        variant="outline-danger"
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
                        inputRef.current?.click();
                      }}
                    >
                      {expanded ? "import" : <BsUpload />}
                    </Button>
                    <Form.Control
                      data-testid="import-form-control"
                      type="file"
                      multiple
                      ref={inputRef}
                      onChange={handleImport}
                      style={{ display: "none" }}
                    />
                  </Form.Group>
                </OverlayTrigger>
              </Nav>
              {initialBudgetNameList && initialBudgetNameList.length > 0 && (
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
                  <a href="https://github.com/rare-magma/guitos/blob/main/CHANGELOG.md">
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
