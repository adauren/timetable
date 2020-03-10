const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Faculty = require("../models/Faculty");

// Все факультеты
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find();

    res.render("faculties", { faculties: faculties });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// Создать факультет GET
router.get("/create", async (req, res) => {
  res.render("createFaculty");
});

// Создать факультет POST
router.post(
  "/create",
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
      res.status(500).send("Ошибка сервера");
    }
  }
);

module.exports = router;
