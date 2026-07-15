const router = require("express").Router();
const adminMidlere = require("../midleweres/admin-midlewere")
const userMidlere = require("../midleweres/user-midlewere")
const FactController = require("../controllers/fact-controller")

router.post("/create", adminMidlere, FactController.Create)
router.delete("/delete/:fact", adminMidlere, FactController.Delete)
router.put("/update/:fact", adminMidlere, FactController.Update)
router.get("/get-all/:num", userMidlere, FactController.GetAll)
router.get("/get-one/:fact", userMidlere, FactController.GetOne)

module.exports = router;
