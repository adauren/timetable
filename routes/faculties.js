const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Faculty = require("../models/Faculty");
const Lesson = require("../models/Lesson");
const Group = require("../models/Group");
const Specialty = require("../models/Specialty");

// Все факультеты
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find();

    res.render("faculties", { title: "Все Факультеты", faculties: faculties });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// Создать факультет GET
router.get("/create", async (req, res) => {
  res.render("createFaculty");
});

// Создать факультет POST
router.post(
  "/create",
  [
    check("name", "Название факультета обязательна к заполнению")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const newFaculty = new Faculty({
        name: name
      });

      faculty = await newFaculty.save();

      res.redirect("/faculties");
    } catch (errr) {
      console.error(err.message);
      res.status(500).send("Ошибка сервера");
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    const specialties = await Specialty.find({
      faculty: req.params.id
    }).deleteMany();

    const groups = await Group.find({ faculty: req.params.id });

    groups.map(async group => {
      await Lesson.find({ group: group.id }).deleteMany();
    });

    await Group.find({ faculty: req.params.id }).deleteMany();

    await Faculty.findById(req.params.id).deleteOne();
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Группа не найдена!" });
    }
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
