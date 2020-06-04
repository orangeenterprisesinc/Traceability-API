const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please add a code"],
    unique: true,
    trim: true,
    maxlength: [200, "Code can not be more than 50 characters"],
    minlength: [2, "Code can not be less than 6 characters"],
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: true,
  }
});

module.exports = mongoose.model('Code', CodeSchema);
