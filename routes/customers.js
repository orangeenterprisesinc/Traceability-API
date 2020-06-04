const express = require("express");
const {
    getCustomers,
    addDataByPET
} = require("../controllers/customers");

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.route("/").get(getCustomers),
router.route("/addingdata/:prefix").get(addDataByPET);

module.exports = router;
