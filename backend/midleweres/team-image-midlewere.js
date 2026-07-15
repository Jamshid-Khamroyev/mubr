const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..','team-images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'team-' + uniqueSuffix + ext);
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 } // Maksimal 5MB
});

module.exports = upload;
