const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const Lesson = require("../models/Lesson");
const Group = require("../models/Group");
const Faculty = require("../models/Faculty");
const Specialty = require("../models/Specialty");

router.get("/login", (req, res) => {
  let isUser = false;
  if (req.session.user) {
    isUser = true;
  }
  res.render("login", { isUser: isUser });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);

  if (!user && !isMatch) {
    req.session.errors = ["Неправильные данные"];
    res.redirect("/login");
  } else {
    req.session.user = true;
    res.redirect("/");
  }
});

router.get("/logout", auth, (req, res) => {
  req.session = null;
  res.redirect("/");
});

// Форма вывода расписании
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    const specialties = await Specialty.find();
    const groups = await Group.find();

    let isUser = false;
    if (req.session.user) {
      isUser = true;
    }

    res.render("index", {
      faculties: faculties,
      specialties: specialties,
      groups: groups,
      isUser: isUser
    });
  } catch (err) {
    console.error(err.message);
    return res.render("404");
  }
});

// Перерыв
router.get("/breaks", async (req, res) => {
  let isUser = false;
  if (req.session.user) {
    isUser = true;
  }
  return res.render("breaks", { isUser: isUser });
});

module.exports = router;
