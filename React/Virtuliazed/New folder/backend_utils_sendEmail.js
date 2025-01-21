const nodemailer = require("nodemailer")
const config = require("config")

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.get("email.host"),
    port: config.get("email.port"),
    auth: {
      user: config.get("email.user"),
      pass: config.get("email.password"),
    },
  })

  const message = {
    from: `${config.get("email.fromName")} <${config.get("email.fromEmail")}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(message)
}

module.exports = sendEmail

