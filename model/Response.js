const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// require("dotenv/config");
module.exports = mongoose.model(
  "Responses",
  new mongoose.Schema(
    {
      surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        refs: "Surveys",
      },
      response: Array,
    },
    { timestamps: true }
  )
);
