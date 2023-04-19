import { useEffect, useRef, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsPlusLg, BsXLg, BsUpload, BsDownload } from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import { Option } from "react-bootstrap-typeahead/types/types";

interface NavBarProps {
  selected?: string | null;
  id?: string | null;
  budgetNameList: { id: string; name: string }[];
  onRename: (name?: string | null) => void;
  onDownload: () => void;
  onClone: () => void;
  onNew: () => void;
  onRemove: (name: string) => void;
  onSelect: (budget: Option[]) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function NavBar({
  selected: initialSelectedName,
  id: initialId,
  budgetNameList: initialBudgetNameList,
  onRename,
  onClone,
  onDownload,
  onNew,
  onRemove,
  onSelect,
  onUpload,
}: NavBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");

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
    onNew();
  };

  const handleClone = () => {
    onClone();
  };

  const handleDownload = () => {
    onDownload();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(event);
  };

  const handleRemove = (initialId?: string | null) => {
    if (initialId) {
      onRemove(initialId);
    }
  };

  const handleSelect = (budget: Option[]) => {
    onSelect(budget);
    if (typeRef && typeRef.current) {
      typeRef.current.clear();
    }
  };

  const editName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName) {
      onRename(newName);
    }
  };

  return (
    <Navbar variant={theme} key="md" expand="md" onToggle={setToggle}>
      <Container fluid>
        {initialBudgetNameList && initialBudgetNameList.length < 1 && (
          <Navbar.Brand className="flex-column flex-sm-row">
            guitos
          </Navbar.Brand>
        )}
        {initialSelectedName && (
          <Nav className="flex-column flex-sm-row me-2">
            <Form.Control
              aria-label={"budget name"}
              key={"budget-name-key-" + initialId}
              defaultValue={initialSelectedName}
              onChange={editName}
              type="text"
              maxLength={25}
            />
          </Nav>
        )}
        <Navbar.Toggle
          className="px-2"
          aria-controls={`offcanvasNavbar-expand-md`}
        />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
              guitos
            </Offcanvas.Title>
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
                <Button
                  className="w-100"
                  aria-label="new budget"
                  variant="outline-success"
                >
                  {expanded ? "new" : <BsPlusLg />}
                </Button>
              </Nav>
              {initialBudgetNameList && initialBudgetNameList.length > 0 && (
                <>
                  <Nav
                    className="m-2"
                    onClick={() => {
                      handleClone();
                    }}
                  >
                    <Button
                      className="w-100"
                      aria-label="clone budget"
                      variant="outline-success"
                    >
                      {expanded ? "clone" : <FaRegClone />}
                    </Button>
                  </Nav>
                  <Nav
                    className="m-2"
                    onClick={() => {
                      handleRemove(initialId);
                    }}
                  >
                    <Button
                      className="w-100"
                      aria-label="delete budget"
                      variant="outline-danger"
                    >
                      {expanded ? "delete" : <BsXLg />}
                    </Button>
                  </Nav>
                </>
              )}
              <Nav className="m-2" href="#import" as="li">
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
                    type="file"
                    multiple
                    ref={inputRef}
                    onChange={handleImport}
                    style={{ display: "none" }}
                  />
                </Form.Group>
              </Nav>
              {initialBudgetNameList && initialBudgetNameList.length > 0 && (
                <Nav
                  className="m-2"
                  onClick={() => {
                    handleDownload();
                  }}
                >
                  <Button
                    className="w-100"
                    aria-label="export budget"
                    variant="outline-info"
                  >
                    {expanded ? "download" : <BsDownload />}
                  </Button>
                </Nav>
              )}
              <Navbar.Brand className="version justify-content-end align-self-end m-2">
                <a href="https://github.com/rare-magma/guitos/blob/main/CHANGELOG.md">
                  v{APP_VERSION}
                </a>
              </Navbar.Brand>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavBar;
