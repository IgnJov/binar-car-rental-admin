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

// Libraries
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        location.href = "/login";
    };

    return (
        <Navbar className="shadow-sm" id="navigation-bar">
            <Container fluid>
                <Navbar.Brand>
                    <Button
                        variant="outline-light"
                        onClick={handleSidebarToggle}
                    >
                        <img src={hamburgerMenu} />
                    </Button>
                </Navbar.Brand>
                <Form className="d-flex align-items-center">
                    <InputGroup
                        className="d-flex flex-row me-4"
                        style={{ minWidth: "300px" }}
                    >
                        <InputGroup.Text>
                            <img src={searchIcon} alt="search icon" />
                        </InputGroup.Text>
                        <Form.Control
                            style={{ width: "100px" }}
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
                    <InputGroup>
                        <InputGroupText
                            style={{
                                backgroundColor: "transparent",
                                border: "0",
                            }}
                            className="m-0 p-0 me-2"
                        >
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 38 38"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="19" cy="19" r="19" fill="#CFD4ED" />
                            </svg>
                        </InputGroupText>
                        <DropdownButton
                            id="dropdown-user"
                            variant="outline-dark"
                            title="Admin"
                            align="end"
                        >
                            <Dropdown.Item href="#" onClick={handleLogout}>
                                Logout
                            </Dropdown.Item>
                        </DropdownButton>
                    </InputGroup>
                </Form>
            </Container>
        </Navbar>
    );
}

export default Navigation;
