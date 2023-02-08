// importing modules
const nodemailer = require("nodemailer");
const catchAsyncError = include("utils/catchAsyncError");

const sendEmail = catchAsyncError(async (options) => {
  // 1) Create a transporter

  console.log("working till here");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "krishvadhani7@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define the mail options
  const mailOptions = {
    from: "krishvadhani7@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) actually send the mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log({ "Error!": error });
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

module.exports = sendEmail;
