import { useEffect, useRef, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsPlusLg, BsXLg, BsUpload, BsDownload } from "react-icons/bs";
import { Typeahead } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";
import { Option } from "react-bootstrap-typeahead/types/types";
import { Budget } from "./Budget";

interface NavBarProps {
  selected?: string | null;
  id?: string | null;
  budgetNameList: { id: string; label: string }[];
  onRename: (name?: string | null) => void;
  onDownload: () => void;
  onNew: () => void;
  onRemove: (name: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function NavBar({
  selected: initialSelectedName,
  id: initialId,
  budgetNameList: initialBudgetNameList,
  onRename,
  onDownload,
  onNew,
  onRemove,
  onUpload,
}: NavBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
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

  const handleClick = () => {
    inputRef.current?.click();
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
    const selectedBudget = budget as unknown as Budget[];
    navigate("/" + selectedBudget[0].name);
    navigate(0);
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
        {initialSelectedName && (
          <Nav className="flex-column flex-sm-row">
            <Form.Control
              aria-label={"budget name"}
              key={"budget-name-key"}
              defaultValue={initialSelectedName}
              onChange={editName}
              type="text"
              maxLength={25}
            />
          </Nav>
        )}
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
              Guitos
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="justify-content-end">
            <Nav>
              {initialBudgetNameList && initialBudgetNameList.length > 0 && (
                <Typeahead
                  id="basic-example"
                  filterBy={["name"]}
                  labelKey="name"
                  onChange={(budget: Option[]) => {
                    handleSelect(budget);
                  }}
                  className="p-2"
                  options={initialBudgetNameList
                    .sort((a, b) =>
                      (a as unknown as Budget).name.localeCompare(
                        (b as unknown as Budget).name
                      )
                    )
                    .reverse()}
                  placeholder="Search list of budgets..."
                />
              )}
            </Nav>
            <Nav>
              <Nav.Link
                onClick={() => {
                  handleNew();
                }}
              >
                <Button aria-label="new budget" variant="outline-success">
                  {expanded ? "new" : <BsPlusLg />}
                </Button>
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  handleRemove(initialId);
                }}
              >
                <Button aria-label="delete budget" variant="outline-danger">
                  {expanded ? "delete" : <BsXLg />}
                </Button>
              </Nav.Link>
              <Nav.Link href="#import" as="li">
                <Form.Group controlId="import">
                  <Button
                    aria-label="import budget"
                    variant="outline-primary"
                    onClick={handleClick}
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
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  handleDownload();
                }}
              >
                <Button aria-label="export budget" variant="outline-info">
                  {expanded ? "download" : <BsDownload />}
                </Button>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavBar;
