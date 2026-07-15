const Site = require('../models/site-model'); // model faylingizga mos yo‘l
const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model")

module.exports = async (req, res, next) => {
    try {
      const token = req.cookies.pressToken;
      if (!token) return res.status(401).json({ok: false, message: 'Token yo‘q' });
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await userModel.findById(userId)
      if (user.usertype === 'Press' || user.usertype === "Develop") {
        req.user = user._id
        next();
      } else{
        return res.status(403).json({ok: false, message: "Faqat Xalq ta'limi xodimlari uchun!" });
      }
    } catch (err) {
      res.status(500).json({ok: false, message: 'Ichki server xatosi' });
    }
  };
