const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model")

module.exports = async(req, res, next) => {
    try {
        const token = req.cookies.dev_Token;
        if (!token) return res.status(401).json({ok: false, message: 'Token yo‘q' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await userModel.findById(userId)
        if (user.usertype !== 'Develop') {
            return res.status(403).json({ok: false, message: 'Siz bu yerga kira olmaysiz 1' });
        }

        if(user.userClassName !== "withoutSchool"){
            return res.status(403).json({ok: false, message: 'Siz bu yerga kira olmaysiz 2' });
        }

        if(user.key !== "full010408"){
            return res.status(403).json({ok: false, message: 'Siz bu yerga kira olmaysiz 3' });
        }

        req.user = user._id
        next()
    } catch (error) {
        res.status(401).json({ok: false, message: error.message})
    }
}