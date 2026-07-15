const router = require("express").Router();
const authozincaionMe = require("../midleweres/authancation-me")
const userMidlewre = require("../midleweres/user-midlewere")
const eduCenterImages = require("../midleweres/edu-center-image-midlewre")
const EduController = require("../controllers/edu-center-controller")

router.post("/create", authozincaionMe, eduCenterImages.array("images", 3), EduController.Create)
router.delete("/delete/:edu", authozincaionMe, EduController.Delete)
router.put("/update/:edu", authozincaionMe, EduController.Update)
router.get("/:num/get-all", userMidlewre, EduController.GetAll)
router.get("/get-one/:edu", userMidlewre, EduController.GetOne)

module.exports = router;
