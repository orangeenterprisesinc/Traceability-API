// TO DO LIST
// 1. customer tabler instead of reference
const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    locationName: {
      type: String,
      required: [true, "Please add a location name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
      minlength: [2, "Name can not be less than 2 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Customer',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete codes when a location is deleted
LocationSchema.pre("remove", async function (next) {
  console.log(`Codes being removed from location ${this._id}`);
  await this.model("Code").deleteMany({ location: this._id });
  next();
});

// Reverse populate with virtuals
LocationSchema.virtual("codes", {
  ref: "Code",
  localField: "_id",
  foreignField: "location",
  justOne: false,
});

module.exports = mongoose.model("Location", LocationSchema);
