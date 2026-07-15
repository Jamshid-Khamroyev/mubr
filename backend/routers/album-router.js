const router = require("express").Router()
const adminMidelewre = require("../midleweres/admin-midlewere")
const userMidelewre = require("../midleweres/user-midlewere")
const upload = require("../midleweres/album-image-midlewree")
const AlbumController = require("../controllers/album-controller")
const fileUpload = require("express-fileupload");
const path = require("path");

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '..', 'tmp'),
}));

router.post("/create", adminMidelewre, upload, AlbumController.Create)
router.delete("/delete/:album", adminMidelewre, AlbumController.Delete)
router.get("/:num/get-all", userMidelewre, AlbumController.GetAll)
router.get("/:num/get-all/admin", adminMidelewre, AlbumController.GetAll)
router.get("/get-one/:album", userMidelewre, AlbumController.GetOne)

module.exports = router