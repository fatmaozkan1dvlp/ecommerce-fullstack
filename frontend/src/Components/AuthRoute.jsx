import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api";

const AuthRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/giris" replace />;
    }
    return children;
};

export default AuthRoute;