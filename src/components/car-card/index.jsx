// Assets
import peopleCategory from "../../assets/people-category-icon.svg";
import editIcon from "../../assets/edit-icon.svg";
import trashCan from "../../assets/trash-can.svg";
import clock from "../../assets/clock.svg";
import carImagePlaceholder from "../../assets/car-image-placeholder.jpg";

// Libraries
import moment from "moment";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car, setModalState, setSelectedCar }) => {
    const navigate = useNavigate();

    // Global Data
    const carCategory = {
        small: "2 - 4 people",
        medium: "4 - 6 people",
        large: "6 - 8 people",
    };

    const replaceImageOnError = (e) => {
        e.target.src = carImagePlaceholder;
    };

    const getAmountOfPeople = (category) => {
        return carCategory[category] || "";
    };

    const handleClose = () => {
        setModalState(false);
    };

    const handleShow = () => {
        setModalState(true);
    };

    return (
        <>
            <div className="card">
                <div
                    className="p-3"
                    style={{ height: "222px", overflow: "hidden" }}
                >
                    <img
                        onError={replaceImageOnError}
                        className="card-img-top w-100"
                        style={{ objectFit: "cover" }}
                        src={car.image || carImagePlaceholder}
                        alt="Car Image"
                    />
                </div>
                <div className="card-body">
                    <p className="card-subtitle mb-2">
                        {car.name || car.type || "Invalid Name"}
                    </p>
                    <h5 className="card-title mb-3 fs-5">
                        {`Rp ${Intl.NumberFormat("es-ED").format(
                            car.price
                        )} / hari`}
                    </h5>
                    <p
                        className="card-text mb-4"
                        style={{
                            fontSize: "14px",
                        }}
                    >
                        <span className="d-block mb-2">
                            <img
                                className="me-2"
                                src={peopleCategory}
                                alt="People Category"
                            />
                            {getAmountOfPeople(car.category)}
                        </span>
                        <span className="d-block">
                            <img className="me-2" src={clock} alt="Clock" />
                            {"Updated at " +
                                moment(car.updatedAt).format(
                                    "D MMM YYYY, hh.mm"
                                )}
                        </span>
                    </p>
                    <div className="row d-flex justify-content-between">
                        <div className="col">
                            <button
                                className="w-100 btn btn-outline-danger fw-bold"
                                style={{
                                    fontSize: "14px",
                                }}
                                onClick={() => {
                                    setSelectedCar(car);
                                    handleShow();
                                }}
                            >
                                <img className="me-2" src={trashCan} />
                                Delete
                            </button>
                        </div>
                        <div className="col">
                            <button
                                className="w-100 btn text-white fw-bold"
                                style={{
                                    backgroundColor: "#5CB85F",
                                    fontSize: "14px",
                                }}
                                onClick={() => {
                                    navigate(
                                        `/cars/list-car/edit-car?id=${car.id}`
                                    );
                                }}
                            >
                                <img className="me-2" src={editIcon} />
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CarCard;
