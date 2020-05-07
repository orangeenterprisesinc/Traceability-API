const express = require("express");
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locations");

const router = express.Router();

router.route("/").get(getLocations).post(createLocation);

router
  .route("/:id")
  .get(getLocation)
  .put(updateLocation)
  .delete(deleteLocation);

module.exports = router;
