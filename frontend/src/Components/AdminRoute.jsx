import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || (user.Rol !== "Admin" && user.rol !== "Admin")) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default AdminRoute;