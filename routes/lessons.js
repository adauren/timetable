const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Lesson = require("../models/Lesson");
const Group = require("../models/Group");
const Faculty = require("../models/Faculty");

// Создать урок для группы GET
router.get("/create", async (req, res) => {
  const groups = await Group.find();
  const faculties = await Faculty.find();
  return res.render("createLesson", { groups: groups, faculties: faculties });
});

// Создать урок для группы POST
router.post(
  "/create",
  [
    check("groupName", "Выберите группу")
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
      .isEmpty(),
    check("lessonCount", "Количество занятии обязательна к заполнению")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var { room, subject, day, type, time, groupName, lessonCount } = req.body;

    time = parseInt(time);
    try {
      await Group.findOne({ name: groupName });
    } catch (err) {
      console.error(err.message);
      let er = [
        {
          msg: `Такая группа не существует`
        }
      ];

      return res.render("error", { errors: er });
    }

    try {
      let timeOrder = time;

      let times = [];
      for (let i = 0; i < lessonCount; i++) {
        switch (time) {
          case 1:
            times[i] = "08:30 - 09:20";
            break;
          case 2:
            times[i] = "09:35 - 10:25";
            break;
          case 3:
            times[i] = "10:40 - 11:30";
            break;
          case 4:
            times[i] = "11:45 - 12:35";
            break;
          case 5:
            times[i] = "12:50 - 13:40";
            break;
          case 6:
            times[i] = "14:00 - 14:50";
            break;
          case 7:
            times[i] = "15:05 - 15:55";
            break;
          case 8:
            times[i] = "16:10 - 17:00";
            break;
          case 9:
            times[i] = "17:15 - 18:05";
            break;
          case 10:
            times[i] = "18:20 - 19:10";
            break;
          case 11:
            times[i] = "19:25 - 20:25";
            break;
          case 12:
            times[i] = "20:40 - 21:30";
            break;
          default:
            break;
        }

        time++;
      }

      time = timeOrder;

      let lessons = [];
      let lessonsByGroup = [];
      let group = await Group.findOne({ name: groupName });

      for (let i = 0; i < times.length; i++) {
        lessons[i] = await Lesson.find()
          .where("room")
          .equals(room)
          .where("day")
          .equals(day)
          .where("time")
          .equals(times[i]);

        lessonsByGroup[i] = await Lesson.find()
          .where("day")
          .equals(day)
          .where("time")
          .equals(times[i])
          .where("group")
          .equals(group.id);
      }

      lessons = lessons.flat();
      if (lessons.length > 0) {
        let er = [
          { msg: `Кабинет ${room} на время ${lessons[0].time} уже занята` }
        ];

        return res.render("error", { errors: er });
      }

      lessonsByGroup = lessonsByGroup.flat();
      if (lessonsByGroup.length > 0) {
        let er = [
          {
            msg: `У группы ${group.name} на время ${lessonsByGroup[0].time} уже есть занятия`
          }
        ];

        return res.render("error", { errors: er });
      }

      times.map(async time => {
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

        timeOrder++;
      });

      return res.redirect(`show?groupName=${group.name}`);
    } catch (err) {
      console.error(err.message);
      return res.render("404");
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
      const group = await Group.findOne({ name: req.query.groupName });

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
      return res.render("404");
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
      let er = [
        {
          msg: `Занятие не найдена`
        }
      ];

      return res.render("error", { errors: er });
    }
    return res.render("404");
  }
});

module.exports = router;
