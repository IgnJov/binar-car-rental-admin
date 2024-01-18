import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Contents
import Dashboard from "./pages/dashboard";

const router = createBrowserRouter([
    {
        path: "/dashboard/dashboard",
        element: <Dashboard />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
