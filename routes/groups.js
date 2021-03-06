const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const Lesson = require("../models/Lesson");
const Faculty = require("../models/Faculty");
const Specialty = require("../models/Specialty");
const Group = require("../models/Group");

// Создать группу GET
router.get("/create", auth, async (req, res) => {
  const faculties = await Faculty.find();
  const specialties = await Specialty.find();

  let isUser = false;
  if (req.session.user) {
    isUser = true;
  }

  res.render("createGroup", {
    faculties: faculties,
    specialties: specialties,
    isUser: isUser
  });
});

// Создать группу POST
router.post(
  "/create",
  auth,
  [
    check("faculty", "Факультет группы обязательна к заполнению")
      .not()
      .isEmpty(),
    check("specialty", "Специальность группы обязательна к заполнению")
      .not()
      .isEmpty(),
    check("name", "Название группы обязательна к заполнению")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { faculty, specialty, name } = req.body;

    try {
      /* let fac = await Faculty.findById({ faculty });
      let spec = await Specialty.findById({ specialty }); */

      let group = await Group.find()
        /* .where("faculty")
        .equals(faculty)
        .where("specialty")
        .equals(specialty) */
        .where("name")
        .equals(name);

      if (group.length > 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Группа уже существует" }] });
      }

      const newGroup = new Group({
        name: name,
        faculty: faculty,
        specialty: specialty
      });

      group = await newGroup.save();

      res.redirect("/");
    } catch (err) {
      console.error(err.message);
      return res.render("404");
    }
  }
);

// Получить список групп по специальности
router.get("/:id", async (req, res) => {
  const groups = await Group.find()
    .where("specialty")
    .equals(req.params.id);

  res.json(groups);
});

router.get("/", async (req, res) => {
  const groups = await Group.find().populate("specialty");

  let isUser = false;
  if (req.session.user) {
    isUser = true;
  }

  res.render("groups", { title: "Все группы", groups: groups, isUser: isUser });
});

// Удалить ОДНУ группу
router.delete("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: "Группа не найдена" });
    }

    await Lesson.find({ group: req.params.id }).deleteMany();

    await group.remove();

    res.redirect("/groups");
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      let er = [
        {
          msg: `Группа не найдена!`
        }
      ];

      return res.render("error", { errors: er });
    }
    return res.render("404");
  }
});

module.exports = router;
