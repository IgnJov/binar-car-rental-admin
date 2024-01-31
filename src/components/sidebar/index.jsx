import "./style.css";

// Libraries
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import homeIcon from "../../assets/home-icon.svg";
import truckIcon from "../../assets/truck-icon.svg";

function Sidebar() {
    const navigate = useNavigate();

    //State
    const [selectedMenu, setSelectedMenu] = useState("Dashboard");
    const [menus, setMenus] = useState([
        {
            iconURL: homeIcon,
            text: "Dashboard",
        },
        {
            iconURL: truckIcon,
            text: "Cars",
        },
    ]);
    const [subMenus, setSubMenus] = useState([
        {
            menu: "Dashboard",
            subMenuItems: [
                {
                    text: "Dashboard",
                    url: "/dashboard/dashboard",
                },
            ],
        },
        {
            menu: "Cars",
            subMenuItems: [
                {
                    text: "List Car",
                    url: "/cars/list-car",
                },
            ],
        },
    ]);

    const getPathName = () => {
        return window.location.pathname.toLowerCase();
    };

    const populateMenuItem = () => {
        const handleMenuClick = (menu) => {
            setSelectedMenu(menu);
            const subMenuContainer = document.querySelector(
                ".sub-menu-container"
            );
            subMenuContainer.classList.remove("d-none");
        };

        return menus.map((item, index) => {
            return (
                <button
                    className={
                        "menu-item d-block w-100 border-0 py-3 px-1" +
                        (selectedMenu === item.text ? " is-active" : "")
                    }
                    key={index}
                    onClick={() => handleMenuClick(item.text)}
                >
                    <img
                        src={item.iconURL}
                        alt={`${item.text} icon`}
                        className={"d-block mx-auto"}
                    />
                    <span className="d-block text-white text-center">
                        {item.text}
                    </span>
                </button>
            );
        });
    };

    const populateSubMenuItem = () => {
        return subMenus
            .find((data) => data.menu === selectedMenu)
            .subMenuItems.map((item, index) => {
                return (
                    <button
                        className="sub-menu-item w-100 py-2 ps-4 border-0 text-start"
                        style={{
                            backgroundColor:
                                getPathName() == item.url ? "#CFD4ED" : "#fff",
                            pointer: "cursor",
                        }}
                        key={index}
                        onClick={() => navigate(item.url)}
                    >
                        <span className="fw-bold">{item.text}</span>
                    </button>
                );
            });
    };

    return (
        <div id="sidebar" className="col-auto m-0 p-0">
            <div id="sidebar-content" className="d-flex h-100">
                <div
                    className="menu-container"
                    style={{ backgroundColor: "#0D28A6" }}
                >
                    {populateMenuItem()}
                </div>
                <div
                    className="sub-menu-container d-none"
                    style={{ minWidth: "220px", marginTop: "80px" }}
                >
                    <p className="sub-menu-title fw-bold py-2 ps-4">
                        {selectedMenu.toUpperCase()}
                    </p>
                    {populateSubMenuItem()}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
