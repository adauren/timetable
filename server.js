const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

connectDB();

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "pug");
app.use(express.static("public"));

app.use(
  express.json({ extended: false }),
  express.urlencoded({ extended: true })
);

app.use("/", require("./routes/index"));
app.use("/groups", require("./routes/groups"));
app.use("/lessons", require("./routes/lessons"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
