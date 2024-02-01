import PropTypes from "prop-types";

import Login from "../pages/login/LoginAdmin";

const Auth = ({ element }) => {
    const token = localStorage.getItem("token");
    return token ? element : <Login />;
};

Auth.propTypes = {
    element: PropTypes.element.isRequired,
};

export default Auth;
