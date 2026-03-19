const { z } = require("zod");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const {
  createModule,
  getModulesByCourseId,
  getModuleById,
  getLastModuleOrder,
  updateModule,
  deleteModule,
} = require("../models/courseModuleModel");
const { getCourseOwner } = require("../models/courseModel");

// zod schemas
const createModuleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  content_type: z.enum(["video", "document"], {
    errorMap: () => ({ message: "content_type must be video or document" }),
  }),
  video_url: z
    .string()
    .url("video_url must be a valid URL")
    .optional()
    .nullable(),
  file_url: z
    .string()
    .url("file_url must be a valid URL")
    .optional()
    .nullable(),
  duration: z.string().optional().nullable(),
});

const updateModuleSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  content_type: z.enum(["video", "document"]).optional(),
  video_url: z.string().url().optional().nullable(),
  file_url: z.string().url().optional().nullable(),
  duration: z.string().optional().nullable(),
  content_order: z.number().int().min(1).optional(),
});

// helper -- check if instructor owns the course
// using this in all handlers that modify data
async function verifyOwnership(course_id, user_id) {
  const course = await getCourseOwner(course_id);
  if (!course) return { error: "Course not found", status: 404 };
  if (course.instructor_id !== user_id) {
    return {
      error: "You are not authorized to modify this course",
      status: 403,
    };
  }
  return { course };
}

// get all modules of a course -- public, no auth needed
async function getModulesHandler(req, res) {
  try {
    const { id } = req.params;

    const modules = await getModulesByCourseId(id);
    if (!modules || modules.length === 0) {
      return sendResponse(res, 404, "No modules found for this course");
    }

    return sendResponse(res, 200, "Modules fetched successfully", modules);
  } catch (error) {
    console.error("getModules error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// add a new module to a course -- instructor only
async function createModuleHandler(req, res) {
  try {
    const { id: course_id } = req.params;
    const { user_id } = req.user;

    // ownership check
    const ownership = await verifyOwnership(course_id, user_id);
    if (ownership.error) {
      return sendResponse(res, ownership.status, ownership.error);
    }

    // validate input
    const validation = createModuleSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    const { title, content_type, video_url, file_url, duration } =
      validation.data;

    // simple url check based on content_type
    if (content_type === "video" && !video_url) {
      return sendResponse(res, 422, "video_url is required for video modules");
    }
    if (content_type === "document" && !file_url) {
      return sendResponse(
        res,
        422,
        "file_url is required for document modules",
      );
    }

    // clear out the unused url
    const finalVideoUrl = content_type === "video" ? video_url : null;
    const finalFileUrl = content_type === "document" ? file_url : null;

    // auto assign order based on last module in this course
    const lastOrder = await getLastModuleOrder(course_id);
    const content_order = lastOrder + 1;
    const content_id = crypto.randomUUID();

    await createModule({
      content_id,
      course_id,
      title,
      content_type,
      video_url: finalVideoUrl,
      file_url: finalFileUrl,
      duration: duration || null,
      content_order,
    });

    return sendResponse(res, 201, "Module added successfully", {
      content_id,
      content_order,
    });
  } catch (error) {
    console.error("createModule error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// update a module -- instructor only, must own the course
async function updateModuleHandler(req, res) {
  try {
    const { id: course_id, contentId } = req.params;
    const { user_id } = req.user;

    // ownership check
    const ownership = await verifyOwnership(course_id, user_id);
    if (ownership.error) {
      return sendResponse(res, ownership.status, ownership.error);
    }

    // check module exists and belongs to this course
    const module = await getModuleById(contentId);
    if (!module) {
      return sendResponse(res, 404, "Module not found");
    }
    if (module.course_id !== course_id) {
      return sendResponse(
        res,
        403,
        "This module does not belong to this course",
      );
    }

    // validate input
    const validation = updateModuleSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 422, "Invalid input", {
        errors: validation.error.flatten(),
      });
    }

    // merge existing data with updates
    // so instructor can update just one field without losing the rest
    const updatedData = {
      title: validation.data.title ?? module.title,
      content_type: validation.data.content_type ?? module.content_type,
      video_url: validation.data.video_url ?? module.video_url,
      file_url: validation.data.file_url ?? module.file_url,
      duration: validation.data.duration ?? module.duration,
      content_order: validation.data.content_order ?? module.content_order,
    };

    // check url consistency on final merged data
    if (updatedData.content_type === "video" && !updatedData.video_url) {
      return sendResponse(res, 422, "video_url is required for video modules");
    }
    if (updatedData.content_type === "document" && !updatedData.file_url) {
      return sendResponse(
        res,
        422,
        "file_url is required for document modules",
      );
    }

    // clear out the unused url after merge
    if (updatedData.content_type === "video") updatedData.file_url = null;
    if (updatedData.content_type === "document") updatedData.video_url = null;

    const affected = await updateModule(contentId, updatedData);
    if (!affected) {
      return sendResponse(res, 400, "Nothing to update");
    }

    return sendResponse(res, 200, "Module updated successfully");
  } catch (error) {
    console.error("updateModule error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

// delete a module -- instructor only, must own the course
async function deleteModuleHandler(req, res) {
  try {
    const { id: course_id, contentId } = req.params;
    const { user_id } = req.user;

    // ownership check
    const ownership = await verifyOwnership(course_id, user_id);
    if (ownership.error) {
      return sendResponse(res, ownership.status, ownership.error);
    }

    // check module exists and belongs to this course
    const module = await getModuleById(contentId);
    if (!module) {
      return sendResponse(res, 404, "Module not found");
    }
    if (module.course_id !== course_id) {
      return sendResponse(
        res,
        403,
        "This module does not belong to this course",
      );
    }

    const affected = await deleteModule(contentId);
    if (!affected) {
      return sendResponse(res, 404, "Module not found");
    }

    return sendResponse(res, 200, "Module deleted successfully");
  } catch (error) {
    console.error("deleteModule error:", error);
    return sendResponse(res, 500, "Internal Server Error");
  }
}

module.exports = {
  getModulesHandler,
  createModuleHandler,
  updateModuleHandler,
  deleteModuleHandler,
};
