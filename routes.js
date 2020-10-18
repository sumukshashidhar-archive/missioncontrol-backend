module.exports = (app) => {
  //unprotected routes

  require("./routes/core")(app);
  require("./routes/auth")(app);
  require("./routes/dashboards")(app);
};
