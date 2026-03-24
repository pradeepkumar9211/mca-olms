import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/common/AdminLayout";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllCoursesAdmin, toggleCourseApproval } from "../../api/adminApi";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    getAllCoursesAdmin()
      .then((res) => setCourses(res.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleToggleApproval = async (course_id) => {
    try {
      await toggleCourseApproval(course_id);
      toast.success("Course status updated");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const columns = [
    {
      key: "thumbnail",
      label: "",
      render: (row) => (
        <img
          src={row.thumbnail || "https://placehold.co/60x40?text=C"}
          alt={row.title}
          className="w-14 h-10 object-cover rounded-lg"
        />
      ),
    },
    {
      key: "title",
      label: "Course",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{row.title}</p>
          <p className="text-xs text-gray-400">{row.category_name}</p>
        </div>
      ),
    },
    { key: "instructor_name", label: "Instructor" },
    {
      key: "price",
      label: "Price",
      render: (row) => formatPrice(row.price),
    },
    {
      key: "total_enrollments",
      label: "Enrollments",
      render: (row) => row.total_enrollments || 0,
    },
    {
      key: "is_published",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.is_published ? "published" : "unpublished"} />
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => handleToggleApproval(row.course_id)}
          className={`text-xs px-3 py-1 rounded-lg border transition-colors ${row.is_published
              ? "text-red-500 border-red-200 hover:bg-red-50"
              : "text-green-600 border-green-200 hover:bg-green-50"
            }`}
        >
          {row.is_published ? "Remove" : "Approve"}
        </button>
      ),
    },
  ];

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">{courses.length} total courses</p>
        </div>
        <DataTable
          columns={columns}
          data={courses}
          emptyMessage="No courses found"
        />
      </div>
    </AdminLayout>
  );
}

export default ManageCourses;