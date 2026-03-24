import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/common/AdminLayout";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";
import { getAllStudents, deleteStudent } from "../../api/adminApi";
import { formatDate } from "../../utils/formatDate";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = () => {
    getAllStudents()
      .then((res) => setStudents(res.data.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (student_id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(student_id);
      toast.success("Student deleted");
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const columns = [
    {
      key: "avatar",
      label: "",
      render: (row) => (
        <img
          src={row.avatar || "https://placehold.co/32x32?text=S"}
          alt={row.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "created_at",
      label: "Joined",
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => handleDelete(row.student_id)}
          className="text-xs text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 border border-red-200 transition-colors"
        >
          Delete
        </button>
      ),
    },
  ];

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Students</h1>
            <p className="text-gray-500 text-sm mt-1">{students.length} total students</p>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={students}
          emptyMessage="No students found"
        />
      </div>
    </AdminLayout>
  );
}

export default ManageStudents;