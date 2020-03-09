const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Lesson = require("../models/Lesson");
const Group = require("../models/Group");

// Создать группу GET
router.get("/create", async (req, res) => {
  res.render("createGroup");
});

// Создать группу POST
router.post(
  "/create",
  [
    check("name", "Имя группы обязательна к заполнению")
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
      let group = await Group.findOne({ name });
      if (group) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Группа уже существует" }] });
      }

      const newGroup = new Group({
        name: name
      });

      group = await newGroup.save();

      res.render("index");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Удалить ОДНУ группу
router.delete("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: "Группа не найдена" });
    }

    await group.remove();

    res.json({ msg: "Группа удалена" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Группа не найдена" });
    }
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
