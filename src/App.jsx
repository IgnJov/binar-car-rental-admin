import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Contents
import Dashboard from "./pages/dashboard";
import LoginAdmin from "./pages/login/LoginAdmin";

const router = createBrowserRouter([
  {
    path: "/dashboard/dashboard/login",
    element: <LoginAdmin />,
  },
  {
    path: "/dashboard/dashboard",
    element: <Dashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
