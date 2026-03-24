import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StudentLayout from "../../components/common/StudentLayout";

import Loader from "../../components/common/Loader";
import StarRating from "../../components/common/StarRating";
import { getWishlist, removeFromWishlist } from "../../api/wishlistApi";
import { formatPrice } from "../../utils/formatPrice";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then((res) => setWishlist(res.data.data || []))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (course_id) => {
    try {
      await removeFromWishlist(course_id);
      setWishlist((prev) => prev.filter((item) => item.course_id !== course_id));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Loader /></div>;

  return (
    <StudentLayout>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Your wishlist is empty</p>
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 text-sm hover:underline mt-2 inline-block"
              >
                Browse courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div
                  key={item.wishlist_id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center"
                >
                  <img
                    src={item.thumbnail || "https://placehold.co/100x70?text=Course"}
                    alt={item.title}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">by {item.instructor_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={Math.round(item.avg_rating || 0)} mode="display" />
                      <span className="text-xs text-gray-400">({item.avg_rating || 0})</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="font-bold text-blue-600">{formatPrice(item.price)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/courses/${item.course_id}`)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Enroll
                      </button>
                      <button
                        onClick={() => handleRemove(item.course_id)}
                        className="text-xs border border-red-300 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>

  );
}

export default Wishlist;