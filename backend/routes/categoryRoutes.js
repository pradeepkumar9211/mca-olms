const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMidlleware");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategoryById,
  updateCategoryById,
} = require("../controllers/categoryController");

// CategoryRouter.get('/', )
const CategoryRouter = Router();

// to get all categories
CategoryRouter.get("/", getAllCategories);

// get categories by id
CategoryRouter.get("/:id", getCategoryById);

// create a category by admin -- remove instructor when admin is added
CategoryRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  createCategory,
);

// update a category by admin -- remove instructor when admin is added
CategoryRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  updateCategoryById,
);
// delete a category by admin -- remove instructor when admin is added
CategoryRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  deleteCategoryById,
);

module.exports = CategoryRouter;
