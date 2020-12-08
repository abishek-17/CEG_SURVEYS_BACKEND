require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// To supress mongoose deprecation warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
let dbString = process.env.MONGO_URL_ATLAS;
if (process.env.NODE_ENV !== undefined) {
  console.log("Atlas strign is being used.......");
  dbString = process.env.MONGO_URL_ATLAS;
}
mongoose
  .connect(dbString, { useNewUrlParser: true })
  .then((connected) => {
    console.log("db connected....");
  })
  .catch((err) => {
    console.log("db con err:", err);
  });

// to handle request from client application
const { userRoute, surveyRoute, responseRoute } = require("./routes/index");

app.use("/api/v1/user", userRoute);
app.use("/api/v1/survey", surveyRoute);
app.use("/api/v1/response", responseRoute);

const serveStatic = require("serve-static");
const history = require("connect-history-api-fallback");
// app.use(express.static('static'))
app.use(history());
app.use(serveStatic("./public", { index: ["index.html", "index.htm"] }));
/**To handle error passed using next({code:errorCode,msg:"Error Message"}) */
app.use((err, req, res, next) => {
  let statusCode = err.code || 500; //if there is no err.code 500 will be used
  res.status(statusCode).json({ msg: err.msg });
});

let PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log("App is on port:", PORT);
});
