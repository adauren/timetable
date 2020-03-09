const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Lesson = require("../models/Lesson");
const Group = require("../models/Group");

// Форма вывода расписании
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();

    res.render("index", { groups: groups });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// Перерыв
router.get("/breaks", async (req, res) => {
  res.render("breaks");
});

module.exports = router;
