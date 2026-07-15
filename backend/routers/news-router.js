const router = require("express").Router()
const pressMidlewere = require("../midleweres/press-midlewere")
const userMidelwere = require("../midleweres/user-midlewere")
const NewsController = require("../controllers/news-controller")
const upload = require("../midleweres/new-image-midlewre")

router.post("/create", pressMidlewere, upload.single("image"), NewsController.Create)
router.put("/update/:new", pressMidlewere, upload.single("image"), NewsController.Update)
router.delete("/delete/:new", pressMidlewere, NewsController.Delete)
router.get("/get-all", userMidelwere, NewsController.GetAll)
router.get("/get-one/:new", userMidelwere, NewsController.GetOne)

module.exports = router