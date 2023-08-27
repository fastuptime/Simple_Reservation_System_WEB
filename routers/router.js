const bodyParser = require("body-parser");
const ejs = require("ejs");
module.exports = function () {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.set("view engine", "ejs");
  app.set("views", "./www");
  app.use("/assets", express.static("www/assets"));

  app.use("/", require("./index.js"));
};
