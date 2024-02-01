import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

// Contents
import DashboardMenu from "./pages/dashboard-menu/dashboard";
import CarsMenu from "./pages/cars-menu/cars";
import Dashboard from "./pages/dashboard";
import ListCar from "./pages/list-car";
import Login from "./pages/login/LoginAdmin";
import Auth from "./auth/auth";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Navigate to="/login" replace={true} />
            </>
        ),
    },
    {
        path: "/login",
        element: localStorage.getItem("token") ? (
            <Navigate to="/dashboard" replace={true} />
        ) : (
            <Login />
        ),
    },
    {
        path: "/dashboard",
        element: (
            <>
                <Navigate to="/dashboard/dashboard" replace={true} />
            </>
        ),
    },
    {
        path: "/dashboard",
        element: <Auth element={<DashboardMenu />} />,
        children: [
            {
                path: "dashboard",
                element: <Auth element={<Dashboard />} />,
            },
        ],
    },
    {
        path: "/cars",
        element: (
            <>
                <Navigate to="/cars/list-car" replace={true} />
            </>
        ),
    },
    {
        path: "/cars",
        element: <Auth element={<CarsMenu />} />,
        children: [
            {
                path: "list-car/*",
                element: <ListCar />,
                children: [
                    {
                        path: "add-new-car",
                        element: <ListCar />,
                    },
                    {
                        path: "edit-car",
                        element: <ListCar />,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
