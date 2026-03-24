import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { formatPrice } from "../../utils/formatPrice";

function CourseCard({ course }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/courses/${course.course_id}`)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
            {/* thumbnail */}
            <img
                src={course.thumbnail || "https://placehold.co/400x200?text=Course"}
                alt={course.title}
                className="w-full h-40 object-cover"
            />

            <div className="p-4">
                {/* category */}
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                    {course.category_name}
                </span>

                {/* title */}
                <h3 className="text-gray-800 font-semibold mt-2 text-sm line-clamp-2">
                    {course.title}
                </h3>

                {/* instructor */}
                <p className="text-gray-500 text-xs mt-1">
                    by {course.instructor_name}
                </p>

                {/* rating */}
                <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={Math.round(course.avg_rating || 0)} mode="display" />
                    <span className="text-xs text-gray-500">
                        ({course.total_reviews || 0})
                    </span>
                </div>

                {/* price + enrollments */}
                <div className="flex items-center justify-between mt-3">
                    <span className="text-blue-600 font-bold text-sm">
                        {formatPrice(course.price)}
                    </span>
                    <span className="text-xs text-gray-400">
                        {course.total_enrollments || 0} students
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;