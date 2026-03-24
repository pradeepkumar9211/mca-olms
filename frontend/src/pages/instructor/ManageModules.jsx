import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorLayout from "../../components/common/InstructorLayout";
import Loader from "../../components/common/Loader";
import ModuleItem from "../../components/instructor/ModuleItem";
import ModuleForm from "../../components/instructor/ModuleForm";
import { getCourseModules, createModule, updateModule, deleteModule, getCourseById } from "../../api/courseApi";

function ManageModules() {
  const { id: course_id }   = useParams();
  const [modules, setModules]     = useState([]);
  const [course, setCourse]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // editingModule -- if set, ModuleForm shows in edit mode
  const [editingModule, setEditingModule] = useState(null);

  const fetchModules = async () => {
    try {
      const [modRes, courseRes] = await Promise.all([
        getCourseModules(course_id),
        getCourseById(course_id),
      ]);
      setModules(modRes.data.data || []);
      setCourse(courseRes.data.data);
    } catch {
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModules(); }, [course_id]);

  // called when add form is submitted
  const handleAddModule = async (data) => {
    setSubmitting(true);
    try {
      await createModule(course_id, data);
      toast.success("Module added successfully!");
      fetchModules();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add module");
    } finally {
      setSubmitting(false);
    }
  };

  // called when edit form is submitted
  const handleUpdateModule = async (data) => {
    setSubmitting(true);
    try {
      await updateModule(course_id, editingModule.content_id, data);
      toast.success("Module updated successfully!");
      setEditingModule(null); // exit edit mode
      fetchModules();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update module");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (content_id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await deleteModule(course_id, content_id);
      toast.success("Module deleted");
      // if deleted module was being edited, clear edit mode
      if (editingModule?.content_id === content_id) setEditingModule(null);
      fetchModules();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete module");
    }
  };

  if (loading) return <InstructorLayout><Loader /></InstructorLayout>;

  return (
    <InstructorLayout>
      <div className="p-8 max-w-3xl">

        {/* header */}
        <div className="mb-2">
          <Link to="/instructor/courses" className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back to courses
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Manage modules</h1>
        {course && <p className="text-gray-500 text-sm mb-6">{course.title}</p>}

        {/* module list */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Course modules ({modules.length})
          </h2>
          {modules.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No modules yet — add your first module below
            </p>
          ) : (
            <div className="space-y-2">
              {modules.map((mod) => (
                <ModuleItem
                  key={mod.content_id}
                  module={mod}
                  onDelete={handleDeleteModule}
                  onEdit={(module) => setEditingModule(module)}
                />
              ))}
            </div>
          )}
        </div>

        {/* form -- switches between add and edit mode */}
        <ModuleForm
          onSubmit={editingModule ? handleUpdateModule : handleAddModule}
          loading={submitting}
          editData={editingModule}
          onCancel={() => setEditingModule(null)}
        />
      </div>
    </InstructorLayout>
  );
}

export default ManageModules;
// ```

// **How the edit flow works now:**
// ```
// Instructor sees module list
//   → clicks Edit on a module
//   → ModuleForm at bottom switches to yellow "Edit mode" prefilled with module data
//   → instructor updates fields and clicks "Update module"
//   → module updates, form switches back to "Add mode" automatically
//   → if instructor changes their mind, clicks Cancel → back to Add mode