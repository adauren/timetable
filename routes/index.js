const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Lesson = require("../models/Lesson");
const Group = require("../models/Group");
const Faculty = require("../models/Faculty");
const Specialty = require("../models/Specialty");

// Форма вывода расписании
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    const specialties = await Specialty.find();
    const groups = await Group.find();

    res.render("index", {
      faculties: faculties,
      specialties: specialties,
      groups: groups
    });
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
