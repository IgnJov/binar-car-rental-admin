import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Contents
import Dashboard from "./pages/dashboard";
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
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
