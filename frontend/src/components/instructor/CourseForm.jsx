import { useState, useEffect } from "react";
import { getAllCategories } from "../../api/categoryApi";

function CourseForm({ initialData = {}, onSubmit, loading }) {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        thumbnail: initialData.thumbnail || "",
        category_id: initialData.category_id || "",
    });

    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data.data || []))
            .catch(() => { });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, price: parseFloat(form.price) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Course title"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Course description"
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0 for free"
                        required
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                    name="thumbnail"
                    value={form.thumbnail}
                    onChange={handleChange}
                    placeholder="https://..."
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {loading ? "Saving..." : "Save Course"}
            </button>
        </form>
    );
}

export default CourseForm;