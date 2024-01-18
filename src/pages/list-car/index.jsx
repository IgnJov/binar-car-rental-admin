// Components
import Sidebar from "../../components/sidebar";
import Navigation from "../../components/navigation";
import EnhancedBreadCrumb from "../../components/enhanced-breadcrumb";
import CarCard from "../../components/car-card";

// Libraries
import { useEffect, useState } from "react";
import Axios from "axios";

const ListCar = () => {
    // Global Data
    const token =
        localStorage.getItem("access_token") ??
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJjci5pbyIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY2NTI0MjUwOX0.ZTx8L1MqJ4Az8KzoeYU2S614EQPnqk6Owv03PUSnkzc";
    const headers = {
        Access_token: token,
    };

    const carCategory = {
        small: "2 - 4 people",
        medium: "4 - 6 people",
        large: "6 - 8 people",
    };

    // State
    const [selectedCapacity, setSelectedCapacity] = useState("all"); // ["all", "small", "medium", "large"]
    const [cars, setCars] = useState([]);
    const [params, setParams] = useState({
        name: "",
        page: 1,
        pageSize: 10,
    });

    // Lifecycle
    useEffect(() => {
        getCars();
    }, []);

    useEffect(() => {
        populateCarList();
    }, [selectedCapacity]);

    // API
    const getCars = () => {
        const options = {
            method: "GET",
            url: "https://api-car-rental.binaracademy.org/admin/v2/car",
            params,
            headers,
        };

        Axios.request(options)
            .then((response) => {
                const filteredData = response.data.cars.filter((car) => {
                    return selectedCapacity === "all"
                        ? true
                        : car.category === selectedCapacity;
                });

                setCars(filteredData);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const populateCarList = () => {
        const filteredData = cars.filter((car) => {
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
                    <CarCard car={car} />
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

    return (
        <>
            <div id="list-car">
                <div className="row vh-100 m-0 p-0">
                    <Sidebar />
                    <div className="col m-0 p-0">
                        <Navigation />
                        <EnhancedBreadCrumb />
                        <div
                            id="list-car-content"
                            className="container-fluid pt-4 overflow-auto"
                            style={{
                                maxHeight: "calc(100vh - 136px)",
                            }}
                        >
                            <div className="car-capacity-button-container mb-4">
                                {populateCarCapacityButton()}
                            </div>
                            <div className="row g-4">{populateCarList()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListCar;
