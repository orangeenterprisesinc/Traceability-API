const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Customer = require("../models/Customer");

// @desc        Register customer
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const { customerName, prefix, password } = req.body;

  // Create customer
  const customer = await Customer.create({
    customerName,
    prefix,
    password,
  });

  sendTokenResponse(customer, 200, res);
});

// @desc        Login customer
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
  const { prefix, password } = req.body;

  // validate prefix
  if (!prefix || !password) {
    return next(new ErrorResponse("Please provide an prefix and password", 400));
  }

  // Check for customer
  const customer = await Customer.findOne({ prefix }).select("+password");

  if (!customer) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await customer.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(customer, 200, res);
});

// @desc        Get current logged in customer
// @route       POST /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.customer.id);

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (customer, statusCode, res) => {
  // create token
  const token = customer.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //   Make the cookie to be access trough the client side script
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};