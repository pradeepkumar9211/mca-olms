import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/common/AdminLayout";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllInstructors, toggleInstructorVerify, deleteInstructor } from "../../api/adminApi";
import { formatDate } from "../../utils/formatDate";

function ManageInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructors = () => {
    getAllInstructors()
      .then((res) => setInstructors(res.data.data || []))
      .catch(() => setInstructors([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInstructors(); }, []);

  const handleToggleVerify = async (instructor_id) => {
    try {
      await toggleInstructorVerify(instructor_id);
      toast.success("Instructor verification updated");
      fetchInstructors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async (instructor_id) => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) return;
    try {
      await deleteInstructor(instructor_id);
      toast.success("Instructor deleted");
      fetchInstructors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "skills",
      label: "Skills",
      render: (row) => (
        <span className="text-xs text-gray-500 line-clamp-1">{row.skills}</span>
      ),
    },
    {
      key: "is_verified",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.is_verified ? "verified" : "unverified"} />
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleVerify(row.instructor_id)}
            className={`text-xs px-3 py-1 rounded-lg border transition-colors ${row.is_verified
                ? "text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                : "text-green-600 border-green-200 hover:bg-green-50"
              }`}
          >
            {row.is_verified ? "Revoke" : "Verify"}
          </button>
          <button
            onClick={() => handleDelete(row.instructor_id)}
            className="text-xs text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 border border-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Instructors</h1>
          <p className="text-gray-500 text-sm mt-1">{instructors.length} total instructors</p>
        </div>
        <DataTable
          columns={columns}
          data={instructors}
          emptyMessage="No instructors found"
        />
      </div>
    </AdminLayout>
  );
}

export default ManageInstructors;