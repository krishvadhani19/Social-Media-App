module.exports = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: "success",
    count: data.length,
    data: data,
  });
};
