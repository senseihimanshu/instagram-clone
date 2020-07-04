const express = require("express");
const app = express();
const cors = require("cors");
require('./database-config/config');
app.use(cors());
app.use(express.json());
require("./routes/route.js")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`-----------------Listening on port ${port}-----------------`);
});
