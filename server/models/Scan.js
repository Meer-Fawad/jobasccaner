const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    jobTitle: {
      type: String,
      default: "Untitled job"
    },
    input: {
      type: String,
      required: true,
      maxlength: 15000
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    level: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },
    findings: [{
      title: String,
      description: String,
      points: Number
    }],
    recommendations: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scan", scanSchema);