const router = require("express").Router();
const userMidelwere = require("../midleweres/user-midlewere")
const NotificationController = require("../controllers/notif-controller");
const adminMidlewere = require("../midleweres/admin-midlewere");

router.post("/create", adminMidlewere, NotificationController.Create)
router.delete("/delete/:id", adminMidlewere, NotificationController.Delete)
router.get("/get-all", userMidelwere, NotificationController.GetAll)

module.exports = router;
