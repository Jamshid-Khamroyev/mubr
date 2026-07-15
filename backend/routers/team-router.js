const router = require("express").Router();
const adminMidelewr = require("../midleweres/admin-midlewere")
const userMidlewere = require("../midleweres/user-midlewere")
const teamImages = require("../midleweres/team-image-midlewere")
const TeamController = require("../controllers/team-controller")

router.post("/create", adminMidelewr, teamImages.single("image"), TeamController.Create)
router.delete("/delete/:team", adminMidelewr,TeamController.Delete)
router.get("/get-all", userMidlewere,TeamController.GetAll)
router.get("/get-all/admin", adminMidelewr ,TeamController.GetAll)
router.get("/get-one/:team", userMidlewere,TeamController.GetOne)

module.exports = router;
