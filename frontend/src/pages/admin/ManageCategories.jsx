import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/common/AdminLayout";
import Loader from "../../components/common/Loader";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../api/categoryApi";

function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // for create form
    const [newName, setNewName] = useState("");

    // for edit mode
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const fetchCategories = () => {
        getAllCategories()
            .then((res) => setCategories(res.data.data || []))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCategories(); }, []);

    // create new category
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setSubmitting(true);
        try {
            await createCategory({ name: newName.trim() });
            toast.success("Category created!");
            setNewName("");
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create category");
        } finally {
            setSubmitting(false);
        }
    };

    // start editing a category
    const handleEditStart = (category) => {
        setEditingId(category.category_id);
        setEditingName(category.name);
    };

    // cancel editing
    const handleEditCancel = () => {
        setEditingId(null);
        setEditingName("");
    };

    // save edited category
    const handleEditSave = async (category_id) => {
        if (!editingName.trim()) return;
        setSubmitting(true);
        try {
            await updateCategory(category_id, { name: editingName.trim() });
            toast.success("Category updated!");
            setEditingId(null);
            setEditingName("");
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update category");
        } finally {
            setSubmitting(false);
        }
    };

    // delete a category
    const handleDelete = async (category_id) => {
        if (!window.confirm("Delete this category? Courses using it may be affected.")) return;
        try {
            await deleteCategory(category_id);
            toast.success("Category deleted");
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete category");
        }
    };

    if (loading) return <AdminLayout><Loader /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="p-8 max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage course categories — instructors use these when creating courses
                    </p>
                </div>

                {/* create new category */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Add new category</h2>
                    <form onSubmit={handleCreate} className="flex gap-3">
                        <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Web Development"
                            required
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newName.trim()}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? "Adding..." : "Add"}
                        </button>
                    </form>
                </div>

                {/* categories list */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">
                            All categories ({categories.length})
                        </h2>
                    </div>

                    {categories.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No categories yet — add your first one above</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <div
                                    key={cat.category_id}
                                    className="flex items-center gap-3 px-4 py-3"
                                >
                                    {/* category icon */}
                                    <span className="text-lg">🏷️</span>

                                    {/* name -- switches to input on edit */}
                                    {editingId === cat.category_id ? (
                                        <input
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            autoFocus
                                            className="flex-1 border border-blue-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <span className="flex-1 text-sm text-gray-800 font-medium">
                                            {cat.name}
                                        </span>
                                    )}

                                    {/* action buttons */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        {editingId === cat.category_id ? (
                                            <>
                                                <button
                                                    onClick={() => handleEditSave(cat.category_id)}
                                                    disabled={submitting || !editingName.trim()}
                                                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                >
                                                    {submitting ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={handleEditCancel}
                                                    className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditStart(cat)}
                                                    className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.category_id)}
                                                    className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default ManageCategories;
// ```

// **How it works:**
// ```
// Admin opens Categories page
//   → sees all existing categories
//   → can add a new one using the form at top
//   → clicks Edit on any category → name becomes an input field inline
//   → saves or cancels edit
//   → Delete button with a confirmation prompt