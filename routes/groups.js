const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Lesson = require("../models/Lesson");
const Faculty = require("../models/Faculty");
const Specialty = require("../models/Specialty");
const Group = require("../models/Group");

// Создать группу GET
router.get("/create", async (req, res) => {
  const faculties = await Faculty.find();
  const specialties = await Specialty.find();

  res.render("createGroup", { faculties: faculties, specialties: specialties });
});

// Создать группу POST
router.post(
  "/create",
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
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", async (req, res) => {
  const groups = await Group.find();

  res.render("groups", { title: "Все группы", groups: groups });
});

// Удалить ОДНУ группу
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: "Группа не найдена" });
    }

    await group.remove();

    res.redirect("/groups");
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Группа не найдена!" });
    }
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
