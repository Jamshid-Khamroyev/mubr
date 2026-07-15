const router = require("express").Router();
const authozincationMe = require("../midleweres/authancation-me")
const userMIdelewere = require("../midleweres/user-midlewere")
const siteImageMidlere = require("../midleweres/site-image-midlwere")
const adminmidlewere = require("../midleweres/admin-midlewere")
const SiteController = require("../controllers/site-controller")
const fileUpload = require("express-fileupload");
const pressMidlewere = require("../midleweres/press-midlewere")
const path = require("path");

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '..', 'tmp'),
}));

router.post("/create", authozincationMe, siteImageMidlere, SiteController.Create)
router.delete("/delete/:site", authozincationMe, SiteController.Delete)
router.put("/update/:site", authozincationMe, siteImageMidlere, SiteController.Update)
router.get("/get-all", authozincationMe,  SiteController.GetAll)
router.get("/get-all-site-for-user", SiteController.GetAllSiteForUser)
router.get("/get-one/:site", userMIdelewere, SiteController.GetOne)
router.get("/get-one-for-update/:site", authozincationMe, SiteController.GetOne)
router.put("/block/:site", authozincationMe, SiteController.Block)
router.put("/open/:id", authozincationMe, SiteController.Open)
router.get("/get-stats/:id", adminmidlewere, SiteController.Stats)
router.get("/stats-press", pressMidlewere, SiteController.statsForAllSchools)

module.exports = router;
