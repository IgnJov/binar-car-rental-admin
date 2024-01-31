import { Navigate, Outlet } from "react-router";

const LayoutDashboard = () => {
    const token = localStorage.getItem("token");
    return <>{token ? <Outlet /> : <Navigate to="/" />}</>;
};

export default LayoutDashboard;
