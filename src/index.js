import mongoose from "mongoose";
import app from "./app.js";
import logger from "./configs/logger.js";

//env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

//exit on mongodb error
mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error: ${err} `);
  process.exit(1);
});
//mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}
//MONGODB connection
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connected to mongodb");
  });

let server;

server = app.listen(PORT, () => {
  logger.info(`app is listening at Port:${PORT}.`);
});

//handle server errors

const exitHandler = () => {
  if (server) {
    logger.info("Server closed");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

//process.on("uncaughtException", unexpectedErrorHandler);
//process.on("unhandeledRejection", unexpectedErrorHandler);

//process.on("SIGTERM")
