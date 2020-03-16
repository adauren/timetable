const express = require("express");
/* const cookieParser = require("cookie-parser"); */
const cookieSession = require("cookie-session");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
/* app.use(cookieParser()); */
app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

connectDB();

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "pug");
app.use(express.static("public"));

app.use(
  express.json({ extended: false }),
  express.urlencoded({ extended: true })
);

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/groups", require("./routes/groups"));
app.use("/lessons", require("./routes/lessons"));
app.use("/faculties", require("./routes/faculties"));
app.use("/specialties", require("./routes/specialties"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
