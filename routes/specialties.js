const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Specialty = require("../models/Specialty");
const Faculty = require("../models/Faculty");

router.get("/", async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.render("specialties", {
      title: "Все специальности",
      specialties: specialties
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
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
    res.status(500).send("Ошибка сервера");
  }
});

// Удалить специальность
router.get("/delete/:specialty_id", async (req, res) => {
  try {
    const specialty = await Specialty.findById(req.params.specialty_id);

    if (!specialty) {
      return res.status(404).json({ msg: "Такая специальность не найдена" });
    }

    await specialty.remove();

    res.redirect("/specialties");
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "акая специальность не найдена" });
    }
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
