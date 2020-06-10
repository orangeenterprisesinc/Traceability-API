const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CustomerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Please add a customer name"],
    },
    prefix: {
      type: String,
      required: [true, "Please add a prefix"],
      minlength: 3,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // this will run only if the password was actually modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
CustomerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match customer entered password to hashed password in database
CustomerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reverse populate with virtuals
CustomerSchema.virtual("locations", {
    ref: "Location",
    localField: "_id",
    foreignField: "customer",
    justOne: false,
  });

module.exports = mongoose.model("Customer", CustomerSchema);
