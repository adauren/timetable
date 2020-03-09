const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Lesson = require("../models/Lesson");
const Group = require("../models/Group");

// Создать урок для группы POST
router.post(
  "/create",
  [
    check("room", "Кабинет урока обязательна к заполнению")
      .not()
      .isEmpty(),
    check("name", "Название урока обязательна к заполнению")
      .not()
      .isEmpty(),
    check("time", "Время урока обязательна к заполнению")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { room, name, time } = req.body;

    try {
      await Group.findЩту({ name: req.query.name });
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({
        errors: [{ msg: `Такая группа не существует` }]
      });
    }

    try {
      let lesson = await Lesson.find()
        .where("room")
        .equals(room)
        .where("time")
        .equals(time);

      if (lesson.length > 0) {
        return res.status(400).json({
          errors: [{ msg: `Кабинет ${room} на время ${time} уже занята` }]
        });
      }

      const newLesson = new Lesson({
        room: room,
        name: name,
        time: time,
        group: req.params.group_id
      });

      lesson = await newLesson.save();

      res.json(lesson);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Ошибка сервера");
    }
  }
);

// Уроки одной группы
router.get("/show", async (req, res) => {
  try {
    const group = await Group.findOne({ name: req.query.name });

    const lessons = await Lesson.find()
      .where("group")
      .equals(group.id);

    res.render("schedule", {
      lessons: lessons,
      group: group,
      title: `Расписание группы ${group.name}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// Удалить урок
router.delete("/:lesson_id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lesson_id);

    if (!lesson) {
      return res.status(404).json({ msg: "Урок не найден" });
    }

    await lesson.remove();

    res.json({ msg: "Урок удален" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Урок не найден" });
    }
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
