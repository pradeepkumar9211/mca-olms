import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/common/AdminLayout";
import Loader from "../../components/common/Loader";
import StarRating from "../../components/common/StarRating";
import { getAllCoursesAdmin, deleteReviewAdmin } from "../../api/adminApi";
import { getReviews } from "../../api/reviewApi";
import { formatDate } from "../../utils/formatDate";

function ManageReviews() {
    const [courses, setCourses] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // fetch all courses on mount so admin can pick one
    useEffect(() => {
        getAllCoursesAdmin()
            .then((res) => setCourses(res.data.data || []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    }, []);

    // fetch reviews when admin selects a course
    const fetchReviews = async (course) => {
        setSelectedCourse(course);
        setReviewsLoading(true);
        try {
            const res = await getReviews(course.course_id);
            setReviews(res.data.data?.reviews || []);
        } catch {
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleDeleteReview = async (review_id) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await deleteReviewAdmin(review_id);
            toast.success("Review deleted");
            // refresh reviews for selected course
            fetchReviews(selectedCourse);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete review");
        }
    };

    if (loading) return <AdminLayout><Loader /></AdminLayout>;

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Select a course to view and moderate its reviews
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* left -- course list */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-700">
                                    Select a course ({courses.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {courses.length === 0 ? (
                                    <p className="text-center py-8 text-gray-400 text-sm">
                                        No courses found
                                    </p>
                                ) : (
                                    courses.map((course) => (
                                        <button
                                            key={course.course_id}
                                            onClick={() => fetchReviews(course)}
                                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedCourse?.course_id === course.course_id
                                                    ? "bg-blue-50 border-l-4 border-blue-600"
                                                    : ""
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={course.thumbnail || "https://placehold.co/48x36?text=C"}
                                                    alt={course.title}
                                                    className="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {course.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {course.instructor_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* right -- reviews list */}
                    <div className="lg:col-span-2">
                        {!selectedCourse ? (
                            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-64 text-gray-400">
                                <div className="text-center">
                                    <p className="text-3xl mb-2">⭐</p>
                                    <p className="text-sm">Select a course to view its reviews</p>
                                </div>
                            </div>
                        ) : reviewsLoading ? (
                            <Loader />
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                                {/* selected course header */}
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="font-semibold text-gray-800 text-sm">
                                                {selectedCourse.title}
                                            </h2>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        {/* avg rating summary */}
                                        {reviews.length > 0 && (
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-yellow-500">
                                                    {(
                                                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                                                        reviews.length
                                                    ).toFixed(1)} ★
                                                </p>
                                                <p className="text-xs text-gray-400">avg rating</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* reviews */}
                                {reviews.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <p>No reviews yet for this course</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {reviews.map((review) => (
                                            <div key={review.review_id} className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <img
                                                            src={review.avatar || "https://placehold.co/36x36?text=S"}
                                                            alt={review.student_name}
                                                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {review.student_name}
                                                                </p>
                                                                <StarRating rating={review.rating} mode="display" />
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                {formatDate(review.review_date)}
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                {review.review_text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteReview(review.review_id)}
                                                        className="text-xs text-red-400 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 border border-red-200 transition-colors flex-shrink-0"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ManageReviews;
// ```

// **How it works:**
// ```
// Admin opens Reviews page
//   → sees all courses in left panel
//   → clicks any course
//   → right panel loads all reviews for that course
//   → each review shows student name, star rating, review text, date
//   → Delete button to moderate any review
//   → avg rating shown at top right of review panel