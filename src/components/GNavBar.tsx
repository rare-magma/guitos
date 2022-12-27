import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLocalStorage } from "../utils";

function GNavBar() {
  const [budgetList, setBudgetList] = useLocalStorage("budgetList", "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (e: any) => {
    const fileReader = new FileReader();

    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onloadend = () => {
      if (fileReader.result !== null) {
        setBudgetList(JSON.parse(fileReader.result as string));
      }
    };
  };

  const handleDownload = () => {
    let filename = new Date().toISOString();
    filename = "guitos-" + filename + ".json";
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(budgetList)])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      {["md"].map((expand) => (
        <Navbar key={"navbar"} bg="light" expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="#">Guitos</Navbar.Brand>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {budgetList !== null && Array.isArray(budgetList) && (
                <NavDropdown
                  title="Month"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  {budgetList?.map((budget, i) => (
                    <NavDropdown.Item key={i} href={budget.name.toString()}>
                      {budget.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}
            </Nav>
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
              <Nav.Link href="#search">
                <Button variant="outline-secondary">Search</Button>
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#import">
                <Form.Group controlId="import">
                  <Button variant="outline-primary" onClick={handleClick}>
                    Import
                  </Button>
                  <Form.Control
                    type="file"
                    ref={inputRef}
                    onChange={handleUpload}
                    style={{ display: "none" }}
                  />
                </Form.Group>
              </Nav.Link>
              <Nav.Link href="#backup" onClick={handleDownload}>
                <Button variant="outline-success">Backup</Button>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default GNavBar;
