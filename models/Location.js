const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
    minlength: [2, "Name can not be less than 2 characters"],
  },
//   geoLocation: {
//     // GeoJSON Point
//     type: {
//       type: String,
//       enum: ["Point"],
//       required: true,
//     },
//     coordinates: {
//         type: [Number],
//         required: true,
//         index: '2dsphere'
//     }
//   },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('Location', LocationSchema);
