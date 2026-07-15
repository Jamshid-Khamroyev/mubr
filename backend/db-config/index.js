const mongoose = require("mongoose");

const mainDb = mongoose.createConnection(process.env.MONGO_URL_MAIN, {
  dbName: "Quiz",
});

const publicDb = mongoose.createConnection(process.env.MONGO_URL_SECONDARY, {
  dbName: "Public",
});

module.exports = {
  mainDb,
  publicDb,
};
