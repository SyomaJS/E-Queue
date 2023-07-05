const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");

const PORT = config.get("port") || 3030;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api", require("./routes/index.routes"));

async function connect() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Internal error: ", error);
  }
}

connect();
