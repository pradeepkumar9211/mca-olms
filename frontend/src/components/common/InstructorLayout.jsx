import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const navLinks = [
  { to: "/instructor/dashboard",        label: "Dashboard",      icon: "🏠" },
  { to: "/instructor/courses",          label: "My Courses",     icon: "📚" },
  { to: "/instructor/courses/create",   label: "Create Course",  icon: "➕" },
  { to: "/instructor/profile",          label: "Profile",        icon: "👤" },
];

function InstructorLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // check if currently on a course-specific page
  // to show contextual sub-links in sidebar
  const courseIdMatch = location.pathname.match(/\/instructor\/courses\/([^/]+)\/(modules|enrollments)/);
  const activeCourseId = courseIdMatch ? courseIdMatch[1] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30">

        {/* logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-blue-600 font-bold text-xl">OLMS</span>
          <p className="text-xs text-gray-400 mt-0.5">Instructor Panel</p>
        </div>

        {/* user info */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-green-500 font-medium">Instructor</p>
            </div>
          </div>
        </div>

        {/* nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/instructor/courses"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}

          {/* contextual links -- show when on a specific course page */}
          {activeCourseId && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 px-3 mb-2">Current course</p>
              <NavLink
                to={`/instructor/courses/${activeCourseId}/modules`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span>🧩</span>
                <span>Manage Modules</span>
              </NavLink>
              <NavLink
                to={`/instructor/courses/${activeCourseId}/enrollments`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span>👥</span>
                <span>Enrollments</span>
              </NavLink>
            </div>
          )}
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

      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default InstructorLayout;
// ```

// **What changed and why:**

// The sidebar now has **3 permanent links** — Dashboard, My Courses, Create Course — so creating a course is always one click away without going through My Courses first.

// The **contextual section** at the bottom of nav is the key addition — when you're on a course-specific URL like `/instructor/courses/abc123/modules`, it reads the `course_id` from the current URL using `useLocation()` and dynamically shows **Manage Modules** and **Enrollments** links for that specific course. When you navigate away from a course page, those links disappear automatically.

// So the flow is now:
// ```
// My Courses → click Modules button on a course card
//   → sidebar shows "Manage Modules" + "Enrollments" for that course
//   → can switch between modules and enrollments without going back