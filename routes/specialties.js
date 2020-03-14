const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Specialty = require("../models/Specialty");
const Faculty = require("../models/Faculty");
const Group = require("../models/Group");
const Lesson = require("../models/Lesson");

router.get("/", async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.render("specialties", {
      title: "Все специальности",
      specialties: specialties
    });
  } catch (err) {
    console.error(err.message);
    return res.render("404");
  }
});

// Создать специальность GET
router.get("/create", async (req, res) => {
  const faculties = await Faculty.find();
  res.render("createSpecialty", { faculties: faculties });
});

// Создать специальность POST
router.post(
  "/create",
  [
    check("name", "Название специальности обязательна к заполнению")
      .not()
      .isEmpty(),
    check("faculty", "Факультет специальности обязательна к заполнению")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, faculty } = req.body;

    const newSpecialty = new Specialty({
      name: name,
      faculty: faculty
    });

    await newSpecialty.save();

    res.redirect("/specialties/create");
  }
);

// Специальности факультета
router.get("/:faculty_id", async (req, res) => {
  try {
    const specialties = await Specialty.find()
      .where("faculty")
      .equals(req.params.faculty_id);
    res.json(specialties);
  } catch (err) {
    console.error(err.message);
    return res.render("404");
  }
});

// Удалить специальность
router.get("/delete/:specialty_id", async (req, res) => {
  try {
    const specialty = await Specialty.findById(req.params.specialty_id);

    if (!specialty) {
      return res.status(404).json({ msg: "Такая специальность не найдена" });
    }

    const groups = await Group.find({ specialty: req.params.specialty_id });

    groups.map(async group => {
      await Lesson.find({ group: group.id }).deleteMany();
    });

    await Group.find({ specialty: req.params.specialty_id }).deleteMany();

    await specialty.deleteOne();

    res.redirect("/specialties");
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      let er = [
        {
          msg: `Такая специальность не найдена`
        }
      ];

      return res.render("error", { errors: er });
    }
    return res.render("404");
  }
});

module.exports = router;
