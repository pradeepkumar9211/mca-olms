import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* logo */}
                <Link to="/" className="text-blue-600 font-bold text-xl">
                    OLMS
                </Link>

                {/* nav links based on role */}
                <div className="flex items-center gap-6 text-sm">
                    {!user && (
                        <>
                            <Link to="/" className="text-gray-600 hover:text-blue-600">Courses</Link>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                            <Link to="/signup/student" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Sign Up
                            </Link>
                        </>
                    )}

                    {role === "student" && (
                        <>
                            <Link to="/" className="text-gray-600 hover:text-blue-600">Courses</Link>
                            <Link to="/student/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                            <Link to="/student/enrollments" className="text-gray-600 hover:text-blue-600">My Learning</Link>
                            <Link to="/student/wishlist" className="text-gray-600 hover:text-blue-600">Wishlist</Link>
                            <Link to="/student/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
                        </>
                    )}

                    {role === "instructor" && (
                        <>
                            <Link to="/instructor/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                            <Link to="/instructor/courses" className="text-gray-600 hover:text-blue-600">My Courses</Link>
                            <Link to="/instructor/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
                        </>
                    )}

                    {role === "admin" && (
                        <>
                            <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                            <Link to="/admin/students" className="text-gray-600 hover:text-blue-600">Students</Link>
                            <Link to="/admin/instructors" className="text-gray-600 hover:text-blue-600">Instructors</Link>
                            <Link to="/admin/courses" className="text-gray-600 hover:text-blue-600">Courses</Link>
                        </>
                    )}

                    {user && (
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-xs">
                                Hi, {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;