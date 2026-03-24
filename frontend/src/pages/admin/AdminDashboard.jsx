import { useState, useEffect } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/admin/StatCard";
import { getAdminDashboard } from "../../api/adminApi";
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview</p>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total students"
            value={data?.total_students}
            icon="🎓"
            color="blue"
          />
          <StatCard
            label="Total instructors"
            value={data?.total_instructors}
            icon="👨‍🏫"
            color="green"
          />
          <StatCard
            label="Total courses"
            value={data?.total_courses}
            icon="📚"
            color="purple"
          />
          <StatCard
            label="Total enrollments"
            value={data?.total_enrollments}
            icon="📋"
            color="orange"
          />
          <StatCard
            label="Total revenue"
            value={formatPrice(data?.total_revenue || 0)}
            icon="💰"
            color="green"
          />
        </div>

        {/* quick links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Manage students", to: "/admin/students", icon: "🎓" },
              { label: "Manage instructors", to: "/admin/instructors", icon: "👨‍🏫" },
              { label: "Manage courses", to: "/admin/courses", icon: "📚" },
              { label: "View payments", to: "/admin/payments", icon: "💳" },
              { label: "Manage reviews", to: "/admin/reviews", icon: "⭐" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-gray-600 text-center">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout >
  );
}

export default AdminDashboard;