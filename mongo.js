const mongoose = require("mongoose");

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;

const conectionString = NODE_ENV == "test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;
mongoose
  .connect(conectionString)
  .then(() => console.log("conectado"))
  .catch((e) => console.error(e));
