import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const adminJson = sessionStorage.getItem("adminUser");
    const admin = adminJson ? JSON.parse(adminJson) : null;
    const adminRole = admin?.rol || admin?.Rol;

    if (!admin || adminRole !== "Admin") {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default AdminRoute;