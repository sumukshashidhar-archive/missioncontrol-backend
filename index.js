const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

require("./routes")(app);

app.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function (
  req,
  res
) {
  console.info("Server Started");
});

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.info("MongoDB Connected"))
  .catch((err) => console.error(err));
