import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorLayout from "../../components/common/InstructorLayout";
import CourseForm from "../../components/instructor/CourseForm";
import Loader from "../../components/common/Loader";
import { getCourseById, updateCourse } from "../../api/courseApi";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCourseById(id)
      .then((res) => setCourse(res.data.data))
      .catch(() => toast.error("Failed to load course"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await updateCourse(id, data);
      toast.success("Course updated successfully!");
      navigate("/instructor/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <InstructorLayout><Loader /></InstructorLayout>;

  return (
    <InstructorLayout>
      <div className="p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit course</h1>
          <p className="text-gray-500 text-sm mt-1">Update your course details</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <CourseForm
            initialData={course}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </div>
      </div>
    </InstructorLayout>
  );
}

export default EditCourse;