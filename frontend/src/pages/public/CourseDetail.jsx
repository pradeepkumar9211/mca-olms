import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import StarRating from "../../components/common/StarRating";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";
import { getCourseById } from "../../api/courseApi";
import { getReviews } from "../../api/reviewApi";
import { initiatePayment, verifyPayment } from "../../api/paymentApi";
import { enrollCourse } from "../../api/enrollmentApi";
import { addToWishlist } from "../../api/wishlistApi";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";

function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, reviewRes] = await Promise.all([
          getCourseById(id),
          getReviews(id),
        ]);
        setCourse(courseRes.data.data);
        setReviews(reviewRes.data.data?.reviews || []);
      } catch {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { navigate("/login"); return; }
    setPaying(true);
    try {
      // initiate payment
      const initRes = await initiatePayment({ course_id: id });
      const payment_id = initRes.data.data.payment_id;

      // verify payment (simulation -- always succeeds)
      await verifyPayment({ payment_id });

      // enroll
      await enrollCourse({ course_id: id });

      toast.success("Enrolled successfully!");
      setPayModal(false);
      navigate(`/student/learn/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setPaying(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      await addToWishlist({ course_id: id });
      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader /></div>;
  if (!course) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="text-center py-20 text-gray-500">Course not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* course banner */}
      <div className="bg-gray-800 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
              {course.category_name}
            </span>
            <h1 className="text-2xl font-bold mt-3 mb-2">{course.title}</h1>
            <p className="text-gray-300 text-sm mb-4">{course.description}</p>
            <p className="text-gray-400 text-sm">by {course.instructor_name}</p>
            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={Math.round(course.avg_rating || 0)} mode="display" />
              <span className="text-gray-300 text-sm">
                {course.avg_rating || 0} ({course.total_reviews || 0} reviews)
              </span>
              <span className="text-gray-400 text-sm">
                • {course.total_enrollments || 0} students
              </span>
            </div>
          </div>

          {/* enroll card */}
          <div className="bg-white text-gray-800 rounded-xl p-5 h-fit">
            <img
              src={course.thumbnail || "https://placehold.co/400x200?text=Course"}
              alt={course.title}
              className="w-full h-36 object-cover rounded-lg mb-4"
            />
            <p className="text-2xl font-bold text-blue-600 mb-4">
              {formatPrice(course.price)}
            </p>
            {user?.role === "student" && (
              <div className="space-y-2">
                <button
                  onClick={() => setPayModal(true)}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Enroll Now
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Add to Wishlist
                </button>
              </div>
            )}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Login to Enroll
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">

          {/* course content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Course content ({course.modules?.length || 0} modules)
            </h2>
            {course.modules?.length === 0 ? (
              <p className="text-gray-400 text-sm">No modules added yet</p>
            ) : (
              <div className="space-y-2">
                {course.modules?.map((mod, idx) => (
                  <div
                    key={mod.content_id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-400 text-sm w-5">{idx + 1}</span>
                    <span className="text-sm flex-1 text-gray-700">{mod.title}</span>
                    
                    {mod.duration && (
                      <span className="text-xs text-gray-400">{mod.duration}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* instructor info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">About the instructor</h2>
            <p className="text-gray-700 font-medium">{course.instructor_name}</p>
            {course.instructor_bio && (
              <p className="text-gray-500 text-sm mt-2">{course.instructor_bio}</p>
            )}
          </div>

          {/* reviews */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Student reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.review_id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={review.avatar || "https://placehold.co/40x40?text=U"}
                        alt={review.student_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{review.student_name}</p>
                        <p className="text-xs text-gray-400">{formatDate(review.review_date)}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={review.rating} mode="display" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* payment modal */}
      <Modal
        isOpen={payModal}
        onClose={() => setPayModal(false)}
        title="Complete enrollment"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Course</p>
            <p className="font-semibold text-gray-800">{course.title}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="text-xl font-bold text-blue-600">{formatPrice(course.price)}</span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-700">
              This is a simulated payment for demo purposes. Click Pay Now to enroll instantly.
            </p>
          </div>
          <button
            onClick={handleEnroll}
            disabled={paying}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {paying ? "Processing..." : `Pay ${formatPrice(course.price)}`}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CourseDetail;
