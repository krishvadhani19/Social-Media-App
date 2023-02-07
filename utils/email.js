// importing modules
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      email: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define the mail options
  const mailOptions = {
    from: "Krish Vadhani<krishvadhani7@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  console.log("Finding Error");
  // 3) actually send the mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
