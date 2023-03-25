import { useRef, useState } from "react";
import {
  Dropdown,
  ButtonGroup,
  Offcanvas,
  InputGroup,
  Col,
  Row,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsPlusLg, BsXLg, BsUpload, BsDownload } from "react-icons/bs";
import { Input, Typeahead } from "react-bootstrap-typeahead";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  selected?: string | null;
  id?: string | null;
  budgetNameList?: [];
  onRename: (name?: string | null) => void;
  onDownload: () => void;
  onNew: () => void;
  onRemove: (name: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function NavBar({
  selected: initialSelectedName,
  id: initialId,
  budgetNameList: budgetNameList,
  onRename,
  onDownload,
  onNew,
  onRemove,
  onUpload,
}: NavBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState(false);

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

  const handleCSVImport = () => {
    //TODO
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (selected: any) => {
    setSelected(selected);
    navigate("/" + selected, { replace: true });
    navigate(0);
  };

  const editName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName) {
      onRename(newName);
    }
  };

  return (
    <>
      <Navbar key="md" expand="md" bg="light" onToggle={setToggle}>
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
                {budgetNameList && budgetNameList.length > 0 && (
                  <Typeahead
                    id="basic-example"
                    onChange={handleSelect}
                    className="p-2"
                    options={budgetNameList}
                    placeholder="Search list of budgets..."
                    selected={selected}
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
                    <Dropdown as={ButtonGroup}>
                      <Button
                        aria-label="import budget"
                        variant="outline-primary"
                        onClick={handleClick}
                      >
                        {expanded ? "upload" : <BsUpload />}
                      </Button>
                      <Form.Control
                        type="file"
                        ref={inputRef}
                        onChange={handleImport}
                        style={{ display: "none" }}
                      />
                      <Dropdown.Toggle
                        split
                        variant="outline-primary"
                        id="import-dropdown"
                      />

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={handleCSVImport}
                          href="#import-csv"
                        >
                          from CSV
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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
    </>
  );
}

export default NavBar;
