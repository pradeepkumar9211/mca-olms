import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Navbar from "../../components/common/Navbar";
import StudentLayout from "../../components/common/StudentLayout";
import Loader from "../../components/common/Loader";
import ProgressBar from "../../components/common/ProgressBar";
import { getStudentDashboard } from "../../api/dashboardApi";
import { formatDate } from "../../utils/formatDate";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50"><Loader /></div>;

  return (
    <StudentLayout>


      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {data?.student?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here's your learning overview</p>
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-gray-500 text-sm">Enrolled courses</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{data?.total_enrollments || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-gray-500 text-sm">Avg progress</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{data?.avg_progress || 0}%</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-gray-500 text-sm">Wishlist</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{data?.total_wishlist || 0}</p>
            </div>
          </div>

          {/* recent courses */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Recent courses</h2>
              <Link to="/student/enrollments" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            {!data?.recent_courses?.length ? (
              <div className="text-center py-10 text-gray-400">
                <p>You haven't enrolled in any courses yet</p>
                <Link to="/" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  Browse courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recent_courses.map((course) => (
                  <div key={course.course_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <img
                      src={course.thumbnail || "https://placehold.co/80x60?text=Course"}
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{course.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Enrolled {formatDate(course.enrollment_date)}</p>
                      <div className="mt-2">
                        <ProgressBar percent={course.progress_percent || 0} />
                      </div>
                    </div>
                    <Link
                      to={`/student/learn/${course.course_id}`}
                      className="text-sm text-blue-600 hover:underline flex-shrink-0"
                    >
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentDashboard;