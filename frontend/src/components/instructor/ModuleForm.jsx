import { useState, useEffect } from "react";

// works for both add and edit
// if editData is passed -- prefills form and shows update mode
function ModuleForm({ onSubmit, loading, editData = null, onCancel }) {
    const [form, setForm] = useState({
        title: "",
        content_type: "video",
        video_url: "",
        file_url: "",
        duration: "",
    });

    // prefill form when editing
    useEffect(() => {
        if (editData) {
            setForm({
                title: editData.title || "",
                content_type: editData.content_type || "video",
                video_url: editData.video_url || "",
                file_url: editData.file_url || "",
                duration: editData.duration || "",
            });
        } else {
            // reset form when switching back to add mode
            setForm({
                title: "",
                content_type: "video",
                video_url: "",
                file_url: "",
                duration: "",
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            title: form.title,
            content_type: form.content_type,
            duration: form.duration || null,
            video_url: form.content_type === "video" ? form.video_url : null,
            file_url: form.content_type === "document" ? form.file_url : null,
        };
        onSubmit(data);
    };

    const isEditing = !!editData;

    return (
        <form
            onSubmit={handleSubmit}
            className={`space-y-4 p-4 rounded-xl border ${isEditing
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                    {isEditing ? "✏️ Edit module" : "Add new module"}
                </h3>
                {isEditing && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-xs text-gray-400 hover:text-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Module title"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content type</label>
                    <select
                        name="content_type"
                        value={form.content_type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="video">Video</option>
                        <option value="document">Document (PDF)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (optional)</label>
                    <input
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        placeholder="e.g. 00:10:30"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* show correct url field based on content_type */}
            {form.content_type === "video" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                    <input
                        name="video_url"
                        value={form.video_url}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            {form.content_type === "document" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PDF URL</label>
                    <input
                        name="file_url"
                        value={form.file_url}
                        onChange={handleChange}
                        placeholder="https://example.com/document.pdf"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-2 rounded-lg font-medium disabled:opacity-50 transition-colors ${isEditing
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {loading
                    ? isEditing ? "Updating..." : "Adding..."
                    : isEditing ? "Update module" : "Add module"
                }
            </button>
        </form>
    );
}

export default ModuleForm;