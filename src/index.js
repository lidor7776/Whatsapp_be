import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

//env variables
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`app is listening at Port:${PORT}...`);
});
