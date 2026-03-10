const sendResponse = require("../utils/sendResponse");
const categoryModel = require("../models/categoryModel");
const crypto = require("crypto");

// to get all categories
async function getAllCategories(req, res) {
  try {
    const result = await categoryModel.getAllCategories();
    return sendResponse(res, 200, "All categories are fetched", result);
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// get category by id
async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const result = await categoryModel.getCategoryById(id);

    if (!result) {
      return sendResponse(res, 404, "No Category exist by given category id");
    }

    return sendResponse(res, 200, "Category By Id", result);
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// create a category by admin
async function createCategory(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return sendResponse(res, 400, "Please Enter Name of the Category");
    }

    const alreadyExist = await categoryModel.getCategoryByName(name);

    if (alreadyExist) {
      return sendResponse(res, 409, "Category already exist");
    }

    const id = crypto.randomUUID();

    const result = await categoryModel.createCategory(id, name);

    return sendResponse(
      res,
      201,
      "Category has been created successfully",
      result,
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// update a category by admin
async function updateCategoryById(req, res) {
  try {
    const { id } = req.params;

    const exists = await categoryModel.getCategoryById(id);

    if (!exists) {
      return sendResponse(res, 404, "No Category exist by given category id");
    }

    const { name } = req.body;

    const result = await categoryModel.updateCategory(id, name);

    return sendResponse(res, 200, "Category Updated Successfully", result);
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// delete a category by admin
async function deleteCategoryById(req, res) {
  try {
    const { id } = req.params;

    const result = await categoryModel.deleteCategory(id);

    return sendResponse(res, 204, "Category Deleted successfully", result);
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategoryById,
  updateCategoryById,
};
