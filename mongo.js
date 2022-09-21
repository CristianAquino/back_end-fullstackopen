const mongoose = require("mongoose");

const conectionString = process.env.MONGO_DB_URI;
mongoose
  .connect(conectionString)
  .then(() => console.log("conectado"))
  .catch((e) => console.error(e));
