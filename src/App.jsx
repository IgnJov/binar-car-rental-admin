import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Dashboard from "./pages/dashboard";
import ListCar from "./pages/list-car";
import CarForm from "./pages/car-form";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
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
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
