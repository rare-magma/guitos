import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLocalStorage } from "../utils";

function GNavBar() {
  const [budgetList, setBudgetList] = useLocalStorage("budgetList", "");

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
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="#import">
                <Form>
                  <Form.Group controlId="formFile">
                    <Form.Label>Import</Form.Label>
                    <Form.Control
                      className="nav-link"
                      type="file"
                      size="sm"
                      onChange={handleUpload}
                      style={{ display: "none" }}
                    />
                  </Form.Group>
                </Form>
              </Nav.Link>
              <Nav.Link href="#backup" onClick={handleDownload}>
                Backup
              </Nav.Link>
              <NavDropdown
                title="Month"
                id={`offcanvasNavbarDropdown-expand-${expand}`}
              >
                {budgetList !== null &&
                  Array.isArray(budgetList) &&
                  budgetList?.map((budget, i) => (
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
