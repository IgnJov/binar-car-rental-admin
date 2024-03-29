// Components
import Sidebar from "../../components/sidebar";
import Navigation from "../../components/navigation";
import EnhancedBreadCrumb from "../../components/enhanced-breadcrumb";
import CarCard from "../../components/car-card";
import CarForm from "../car-form";

// Libraries
import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate, useRoutes } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { useSelector, useDispatch } from "react-redux";

// Assets
import addIcon from "../../assets/add-icon.svg";
import carLeave from "../../assets/car-leave.png";
import * as constant from "../../constants";

// Redux
import {
    fetchCarsRequest,
    fetchCarsSuccess,
    fetchCarsFailure,
    selectCar,
    deselectCar,
} from "../../redux/slices/carSlice";

const ListCar = () => {
    // Hooks
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Global Data
    const token = localStorage.getItem("token");
    const headers = {
        Access_token: token,
    };

    const carCategory = {
        small: "2 - 4 people",
        medium: "4 - 6 people",
        large: "6 - 8 people",
    };

    // Slice
    const car = useSelector((state) => state.car);

    // State
    const [selectedCapacity, setSelectedCapacity] = useState("all"); // ["all", "small", "medium", "large"]
    const [filteredCars, setFilteredCars] = useState([]);
    const [params, setParams] = useState({
        name: "",
        page: 1,
        pageSize: 10,
    });
    const [show, setShow] = useState(false);
    const [pagination, setPagination] = useState({});

    // Lifecycle
    useEffect(() => {
        getCars();
    }, []);

    useEffect(() => {
        getCars();
    }, [params]);

    useEffect(() => {
        populateCarList();
    }, [selectedCapacity]);

    useEffect(() => {
        renderPagination();
    }, [pagination]);

    // API
    const getCars = () => {
        dispatch(fetchCarsRequest);

        const options = {
            method: "GET",
            url: constant.API_ENDPOINT.getCars,
            params,
            headers,
        };

        Axios.request(options)
            .then((response) => {
                // Set Cars state in reducer
                dispatch(fetchCarsSuccess(response.data.cars));

                // Set Pagination
                setPagination({
                    page: response.data.page,
                    pageCount: response.data.pageCount,
                    count: response.data.count,
                });

                // Filter by capacity
                let filteredData = response.data.cars.filter((car) => {
                    return selectedCapacity === "all"
                        ? true
                        : car.category === selectedCapacity;
                });

                // Filter by name
                const name = new URLSearchParams(window.location.search).get(
                    "name"
                );
                if (name) {
                    filteredData = filteredData.filter((car) => {
                        return car.name
                            ?.toLowerCase()
                            .includes(name.toLowerCase());
                    });
                }

                setFilteredCars(filteredData);
            })
            .catch((error) => {
                dispatch(fetchCarsFailure(error.message));
                console.log(error);
            });
    };

    const deleteCarById = (id) => {
        renderConfirmationModal();

        const options = {
            method: "DELETE",
            url: `${constant.API_ENDPOINT.deleteCarById}/${id}`,
            headers,
        };

        Axios.request(options)
            .then((response) => {
                renderAlert("Data Berhasil Dihapus", "dark");
                getCars();
            })

            .catch((error) => {
                renderAlert("Data Gagal Dihapus", "danger");
            });
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => {
        setShow(true);
    };

    const renderConfirmationModal = () => {};

    const renderAlert = (message, status) => {
        const alert = document.createElement("div");
        alert.className = `alert alert-${status} text-center`;
        alert.setAttribute("role", "alert");
        alert.style.position = "absolute";
        alert.style.width = "550px";
        alert.innerHTML = message;

        // Center Alert
        alert.style.top = "15%";
        alert.style.left = "50%";
        alert.style.transform = "translate(-50%, -15%)";

        // Remove Alert
        setTimeout(() => {
            alert.remove();
        }, 3000);

        document.body.appendChild(alert);
    };

    const populateCarList = () => {
        const filteredData = filteredCars.filter((car) => {
            return selectedCapacity === "all"
                ? true
                : car.category === selectedCapacity;
        });

        return filteredData.map((car) => {
            return (
                <div
                    key={car.id}
                    className="col-3"
                    style={{ minWidth: "300px", maxWidth: "351px" }}
                >
                    <CarCard car={car} setModalState={setShow} />
                </div>
            );
        });
    };

    const populateCarCapacityButton = () => {
        const capacityButtons = [{ label: "All", value: "all" }];

        for (const category in carCategory) {
            capacityButtons.push({
                label: carCategory[category],
                value: category,
            });
        }

        return capacityButtons.map((button) => {
            return (
                <button
                    key={button.value}
                    className="btn btn-outline-primary me-3"
                    onClick={() => {
                        setSelectedCapacity(button.value);
                    }}
                >
                    {button.label}
                </button>
            );
        });
    };

    const renderPagination = () => {
        let active = params.page;
        let items = [];

        const generatePaginationItem = (i) => {
            return (
                <Pagination.Item
                    key={i}
                    active={i === active}
                    onClick={() => {
                        setParams({
                            ...params,
                            page: i,
                        });
                    }}
                >
                    {i}
                </Pagination.Item>
            );
        };

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => {
                    setParams({
                        ...params,
                        page: active - 1,
                    });
                }}
                disabled={active === 1}
            />
        );

        if (pagination.pageCount - params.page <= 5) {
            for (let i = active; i <= pagination.pageCount; i++) {
                items.push(generatePaginationItem(i));
            }
        } else {
            for (let i = active; i <= active + 3; i++) {
                items.push(generatePaginationItem(i));
            }

            items.push(
                <Pagination.Ellipsis
                    key="ellipsis"
                    onClick={() => {
                        setParams({
                            ...params,
                            page: active + 4,
                        });
                    }}
                />
            );
            items.push(generatePaginationItem(pagination.count));
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => {
                    setParams({
                        ...params,
                        page: active + 1,
                    });
                }}
                disabled={active === pagination.pageCount}
            />
        );

        return items;
    };

    const childRoutes = useRoutes([
        {
            path: "add-new-car",
            element: <CarForm mode="Add" />,
        },
        {
            path: "edit-car",
            element: <CarForm mode="Edit" />,
        },
    ]);

    return (
        childRoutes || (
            <>
                <div id="list-car">
                    <div className="row vh-100 m-0 p-0">
                        <Sidebar />
                        <div className="col m-0 p-0">
                            <Navigation />
                            <EnhancedBreadCrumb />
                            <div
                                id="list-car-content"
                                className="container-fluid ps-4 py-4 overflow-auto"
                                style={{
                                    height: "calc(100vh - 136px)",
                                }}
                            >
                                <div className="header mb-4">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <h3 className="fw-bold">
                                                List Car
                                            </h3>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-primary float-end"
                                                onClick={() => {
                                                    navigate(
                                                        "/cars/list-car/add-new-car"
                                                    );
                                                }}
                                            >
                                                <img
                                                    className="me-3"
                                                    src={addIcon}
                                                    alt=""
                                                />
                                                Add New Car
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-auto">
                                            {populateCarCapacityButton()}
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-4">
                                    {populateCarList()}
                                </div>
                                <div className="row mt-3 mx-1" id="pagination">
                                    <Pagination>
                                        {renderPagination()}
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Body className="px-4 py-4 text-center">
                        <img
                            src={carLeave}
                            alt="car leave"
                            style={{ width: "153px" }}
                            className="mb-4"
                        />
                        <h5 className="mb-4">Menghapus Data Mobil</h5>
                        <p className="mb-4" style={{ fontSize: "14px" }}>
                            Setelah dihapus, data mobil tidak dapat
                            dikembalikan. Yakin ingin menghapus?
                        </p>

                        <div className="modal-button-container w-100">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    handleClose();
                                    deleteCarById(car.selectedCar.id);
                                }}
                                style={{ width: "87px" }}
                                className="me-3"
                            >
                                Ya
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={handleClose}
                                style={{ width: "87px" }}
                            >
                                Tidak
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    );
};

export default ListCar;
