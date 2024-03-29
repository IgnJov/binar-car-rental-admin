// Libraries
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import moment from "moment";

// Components
import Sidebar from "../../components/sidebar";
import Navigation from "../../components/navigation";
import EnhancedBreadCrumb from "../../components/enhanced-breadcrumb";

import * as constant from "../../constants";

import PropTypes from "prop-types";

const CarForm = ({ mode }) => {
    CarForm.propTypes = {
        mode: PropTypes.oneOf(["Add", "Edit"]),
    };

    const navigate = useNavigate();

    // Global Data
    const token = localStorage.getItem("token");
    const headers = {
        Access_token: token,
    };
    const carCategory = {
        small: "2 - 4 orang",
        medium: "4 - 6 orang",
        large: "6 - 8 orang",
    };

    // State
    const [car, setCar] = useState({
        name: "",
        category: "",
        price: "",
        status: false,
        image: "",
        createdAt: "-",
        updatedAt: "-",
    });

    // Lifecycle
    useEffect(() => {
        if (mode === "Edit") {
            getCarById();
        }
    }, []);

    useEffect(() => {
        if (mode === "Edit") {
            populateCarForm();
        }
    }, [car]);

    // API
    const getCarById = () => {
        let id = new URLSearchParams(window.location.search).get("id");

        const options = {
            method: "GET",
            url: `${constant.API_ENDPOINT.getCarById}/${id}`,
            headers,
        };

        Axios.request(options)
            .then((response) => {
                setCar(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const editCarDetail = () => {
        let id = new URLSearchParams(window.location.search).get("id");

        if (!validateForm()) return;

        const options = {
            method: "PUT",
            url: `${constant.API_ENDPOINT.updateCarById}/${id}`,
            headers,
            data: getDataFromForm(),
        };

        Axios.request(options)
            .then((response) => {
                renderAlert("Data Berhasil Disimpan", "success");
                window.location.href = "/cars/list-car";
            })

            .catch(() => {
                renderAlert("Data Gagal Disimpan", "danger");
            });
    };

    const addNewCar = () => {
        if (!validateForm()) return;

        const options = {
            method: "POST",
            url: constant.API_ENDPOINT.addCar,
            headers,
            data: getDataFromForm(),
        };

        Axios.request(options)
            .then((response) => {
                renderAlert("Data Berhasil Disimpan", "success");
                window.location.href = "/cars/list-car";
            })
            .catch((error) => {
                renderAlert(error.response.data.message, "danger");
            });

        resetForm();
    };

    const renderAlert = (message, status) => {
        // Create Alert
        const alert = document.createElement("div");
        alert.className = `alert alert-${status} text-center`;
        alert.setAttribute("role", "alert");
        alert.style.position = "absolute";
        alert.style.width = "550px";
        alert.innerHTML = message;

        // Position Alert
        alert.style.top = "15%";
        alert.style.left = "50%";
        alert.style.transform = "translate(-50%, -15%)";

        // Remove Alert
        setTimeout(() => {
            alert.remove();
        }, 3000);

        document.body.appendChild(alert);
    };

    const getDataFromForm = () => {
        let name = document.getElementById("name").value;
        let price = document.getElementById("price").value;
        let photo = handleFile(document.getElementById("photo"));
        let category = document.getElementById("category").value;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("status", car.status);
        formData.append("image", photo);

        return formData;
    };

    const validateForm = () => {
        let formData = getDataFromForm();

        if (
            formData.get("name") === "" ||
            formData.get("price") === "" ||
            formData.get("category") === "" ||
            formData.get("image") == ""
        ) {
            renderAlert("Data Tidak Boleh Kosong", "danger");

            return false;
        }

        return true;
    };

    const resetForm = () => {
        document.getElementById("car-form").reset();
        document.getElementById("photo").value = null;
    };

    const handleFile = (inputElement) => {
        let file = inputElement.files[0];

        if (!file) return "";

        return file;
    };

    const handleFormSubmit = () => {
        if (mode === "Add") addNewCar();
        else if (mode === "Edit") editCarDetail();
    };

    const populateCarForm = () => {
        document.getElementById("name").value = car.name;
        document.getElementById("price").value = car.price;
        document.getElementById("category").value = car.category;
        document.querySelector("#car-form .createdAt").innerHTML = moment(
            car.createdAt
        ).format("DD-MM-YYYY hh:mm");
        document.querySelector("#car-form .updatedAt").innerHTML = moment(
            car.updatedAt
        ).format("DD-MM-YYYY hh:mm");
    };

    const populateCarCategorySelection = () => {
        const options = [
            <option key="" value="">
                Pilih Kategori Mobil
            </option>,
        ];

        for (let category in carCategory) {
            options.push(
                <option key={category} value={category}>
                    {carCategory[category]}
                </option>
            );
        }

        return options;
    };

    return (
        <div id="list-car">
            <div className="row vh-100 m-0 p-0">
                <Sidebar />
                <div className="col m-0 p-0">
                    <Navigation />
                    <EnhancedBreadCrumb />
                    <div
                        id="list-car-content"
                        className="container-fluid pt-4 overflow-auto position-relative"
                        style={{
                            height: "calc(100vh - 136px)",
                        }}
                    >
                        <h3 className="car-form-title mx-2 mb-4">
                            {mode === "Add" ? "Add New Car" : "Edit Car"}
                        </h3>
                        <Form id="car-form" className="mx-2 p-3 border">
                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="name"
                            >
                                <Form.Label column sm={2}>
                                    Nama <span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Input Nama/Tipe Mobil"
                                    />
                                </Col>

                                <Form.Text className="text-muted"></Form.Text>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="price"
                            >
                                <Form.Label column sm={2}>
                                    Harga
                                    <span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        placeholder="Input Harga Sewa Mobil"
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="photo"
                            >
                                <Form.Label column sm={2}>
                                    Foto <span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        maxSize={2 * 1024 * 1024}
                                    />
                                    <Form.Text id="photoHelpBlock" muted>
                                        File size max. 2MB
                                    </Form.Text>
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                className="mb-3"
                                controlId="category"
                            >
                                <Form.Label column sm={2}>
                                    Kategori
                                    <span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Select defaultValue={""}>
                                        {populateCarCategorySelection()}
                                    </Form.Select>
                                </Col>
                            </Form.Group>

                            <Row className="mb-3">
                                <Col sm={2}>Created at</Col>
                                <Col sm={5}>
                                    <span className="createdAt">-</span>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={2}>Updated at</Col>
                                <Col sm={5}>
                                    <span className="updatedAt">-</span>
                                </Col>
                            </Row>
                        </Form>
                        <div className="button-container ms-2 mb-4 position-absolute bottom-0">
                            <Button
                                variant="outline-primary"
                                className="me-3"
                                onClick={() => {
                                    location.href = "/cars/list-car";
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleFormSubmit}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarForm;
