const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const Specialty = require("../models/Specialty");
const Faculty = require("../models/Faculty");
const Group = require("../models/Group");
const Lesson = require("../models/Lesson");

router.get("/", auth, async (req, res) => {
  try {
    const specialties = await Specialty.find();

    let isUser = false;
    if (req.session.user) {
      isUser = true;
    }

    res.render("specialties", {
      title: "Все специальности",
      specialties: specialties,
      isUser: isUser
    });
  } catch (err) {
    console.error(err.message);
    return res.render("404");
  }
});

// Создать специальность GET
router.get("/create", auth, async (req, res) => {
  const faculties = await Faculty.find();

  let isUser = false;
  if (req.session.user) {
    isUser = true;
  }

  res.render("createSpecialty", { faculties: faculties, isUser: isUser });
});

// Создать специальность POST
router.post(
  "/create",
  auth,
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

    let isUser = false;
    if (req.session.user) {
      isUser = true;
    }
    res.json(specialties);
  } catch (err) {
    console.error(err.message);
    return res.render("404");
  }
});

// Удалить специальность
router.get("/delete/:specialty_id", auth, async (req, res) => {
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
