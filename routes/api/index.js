const router = require("express").Router();
const imageUpload = require("./imageUpload");

// Book routes
router.use("/imageUpload", imageUpload);

module.exports = router;
