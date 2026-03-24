import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const navLinks = [
    { to: "/student/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/student/enrollments", label: "My Learning", icon: "📚" },
    { to: "/student/wishlist", label: "Wishlist", icon: "❤️" },
    { to: "/student/payments", label: "Payment History", icon: "💳" },
    { to: "/student/profile", label: "Profile", icon: "👤" },
];

function StudentLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* sidebar */}
            <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30">
                {/* logo */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <span className="text-blue-600 font-bold text-xl">OLMS</span>
                    <p className="text-xs text-gray-400 mt-0.5">Student Panel</p>
                </div>

                {/* user info */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.avatar || "https://placehold.co/40x40?text=S"}
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}

                    {/* browse courses link */}
                    <NavLink
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <span>🔍</span>
                        <span>Browse Courses</span>
                    </NavLink>
                </nav>

                {/* logout */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* main content -- offset by sidebar width */}
            <main className="flex-1 ml-56 min-h-screen">
                {children}
            </main>
        </div>
    );
}

export default StudentLayout;