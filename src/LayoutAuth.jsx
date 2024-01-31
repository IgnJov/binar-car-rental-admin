import { Navigate, Outlet } from "react-router";

const LayoutAuth = () => {
  const token = localStorage.getItem("token");
  console.log("token", !token);
  return <>{!token ? <Outlet /> : <Navigate to="/dashboard" />}</>;
};

export default LayoutAuth;
