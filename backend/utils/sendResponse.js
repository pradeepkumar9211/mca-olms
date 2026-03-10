const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ message, ...(data != null && { data }) });
};

module.exports = sendResponse;