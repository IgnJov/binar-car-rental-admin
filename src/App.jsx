import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Dashboard from "./pages/dashboard";
import ListCar from "./pages/list-car";

const router = createBrowserRouter([
    {
        path: "/dashboard/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/cars/list-car",
        element: <ListCar />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
