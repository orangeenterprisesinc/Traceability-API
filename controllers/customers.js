const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Code = require("../models/Code");
const Customer = require("../models/Customer");
// const Location = require("../models/Location");

// @desc        get all customers
// @route       GET /api/v1/customers
// @access      Private
exports.getCustomers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  let queryStr = JSON.stringify(reqQuery);

  query = Customer.find(JSON.parse(queryStr)).populate("locations");

  const customers = await query;

  res
    .status(200)
    .json({ success: true, count: customers.length, data: customers });
});

// @desc        create records from data sent by PET
// @route       POST /api/v1/customers/addingdata/:prefix
// @access      Public
  exports.addDataByPET = asyncHandler(async (req, res, next) => {

    console.log("Adding data from PET");
  
    const customer = await Customer.find({ prefix: req.params.prefix })
  
    if(!customer) {
      return next(new ErrorResponse(`No customer with the prefix of ${req.params.prefix}`), 404);
    }

    console.log("cusotomer is ", customer);
  
    res.status(200).json({
      success: true,
      data: customer
    });
  });