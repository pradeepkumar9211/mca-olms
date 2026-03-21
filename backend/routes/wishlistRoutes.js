const { Router } = require("express");
const userAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  addToWishlistHandler,
  getWishlistHandler,
  removeFromWishlistHandler,
} = require("../controllers/wishlistController");

const WishlistRouter = Router();

// add course to wishlist -- student only
WishlistRouter.post(
  "/wishlist",
  userAuth,
  roleMiddleware("student"),
  addToWishlistHandler,
);

// get student's wishlist
WishlistRouter.get(
  "/wishlist",
  userAuth,
  roleMiddleware("student"),
  getWishlistHandler,
);

// remove course from wishlist -- student only
WishlistRouter.delete(
  "/wishlist/:courseId",
  userAuth,
  roleMiddleware("student"),
  removeFromWishlistHandler,
);

module.exports = WishlistRouter;
