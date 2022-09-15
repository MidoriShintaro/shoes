const nodemailer = require("nodemailer");
const ejs = require("ejs");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `<Raito ${process.env.EMAIL_FROM}>`;
    this.url = url;
    this.name = user.name;
  }
  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    const html = await ejs.renderFile(
      `${__dirname}/../views/emails/${template}.ejs`,
      {
        name: this.name,
        url: this.url,
        subject: subject,
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    return this.send("welcome", "Chào mừng đến với Raito Shop");
  }

  async sendResetPassword() {
    return this.send("confirmEmail", "Đặt lại mật khẩu của bạn");
  }

  async sendThankForCustomer() {
    return this.send("thanksfor", "Thư cảm ơn");
  }
  
  async sendFeedBack() {
    return this.send("emailFeedback", "Thư phản hồi");
  }
};
