import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { MOCK_BUDGETS } from "./MockBudgets";

function GNavBar() {
  const [budgets] = useState(MOCK_BUDGETS);
  return (
    <>
      {["md"].map((expand) => (
        <Navbar key={"navbar"} bg="light" expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="#">Guitos</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="#home">Import</Nav.Link>
              <Nav.Link href="#home">Backup</Nav.Link>
              <NavDropdown
                title="Month list"
                id={`offcanvasNavbarDropdown-expand-${expand}`}
              >
                {budgets.map((budget, i) => (
                  <NavDropdown.Item key={i} href={budget.id.toString()}>
                    {budget.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default GNavBar;
