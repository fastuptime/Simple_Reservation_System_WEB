global.express = require("express");
global.app = express();
global.config = require("./config.js");
const { JsonDatabase } = require("wio.db");
global.db = new JsonDatabase({ databasePath: "./database.json" });

require("./routers/router.js")(this);

app.listen(config.port, () => {
  console.log(`Site Açıldı: http://localhost:${config.port}`);
});
