const express = require("express");
const {
  getCodes,
  getCode,
  addCode,
  updateCode,
  deleteCode,
  getLocationByCode
} = require("../controllers/codes");

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.route("/").get(getCodes).post(protect, addCode);
router.route("/:id").get(getCode).put(protect, updateCode).delete(protect, deleteCode);
router.route("/locationbycode/:code").get(getLocationByCode);

module.exports = router;
