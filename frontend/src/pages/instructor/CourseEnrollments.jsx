import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import InstructorLayout from "../../components/common/InstructorLayout";
import Loader from "../../components/common/Loader";
import ProgressBar from "../../components/common/ProgressBar";
import { getCourseEnrollments } from "../../api/courseApi";
import { formatDate } from "../../utils/formatDate";

function CourseEnrollments() {
  const { id: course_id } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseEnrollments(course_id)
      .then((res) => setEnrollments(res.data.data || []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [course_id]);

  if (loading) return <InstructorLayout><Loader /></InstructorLayout>;

  return (
    <InstructorLayout>
      <div className="p-8">
        <div className="mb-2">
          <Link
            to="/instructor/courses"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Back to courses
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Enrolled students ({enrollments.length})
        </h1>

        {enrollments.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No students enrolled yet
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Student</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Enrolled on</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium w-48">Progress</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.enrollment_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={e.avatar || "https://placehold.co/32x32?text=S"}
                          alt={e.student_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800">{e.student_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{e.email}</td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(e.enrollment_date)}</td>
                    <td className="px-4 py-3">
                      <ProgressBar percent={e.progress_percent || 0} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}

export default CourseEnrollments;