const cloudinary = require('../configure/cloud')
const fs = require('fs');
const path = require('path');

const cloudUpload = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ ok: false, message: "Rasm topilmadi!" });
    }

    const file = req.files.image;

    const tempFilePath = path.join(__dirname, '../tmp', file.name);
    await file.mv(tempFilePath);

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'album-images',
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });

    fs.unlinkSync(tempFilePath);

    req.imageUrl = result.secure_url;
    req.publicId = result.public_id;

    next();
  } catch (err) {
    console.error("Cloudga yuklashda xatolik:", err);
    res.status(500).json({ ok: false, message: "Rasm yuklanmadi", error: err.message });
  }
};

module.exports = cloudUpload;
