import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// protects routes based on auth + role
// usage: <ProtectedRoute role="student"> <StudentDashboard /> </ProtectedRoute>
function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    // not logged in -- redirect to login
    if (!user) return <Navigate to="/login" replace />;

    // logged in but wrong role -- redirect to their own dashboard
    if (role && user.role !== role) {
        if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
        if (user.role === "instructor") return <Navigate to="/instructor/dashboard" replace />;
        if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;