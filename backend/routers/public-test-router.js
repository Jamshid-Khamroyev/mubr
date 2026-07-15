const router = require("express").Router();
const userMidelwere = require("../midleweres/user-midlewere")
const PublicTestController = require("../controllers/public-test-controller")

router.post("/create", userMidelwere, PublicTestController.Create)
router.delete("/delete/:test", userMidelwere, PublicTestController.Delete)
router.get("/get-all", userMidelwere, PublicTestController.GetAll)
router.get("/get-all-for-user", userMidelwere, PublicTestController.GetAllForUser)
router.put("/update/:test", userMidelwere, PublicTestController.Update)

module.exports = router;
