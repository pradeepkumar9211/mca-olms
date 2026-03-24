import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorLayout from "../../components/common/InstructorLayout";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getInstructorCourses, deleteCourse, togglePublish } from "../../api/courseApi";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    getInstructorCourses()
      .then((res) => setCourses(res.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleTogglePublish = async (course) => {
    try {
      await togglePublish(course.course_id);
      toast.success(course.is_published ? "Course unpublished" : "Course published!");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async (course_id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(course_id);
      toast.success("Course deleted");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <InstructorLayout><Loader /></InstructorLayout>;

  return (
    <InstructorLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <Link
            to="/instructor/courses/create"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Create course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No courses yet</p>
            <Link
              to="/instructor/courses/create"
              className="text-blue-600 text-sm hover:underline mt-2 inline-block"
            >
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center"
              >
                <img
                  src={course.thumbnail || "https://placehold.co/100x70?text=Course"}
                  alt={course.title}
                  className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-gray-800 text-sm">{course.title}</h3>
                    <StatusBadge status={course.is_published ? "published" : "unpublished"} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {course.category_name} • {formatPrice(course.price)} • {course.total_enrollments || 0} students
                  </p>
                  <p className="text-xs text-gray-400">Created {formatDate(course.created_at)}</p>
                </div>

                {/* action buttons */}
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTogglePublish(course)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${course.is_published
                        ? "border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                        : "border-green-300 text-green-600 hover:bg-green-50"
                      }`}
                  >
                    {course.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    to={`/instructor/courses/${course.course_id}/modules`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Modules
                  </Link>
                  <Link
                    to={`/instructor/courses/edit/${course.course_id}`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/instructor/courses/${course.course_id}/enrollments`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    Students
                  </Link>
                  <button
                    onClick={() => handleDelete(course.course_id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}

export default MyCourses;