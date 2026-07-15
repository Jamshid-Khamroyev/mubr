const cloudinary = require('../configure/cloud');
const fs = require('fs');
const path = require('path');


const cloudUpload = async (req, res, next) => {
  try {
    if (!req.files.images) {
      return res.status(400).json({ ok: false, message: "Rasmlar topilmadi!" });
    }

    let files = req.files.images;
    if (!Array.isArray(files)) {
      files = [files]; 
    }

    if (files.length > 3) {
      return res.status(400).json({ ok: false, message: "Eng ko‘pi bilan 3 ta rasm yuklash mumkin." });
    }

    const imageUrls = [];
    const publicIds = [];

    for (const file of files) {
      const tempFilePath = path.join(__dirname, '../tmp', file.name);
      await file.mv(tempFilePath);

      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'site-images',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      });

      fs.unlinkSync(tempFilePath); // vaqtinchalik faylni o‘chiramiz

      imageUrls.push(result.secure_url);
      publicIds.push(result.public_id);
    }

    req.imageUrls = imageUrls;
    req.publicIds = publicIds;

    next();
  } catch (err) {
    console.error("Cloudga yuklashda xatolik:", err);
    res.status(500).json({ ok: false, message: "Rasmlar yuklanmadi", error: err.message });
  }
};

module.exports = cloudUpload;
