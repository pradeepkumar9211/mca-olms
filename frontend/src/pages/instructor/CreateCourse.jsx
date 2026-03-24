import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorLayout from "../../components/common/InstructorLayout";
import CourseForm from "../../components/instructor/CourseForm";
import { createCourse } from "../../api/courseApi";

function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await createCourse(data);
      toast.success("Course created successfully!");
      navigate("/instructor/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstructorLayout>
      <div className="p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create new course</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details below</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <CourseForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </InstructorLayout>
  );
}

export default CreateCourse;