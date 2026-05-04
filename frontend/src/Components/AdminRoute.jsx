import { Navigate } from "react-router-dom";
import { isAdmin, getTokenPayload } from "../api";

const AdminRoute = ({ children }) => {
    const payload = getTokenPayload("admin");

    if (!payload) return <Navigate to="/admin" replace />;
    if (!isAdmin()) return <Navigate to="/" replace />;

    return children;
};

export default AdminRoute;