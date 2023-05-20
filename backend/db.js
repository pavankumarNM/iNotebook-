const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) =>
      console.log("Error Connecting to MongoDB", error.message)
    );
};

module.exports = connectToMongo;
