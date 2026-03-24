import { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import CourseCard from "../../components/common/CourseCard";
import Loader from "../../components/common/Loader";
import { getAllCourses } from "../../api/courseApi";
import { getAllCategories } from "../../api/categoryApi";

function Home() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getAllCourses({ search, category_id: categoryId || undefined });
      setCourses(res.data.data || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* hero */}
      <div className="bg-blue-600 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Learn anything, anytime</h1>
          <p className="text-blue-100 mb-8">Browse courses from top instructors and start learning today</p>

          {/* search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-white text-gray-800 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-medium px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setCategoryId("")}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${categoryId === ""
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setCategoryId(cat.category_id)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${categoryId === cat.category_id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* courses grid */}
        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No courses found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{courses.length} courses found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {courses.map((course) => (
                <CourseCard key={course.course_id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;