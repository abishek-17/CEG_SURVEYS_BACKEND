const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// require("dotenv/config");
module.exports = mongoose.model(
  "Surveys",
  new mongoose.Schema(
    {
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      surveyTitle: {
        type: String,
        unique: true,
      },
      surveyDesc: String,
      visibility: { type: Boolean, default: true },
      fields: {
        type: Array,
        required: true,
      },
    },
    { timestamps: true }
  )
);
