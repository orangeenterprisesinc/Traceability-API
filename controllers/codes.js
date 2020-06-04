const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Code = require("../models/Code");
const Location = require("../models/Location");

// @desc        GET all codes
// @route       GET /api/v1/codes
// @route       GET /api/v1/locations/:locationId/codes
// @access      Public
exports.getCodes = asyncHandler(async (req, res, next) => {
  console.log("get codes is working");
  let query;

  if (req.params.locationId) {
    query = Code.find({ location: req.params.locationId });
  } else {
    // query = Code.find();
    query = Code.find().populate({
      path: "location",
      select: "locationName",
    });
  }

  const codes = await query;

  res.status(200).json({
    success: true,
    count: codes.length,
    data: codes,
  });
});

// @desc        Get single code
// @route       GET /api/v1/codes/:id
// @access      Public
exports.getCode = asyncHandler(async (req, res, next) => {
  const code = await Code.findById(req.params.id).populate({
    path: "location",
    select: "locationName",
  });

  if (!code) {
    return next(
      new ErrorResponse(`No code with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: code,
  });
});

// @desc        get single location by code
// @route       GET /api/v1/codes/locationbycode/:code
// @access      Public
exports.getLocationByCode = asyncHandler(async (req, res, next) => {
  
  const code = await Code.find({ code: req.params.code });

  if (!code) {
    return next(
      new ErrorResponse(`No code with the id of ${req.params.code}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: code,
  });
});

// @desc        Add single code
// @route       POST /api/v1/locations/:locationId/codes
// @access      Private
exports.addCode = asyncHandler(async (req, res, next) => {
  console.log("add code is working");
  req.body.location = req.params.locationId;

  const location = await Location.findById(req.params.locationId);

  if (!location) {
    return next(
      new ErrorResponse(`No location with the id of ${req.params.locationId}`),
      404
    );
  }

  const code = await Code.create(req.body);

  res.status(200).json({
    success: true,
    data: code,
  });
});

// @desc        Update single code
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCode = asyncHandler(async (req, res, next) => {
  let code = await Code.findById(req.params.id);

  if (!code) {
    return next(
      new ErrorResponse(`No code with the id of ${req.params.id}`),
      404
    );
  }

  code = await Code.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: code,
  });
});

// @desc        Delete code
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCode = asyncHandler(async (req, res, next) => {
  let code = await Code.findById(req.params.id);

  if (!code) {
    return next(
      new ErrorResponse(`No code with the id of ${req.params.id}`),
      404
    );
  }

  await code.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
