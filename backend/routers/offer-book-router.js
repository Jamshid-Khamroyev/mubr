const router = require("express").Router();
const adminMidlewre = require("../midleweres/admin-midlewere")
const userMidlewre = require("../midleweres/user-midlewere")
const upload = require("../midleweres/offer-book-image-midlewre")
const BookController = require("../controllers/offer-book-controller")
const fileUpload = require("express-fileupload");
const path = require("path");

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '..', 'tmp'),
}));

router.post("/create", adminMidlewre, upload, BookController.Create)
router.delete("/delete/:book", adminMidlewre, BookController.Delete)
router.get("/get-all", userMidlewre, BookController.GetAll)
router.get("/get-all/admin", adminMidlewre, BookController.GetAll)
router.get("/get-one/:book", userMidlewre, BookController.GetOne)
router.put("/update/:rating/:book", userMidlewre, BookController.UpdateRating)

module.exports = router;
