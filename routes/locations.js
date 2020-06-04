const express = require("express");
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  createOrUpdateLocation
} = require("../controllers/locations");

// include other resource routers
const codeRouter = require('./codes');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Re-route into other resourse routers
router.use('/:locationId/codes', codeRouter);

// router.route("/").get(getLocations).post(protect, authorize ('user', 'publisher', 'admin'), createLocation);
router.route("/").get(getLocations).post(protect, createLocation);
router.route("/locationCodes").post(protect, createOrUpdateLocation);

router
  .route("/:id")
  .get(getLocation)
  .put(protect, updateLocation)
  .delete(protect, deleteLocation);

module.exports = router;
