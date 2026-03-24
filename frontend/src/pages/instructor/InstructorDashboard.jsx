import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InstructorLayout from "../../components/common/InstructorLayout";
import Loader from "../../components/common/Loader";
import { getInstructorDashboard } from "../../api/dashboardApi";

function InstructorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInstructorDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <InstructorLayout><Loader /></InstructorLayout>;

  return (
    <InstructorLayout>
      <div className="p-8">
        {/* welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {data?.instructor?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's your teaching overview</p>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-500 text-sm">Total courses</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{data?.total_courses || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-500 text-sm">Total enrollments</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{data?.total_enrollments || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-500 text-sm">Avg rating</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {data?.avg_rating || 0} ★
            </p>
          </div>
        </div>

        {/* quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/instructor/courses/create"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Create new course
            </Link>
            <Link
              to="/instructor/courses"
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Manage courses
            </Link>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
}

export default InstructorDashboard;