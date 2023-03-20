import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

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

  const handleNew = () => {
    onNew();
  };

  const handleDownload = () => {
    onDownload();
  };

  const handleRemove = (initialId?: string | null) => {
    if (initialId) {
      onRemove(initialId);
    }
  };

  const editName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    if (newName) {
      onRename(newName);
    }
  };

  return (
    <>
      {["md"].map((expand) => (
        <Navbar key={"navbar"} bg="light" expand={expand} className="mb-3">
          <Container fluid>
            <Nav>
              {budgetNameList && budgetNameList.length > 0 && (
                <NavDropdown
                  title="List"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  {budgetNameList?.map((name, i) => (
                    <NavDropdown.Item key={i} href={name}>
                      {name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}
            </Nav>
            {initialSelectedName && (
              <Nav>
                <Form.Control
                  aria-label={"newname"}
                  key={"newname-key"}
                  defaultValue={initialSelectedName}
                  onChange={editName}
                  type="text"
                  maxLength={25}
                />
              </Nav>
            )}
            <Nav>
              <Nav.Link>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="m-auto"
                    aria-label="Search"
                  />
                </Form>
              </Nav.Link>
              <Nav.Link>
                <Button variant="outline-secondary">Search</Button>
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link
                onClick={() => {
                  handleNew();
                }}
              >
                <Button variant="outline-success">New</Button>
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  handleRemove(initialId);
                }}
              >
                <Button variant="outline-success">Delete</Button>
              </Nav.Link>
              <Nav.Link>
                <Form.Group controlId="import">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      inputRef.current?.click();
                    }}
                  >
                    Import
                  </Button>
                  <Form.Control
                    type="file"
                    ref={inputRef}
                    onChange={() => {
                      onUpload;
                    }}
                    style={{ display: "none" }}
                  />
                </Form.Group>
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  handleDownload();
                }}
              >
                <Button variant="outline-success">Export</Button>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavBar;
