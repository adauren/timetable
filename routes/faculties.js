const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const Faculty = require("../models/Faculty");
const Lesson = require("../models/Lesson");
const Group = require("../models/Group");
const Specialty = require("../models/Specialty");

// Все факультеты
router.get("/", auth, async (req, res) => {
  try {
    const faculties = await Faculty.find();

    let isUser = false;
    if (req.session.user) {
      isUser = true;
    }

    res.render("faculties", {
      title: "Все Факультеты",
      faculties: faculties,
      isUser: isUser
    });
  } catch (err) {
    console.error(err.message);
    return res.render("404");
  }
});

// Создать факультет GET
router.get("/create", auth, async (req, res) => {
  let isUser = false;
  if (req.session.user) {
    isUser = true;
  }
  res.render("createFaculty", { isUser: isUser });
});

// Создать факультет POST
router.post(
  "/create",
  auth,
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
      return res.render("404");
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
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
      let er = [
        {
          msg: `Факультет не найден!`
        }
      ];

      return res.render("error", { errors: er });
    }
    return res.render("404");
  }
});

module.exports = router;
