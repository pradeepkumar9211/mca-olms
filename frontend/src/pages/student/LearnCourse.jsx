import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import StudentLayout from "../../components/common/StudentLayout";
import Loader from "../../components/common/Loader";
import ProgressBar from "../../components/common/ProgressBar";
import VideoPlayer from "../../components/player/VideoPlayer";
import PDFViewer from "../../components/player/PDFViewer";
import StarRating from "../../components/common/StarRating";
import { getEnrolledModules } from "../../api/enrollmentApi";
import { updateProgress, getProgress } from "../../api/progressApi";
import { createReview, getReviews, deleteReview } from "../../api/reviewApi";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";

function LearnCourse() {
  const { id: course_id } = useParams();
  const { user } = useAuth();

  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // reviews state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, review_text: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, progRes, reviewRes] = await Promise.all([
          getEnrolledModules(course_id),
          getProgress(course_id),
          getReviews(course_id),
        ]);

        const mods = modRes.data.data || [];
        const prog = progRes.data.data;
        const reviewData = reviewRes.data.data;

        setModules(mods);
        setProgress(prog);
        setReviews(reviewData?.reviews || []);
        setAvgRating(reviewData?.avg_rating || 0);

        // check if student already reviewed this course
        const existing = reviewData?.reviews?.find(
          (r) => r.student_id === user?.user_id
        );
        if (existing) setMyReview(existing);

        // auto select first unwatched module
        const firstUnwatched = prog?.modules?.find((m) => !m.is_watched);
        const firstMod = firstUnwatched
          ? mods.find((m) => m.content_id === firstUnwatched.content_id)
          : mods[0];
        setActiveModule(firstMod || mods[0]);
      } catch {
        toast.error("Failed to load course content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [course_id]);

  const isWatched = (content_id) => {
    return progress?.modules?.find((m) => m.content_id === content_id)?.is_watched;
  };

  const handleMarkWatched = async () => {
    if (!activeModule) return;
    setMarking(true);
    try {
      await updateProgress({ course_id, content_id: activeModule.content_id });
      const progRes = await getProgress(course_id);
      setProgress(progRes.data.data);
      toast.success("Marked as watched!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update progress");
    } finally {
      setMarking(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmittingReview(true);
    try {
      await createReview(course_id, reviewForm);
      toast.success("Review submitted!");
      setShowReviewForm(false);
      // refresh reviews
      const reviewRes = await getReviews(course_id);
      const reviewData = reviewRes.data.data;
      setReviews(reviewData?.reviews || []);
      setAvgRating(reviewData?.avg_rating || 0);
      const existing = reviewData?.reviews?.find(
        (r) => r.student_id === user?.user_id
      );
      if (existing) setMyReview(existing);
      setReviewForm({ rating: 0, review_text: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (review_id) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await deleteReview(review_id);
      toast.success("Review deleted");
      setMyReview(null);
      setReviews((prev) => prev.filter((r) => r.review_id !== review_id));
      setReviewForm({ rating: 0, review_text: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) return <StudentLayout><Loader /></StudentLayout>;

  return (
    <StudentLayout>
      <div className="p-6">

        {/* progress bar at top */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Course Progress</p>
            <p className="text-sm text-gray-500">
              {progress?.watched_modules || 0} / {progress?.total_modules || 0} modules completed
            </p>
          </div>
          <ProgressBar percent={progress?.progress_percent || 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* left sidebar -- module list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">Course Modules</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {modules.map((mod, idx) => (
                  <button
                    key={mod.content_id}
                    onClick={() => setActiveModule(mod)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeModule?.content_id === mod.content_id
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-medium ${isWatched(mod.content_id)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                        }`}>
                        {isWatched(mod.content_id) ? "✓" : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 font-medium leading-tight">
                          {mod.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">
                          {mod.content_type === "video" ? "🎬 Video" : "📄 PDF"}
                          {mod.duration && ` • ${mod.duration}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* right side -- content + reviews */}
          <div className="lg:col-span-2 space-y-6">

            {/* content viewer */}
            {activeModule ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-800">{activeModule.title}</h2>
                      <p className="text-xs text-gray-400 mt-1 capitalize">
                        {activeModule.content_type === "video" ? "🎬 Video lesson" : "📄 PDF document"}
                      </p>
                    </div>
                    {isWatched(activeModule.content_id) ? (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        ✓ Completed
                      </span>
                    ) : (
                      <button
                        onClick={handleMarkWatched}
                        disabled={marking}
                        className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {marking ? "Saving..." : "Mark as watched"}
                      </button>
                    )}
                  </div>
                </div>

                {activeModule.content_type === "video" ? (
                  <VideoPlayer url={activeModule.video_url} />
                ) : (
                  <PDFViewer url={activeModule.file_url} />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-64 text-gray-400">
                Select a module to start learning
              </div>
            )}

            {/* reviews section */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Reviews ({reviews.length})
                  </h2>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={Math.round(avgRating)} mode="display" />
                      <span className="text-sm text-gray-500">{avgRating} avg</span>
                    </div>
                  )}
                </div>

                {/* show write review button only if not already reviewed */}
                {!myReview && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write a review
                  </button>
                )}
              </div>

              {/* review form */}
              {showReviewForm && !myReview && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5"
                >
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your review
                  </h3>

                  {/* star rating input */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      mode="input"
                      onChange={(val) => setReviewForm({ ...reviewForm, rating: val })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Review</label>
                    <textarea
                      value={reviewForm.review_text}
                      onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                      placeholder="Share your experience with this course..."
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {submittingReview ? "Submitting..." : "Submit review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewForm({ rating: 0, review_text: "" });
                      }}
                      className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* my existing review */}
              {myReview && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-green-700">Your review</span>
                      <StarRating rating={myReview.rating} mode="display" />
                    </div>
                    <button
                      onClick={() => handleDeleteReview(myReview.review_id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{myReview.review_text}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(myReview.review_date)}</p>
                </div>
              )}

              {/* all reviews */}
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No reviews yet — be the first to review!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews
                    .filter((r) => r.student_id !== user?.user_id)
                    .map((review) => (
                      <div
                        key={review.review_id}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={review.avatar || "https://placehold.co/36x36?text=S"}
                            alt={review.student_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {review.student_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(review.review_date)}
                            </p>
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
      </div>
    </StudentLayout>
  );
}

export default LearnCourse;