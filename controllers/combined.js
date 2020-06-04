// const ErrorResponse = require("../utils/errorResponse");
// const asyncHandler = require("../middleware/async");
// const Code = require("../models/Code");
// const Location = require("../models/Location");

// // @desc        Add single code to a location by location name
// // @route       POST /api/v1/combined/addingdata/
// // @access      Private
// exports.addCodeToLocation = asyncHandler(async (req, res, next) => {
//   console.log("req.body is ****************", req.body);
//   console.log("req.customer is ****************", req.customer.id);
//   try {
//     let customerId = req.customer.id;
//     console.log("customerId is", customerId);

//     const locations = req.body;
//     console.log("locations are: ", locations);

//     if (locations && locations.length > 0) {
//       for (let i = 0; i < locations.length; i++) {
//         const location = locations[i];
//         location.customer = customerId;
//         console.log("location from array with customer id is", location);
//         const addedLocation = await Location.findOneAndUpdate(
//           {
//             locationName: location.locationName,
//           },
//           location,
//           {
//             new: true,
//             upsert: true,
//             useFindAndModify: false,
//           }
//         );

//         console.log("addedLocation is", addedLocation);

//         if (location.codes && location.codes.length > 0) {
//           for (let i = 0; i < location.codes.length; i++) {
//             const locationCodes = location.codes[i];
//             locationCodes.location = addedLocation.id;
//             console.log(
//               "Code of location with the location id is",
//               location.codes[i]
//             );
//             const addedCode = await Code.findOneAndUpdate(
//               {
//                 code: locationCodes.code,
//               },
//               locationCodes,
//               {
//                 new: true,
//                 upsert: true,
//                 useFindAndModify: false,
//               }
//             );
//             console.log("addedCode is", addedCode);
//           }
//         }
//       }
//     }

//     res.status(201).json({
//       success: true,
//     });
//   } catch (error) {
//     console.log("Error", error);
//     res.status(404).json({
//         status: 404,
//         error: error.message,
//       });
//   }
// });
