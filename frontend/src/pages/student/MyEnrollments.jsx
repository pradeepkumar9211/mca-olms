import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../components/common/StudentLayout";

import Loader from "../../components/common/Loader";
import ProgressBar from "../../components/common/ProgressBar";
import { getMyEnrollments } from "../../api/enrollmentApi";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEnrollments()
      .then((res) => setEnrollments(res.data.data || []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50"><Loader /></div>;

  return (
    <StudentLayout>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Learning</h1>

          {enrollments.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No enrolled courses yet</p>
              <Link to="/" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                Browse courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrollments.map((enroll) => (
                <div
                  key={enroll.enrollment_id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <img
                    src={enroll.thumbnail || "https://placehold.co/400x160?text=Course"}
                    alt={enroll.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {enroll.category_name}
                    </span>
                    <h3 className="text-gray-800 font-semibold mt-2 text-sm">{enroll.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">by {enroll.instructor_name}</p>
                    <div className="mt-3">
                      <ProgressBar percent={enroll.progress_percent || 0} />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-400">
                        {enroll.watched_modules}/{enroll.total_modules} modules
                      </span>
                      <Link
                        to={`/student/learn/${enroll.course_id}`}
                        className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {enroll.progress_percent > 0 ? "Continue" : "Start"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>

  );
}

export default MyEnrollments;