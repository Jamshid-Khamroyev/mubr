const router = require("express").Router();
const adminMidlewre = require("../midleweres/admin-midlewere")
const TestController = require("../controllers/test-controller");
const userMidlewere = require("../midleweres/user-midlewere");

router.post("/create", adminMidlewre, TestController.Create)
router.delete("/delete/:test", adminMidlewre, TestController.Delete)
router.get("/get-all", userMidlewere, TestController.GetAll)
router.get("/get-all/admin", adminMidlewre, TestController.GetAllAdmin)
router.get("/get-one/:test", userMidlewere, TestController.GetOne)
router.put("/cheking/:test", userMidlewere, TestController.CheckTest)

module.exports = router;
