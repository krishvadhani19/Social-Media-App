module.exports = (res, status, statusCode, data) => {
  res.status(statusCode).json({
    status: status,
    data: data,
  });
};
