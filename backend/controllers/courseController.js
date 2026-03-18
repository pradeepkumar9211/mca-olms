const { z } = require("zod");
const sendResponse = require("../utils/sendResponse");

// Get all the courses
async function getAllCourses(req, res) {
  try {
    const result = "Result";
    return sendResponse(res, 200, "Here are all the courses.", result);
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error", error);
  }
}

// Get course by Id
async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const result = "Result";
    return sendResponse(
      res,
      200,
      `Here is all the info for course with course_id :- ${id}`,
      result,
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error", error);
  }
}

// Creating a course
async function createCourse(req, res) {
  try {
    console.log(req.body);
    console.log(req.user);
    const result = "Result";
    return sendResponse(
      res,
      200,
      "I am an instructor and creating a course.",
      result,
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error", error);
  }
}

// Updating a course by Owner
async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const result = "Result";
    return sendResponse(
      res,
      200,
      `Here is updating the course info with course_id :- ${id}`,
      result,
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error", error);
  }
}

// deleting a course by owner or admin
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const result = "Result";
    return sendResponse(
      res,
      200,
      `Here is deleting the course info with course_id :- ${id}`,
      result,
    );
  } catch (error) {
    return sendResponse(res, 500, "Internal Server Error", error);
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
