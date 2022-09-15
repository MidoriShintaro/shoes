const User = require("../model/userModel");
const Email = require("../utils/email");

exports.feedback = async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin các trường");
    req.flash("name", name);
    req.flash("email", email);
    req.flash("subject", subject);
    req.flash("message", message);
    return res.redirect("/contact");
  }

  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "Địa chỉ email không tồn tại");
    return res.redirect("/contact");
  }
  const url = `${req.protocol}://${req.get("host")}/`;
  await new Email(user, url).sendFeedBack();
  res.redirect('/feedback')
};
