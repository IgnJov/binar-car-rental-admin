import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Navbar from "react-bootstrap/Navbar";

// Assets
import hamburgerMenu from "../../assets/hamburger-menu.svg";
import searchIcon from "../../assets/search-icon.svg";

// Libraries
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigation() {
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const handleSidebarToggle = () => {
        document
            .querySelector("#sidebar .sub-menu-container")
            .classList.toggle("d-none");
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = () => {
        const queryString = search.trim() != "" ? `?name=${search}` : "";
        navigate(`/cars/list-car` + queryString);
        location.reload();
    };

    return (
        <Navbar className="shadow-sm">
            <Container fluid>
                <Navbar.Brand>
                    <Button
                        variant="outline-light"
                        onClick={handleSidebarToggle}
                    >
                        <img src={hamburgerMenu} />
                    </Button>
                </Navbar.Brand>
                <Form className="d-flex ms-auto">
                    <InputGroup>
                        <InputGroup.Text>
                            <img src={searchIcon} alt="search icon" />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search"
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSearchSubmit(e.target.value);
                                }
                            }}
                        />
                        <Button
                            variant="outline-primary"
                            onClick={handleSearchSubmit}
                        >
                            Search
                        </Button>
                    </InputGroup>
                </Form>
            </Container>
        </Navbar>
    );
}

export default Navigation;
