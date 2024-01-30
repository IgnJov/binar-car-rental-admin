import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Navbar from "react-bootstrap/Navbar";
import "./style.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

// Assets
import hamburgerMenu from "../../assets/hamburger-menu.svg";
import searchIcon from "../../assets/search-icon.svg";

function Navigation() {
  const handleSidebarToggle = () => {
    document.querySelector("#sidebar .sub-menu-container").classList.toggle("d-none");
  };

  return (
    <Navbar className="shadow-sm">
      <Container fluid>
        <Navbar.Brand>
          <Button variant="outline-light" onClick={handleSidebarToggle}>
            <img src={hamburgerMenu} />
          </Button>
        </Navbar.Brand>
        <Form className="d-flex ms-auto">
          <InputGroup>
            <InputGroup.Text>
              <img src={searchIcon} alt="search icon" />
            </InputGroup.Text>
            <Form.Control placeholder="Search" aria-label="Search" aria-describedby="search" />
            <Button variant="outline-primary">Search</Button>
          </InputGroup>
        </Form>
        <DropdownButton align="end" title="Admin" id="dropdown-menu-align-end">
          <Dropdown.Item eventKey="1" onClick={() => localStorage.clear()} href="/">
            Logout
          </Dropdown.Item>
        </DropdownButton>
      </Container>
    </Navbar>
  );
}

export default Navigation;
