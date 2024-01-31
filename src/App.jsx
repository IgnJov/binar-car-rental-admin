import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Contents
import Dashboard from "./pages/dashboard";
import ListCar from "./pages/list-car";
import CarForm from "./pages/car-form";
import LoginAdmin from "./pages/login/LoginAdmin";
import LayoutAuth from "./LayoutAuth";
import LayoutDashboard from "./LayoutDashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutAuth />,
        children: [
            {
                path: "/",
                element: <LoginAdmin />,
            },
        ],
    },

    {
        element: <LayoutDashboard />,
        children: [
            {
                path: "/dashboard/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/cars/list-car",
                element: <ListCar />,
            },
            {
                path: "/cars/list-car/add-new-car",
                element: <CarForm mode={"Add"} />,
            },
            {
                path: "/cars/list-car/edit-car",
                element: <CarForm mode={"Edit"} />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
