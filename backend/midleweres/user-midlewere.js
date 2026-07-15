const Site = require('../models/site-model'); // model faylingizga mos yo‘l
const userModel = require("../models/user-model")
const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    try {  
      const token = req.cookies.userToken;
      if (!token) return res.status(400).json({ok: false, message: 'Token yo‘q' });
      
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await userModel.findById(id)
      if (!user) return res.status(403).json({ok: false, message: 'Bu saytga kirish huquqingiz yo‘q' });
      
      const site = await Site.findById(user.siteId)
      if(!site) return res.status(400).json({ok: false, message: "Maktab aniqlanmadi!"})

      const checkUser = site.users.find(u => u._id.toString() === id)
      if(!checkUser) return res.status(400).json({ok: false, message: "Foydalanuvchi topilmadi!"})
      
      if(user.block){
        return res.status(402).json({ok: false, message: "Siz bloklangansiz!"})
      }

      if(site.block){
        return res.status(402).json({ok: false, message: `${site.title} vaqtinchalik faoliyatdan to'xtagan!`})
      }

      req.user = user._id;
      req.site = site._id;
      next();
    } catch (err) {
      console.error('Middleware xatosi:', err);
      res.status(500).json({ok: false, message: 'Ichki server xatosi' });
    }
  };
