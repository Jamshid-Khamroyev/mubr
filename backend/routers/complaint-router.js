const router = require("express").Router();
const userMIdelewre = require("../midleweres/user-midlewere")
const adminMidelwere = require("../midleweres/admin-midlewere")
const ComplaintController = require("../controllers/complaint-controller")

router.post("/add/:id", userMIdelewre, ComplaintController.Add)
router.delete("/delete/complaint", adminMidelwere, ComplaintController.Delete)
router.get("/get-all", adminMidelwere, ComplaintController.GetAll)

module.exports = router;
