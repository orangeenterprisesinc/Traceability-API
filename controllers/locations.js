const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Location = require("../models/Location");
const Code = require("../models/Code");

// @desc        GET all locations
// @route       GET /api/v1/locations
// @access      Public
exports.getLocations = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  let queryStr = JSON.stringify(reqQuery);

  query = Location.find(JSON.parse(queryStr)).populate("codes");

  const locations = await query;

  res
    .status(200)
    .json({ success: true, count: locations.length, data: locations });
});

// @desc        GET all location
// @route       GET /api/v1/locations/:id
// @access      Public
exports.getLocation = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const location = await Location.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: location });
});

// @desc        Create new location
// @route       POST /api/v1/locations
// @access      Private
exports.createLocation = asyncHandler(async (req, res, next) => {
  // Add customer to req.body
  req.body.customer = req.customer.id;
  console.log("req.customer.id", req.customer.id);
  req.body.customer = req.customer.id;
  console.log("req.body.customer", req.body.customer);

  // check for published location
  const publishedLocations = await Location.findOne({
    customer: req.customer.id,
  });
  console.log("published Locations are " + publishedLocations);

  const locations = await Location.create(req.body);

  res.status(201).json({
    success: true,
    data: locations,
  });
});

// @desc        Update location
// @route       PUT /api/v1/locations/:id
// @access      Private
exports.updateLocation = asyncHandler(async (req, res, next) => {
  let location = await Location.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  if (
    location.customer.toString() !== req.customer.id &&
    req.customer.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `Customer ${req.params.id} is not authorized to update this location`,
        401
      )
    );
  }

  location = await Location.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: location });
});

// @desc        Delete location
// @route       DELETE /api/v1/locations/:id
// @access      Private
exports.deleteLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  if (
    location.customer.toString() !== req.customer.id &&
    req.customer.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `Customer ${req.params.id} is not authorized to delete this location`,
        401
      )
    );
  }

  location.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc        Add multiple locations and codes
// @route       POST /api/v1/locations/locationCodes
// @access      Private
exports.createOrUpdateLocation = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  console.log(req.customer.id);
  try {
    let customerId = req.customer.id;

    const locations = req.body;

    if (locations && locations.length > 0) {
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        location.customer = customerId;
        const addedLocation = await Location.findOneAndUpdate(
          {
            locationName: location.locationName,
          },
          location,
          {
            new: true,
            upsert: true,
            useFindAndModify: false,
          }
        );

        if (location.codes && location.codes.length > 0) {
          for (let i = 0; i < location.codes.length; i++) {
            const locationCodes = location.codes[i];
            locationCodes.location = addedLocation.id;

            const addedCode = await Code.findOneAndUpdate(
              {
                code: locationCodes.code,
              },
              locationCodes,
              {
                new: true,
                upsert: true,
                useFindAndModify: false,
              }
            );
          }
        }
      }
    }

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(404).json({
        status: 404,
        error: error.message,
      });
  }
});
