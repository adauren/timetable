const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Lesson = require("../models/Lesson");
const Group = require("../models/Group");

// Создать урок для группы GET
router.get("/create", async (req, res) => {
  const groups = await Group.find();
  res.render("createLesson", { groups: groups });
});

// Создать урок для группы POST
router.post(
  "/create",
  [
    check("name", "Выберите группу")
      .not()
      .isEmpty(),
    check("room", "Кабинет урока обязательна к заполнению")
      .not()
      .isEmpty(),
    check("subject", "Название урока обязательна к заполнению")
      .not()
      .isEmpty(),
    check("day", "День урока обязательна к заполнению")
      .not()
      .isEmpty(),
    check("type", "Тип занятия обязательна к заполнению")
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

    var { room, subject, day, type, time, name } = req.body;

    try {
      await Group.findOne({ name: name });
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({
        errors: [{ msg: `Такая группа не существует` }]
      });
    }

    try {
      let timeOrder = time;

      switch (time) {
        case "1":
          time = "08:30 - 09:20";
          break;
        case "2":
          time = "09:35 - 10:25";
          break;
        case "3":
          time = "10:40 - 11:30";
          break;
        case "4":
          time = "11:45 - 12:35";
          break;
        case "5":
          time = "12:50 - 13:40";
          break;
        case "6":
          time = "14:00 - 14:50";
          break;
        case "7":
          time = "15:05 - 15:55";
          break;
        case "8":
          time = "16:10 - 17:00";
          break;
        case "9":
          time = "17:15 - 18:05";
          break;
        case "10":
          time = "18:20 - 19:10";
          break;
        case "11":
          time = "19:25 - 20:25";
          break;
        case "12":
          time = "20:40 - 21:30";
          break;
        default:
          break;
      }

      let lesson = await Lesson.find()
        .where("room")
        .equals(room)
        .where("day")
        .equals(day)
        .where("time")
        .equals(time);

      let group = await Group.findOne({ name: name });
      let lessonByGroup = await Lesson.find()
        .where("day")
        .equals(day)
        .where("time")
        .equals(time)
        .where("group")
        .equals(group.id);

      if (lesson.length > 0) {
        return res.status(400).json({
          errors: [{ msg: `Кабинет ${room} на время ${time} уже занята` }]
        });
      }

      if (lessonByGroup.length > 0) {
        return res.status(400).json({
          errors: [
            { msg: `У группы ${group.name} на время ${time} уже есть занятия` }
          ]
        });
      }

      const newLesson = new Lesson({
        room: room,
        name: subject,
        type: type,
        day: day,
        time: time,
        timeOrder: timeOrder,
        group: group.id
      });

      lesson = await newLesson.save();

      res.redirect(`show?name=${group.name}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Ошибка сервера");
    }
  }
);

// Уроки одной группы
router.get(
  "/show",
  [
    check("name", "Вы должны выбрать группу")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const group = await Group.findOne({ name: req.query.name });

      const lessons = await Lesson.find()
        .where("group")
        .equals(group.id)
        .sort({ timeOrder: 1 });

      res.render("schedule", {
        lessons: lessons,
        group: group,
        title: `Расписание группы ${group.name}`
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Ошибка сервера");
    }
  }
);

// Удалить урок
router.delete("/:lesson_id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lesson_id);

    if (!lesson) {
      return res.status(404).json({ msg: "Урок не найден" });
    }

    await lesson.remove();
    return;
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Урок не найден" });
    }
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
