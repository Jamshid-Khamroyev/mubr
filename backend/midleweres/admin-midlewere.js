const Site = require('../models/site-model'); // model faylingizga mos yo‘l
const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model")

module.exports = async (req, res, next) => {
    try {
      const token = req.cookies.adminToken;
      if (!token) return res.status(401).json({ok: false, message: 'Token yo‘q' });
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await userModel.findById(userId)
      if (user.usertype === 'Admin' || user.usertype === "Develop") {
        const site = await Site.findById(user.siteId);
        if (!site) return res.status(404).json({ok: false, message: 'Sayt topilmadi' });

        const checkAdmin = site.users.find(u => u.toString() === userId);
        if (!checkAdmin) return res.status(403).json({ok: false, message: 'Bu saytga kirish huquqingiz yo‘q' });

        if(site.block){
          return res.status(400).json({ok: false, message: `Assalomu Aleykum ${user.username} ${user.surname}! Sizning makabingizning ishlash muddati tugagan! Iltimos muddat qo'shish uchun biz bilan bog'laning!`})
        }
        req.site = site._id;
        req.user = user._id;
        next();
      } else{
        return res.status(403).json({ok: false, message: 'Faqat adminlar ruxsatli' });
      }
    } catch (err) {
      console.error('Middleware xatosi:', err);
      res.status(500).json({ok: false, message: 'Ichki server xatosi' });
    }
  };
