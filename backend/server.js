const fs = require("fs");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(express.json());
const userRouter = require("./routes/userRoutes");
const port = process.env.PORT || 5000;

//mongodb datatbase
main().catch((error) => {
  console.log(error);
});
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("database connected successfully");
}

app.get("/api/data", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});
app.get("/api/data/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("state.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);
    const filteredData = jsonData.filter((item) => item.country_id === id);
    console.log(filteredData);
    res.json(filteredData);
  });
});

//---------------------------------------------------------------------
//body praser
app.use(cors());
app.use(express.json());
app.use("/user", userRouter.router);

app.listen(port, () => {
  console.log(`server is run at port :${port}`);
});
