import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

// Contents
import Dashboard from "./pages/dashboard";
import ListCar from "./pages/list-car";
import CarForm from "./pages/car-form";
import Login from "./pages/login/LoginAdmin";
import Auth from "./auth/Auth";

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
        element: <Auth element={<Login />} />,
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
        children: [
            {
                path: "list-car",
                element: <Auth element={<ListCar />} />,
                children: [
                    {
                        path: "add-new-car",
                        element: <Auth element={<CarForm mode={"Add"} />} />,
                    },
                    {
                        path: "edit-car",
                        element: <Auth element={<CarForm mode={"Edit"} />} />,
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
