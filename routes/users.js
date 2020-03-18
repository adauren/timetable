const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const User = require("../models/User");

// Создать пользователя POST
router.post(
  "/",
  [
    check("name", "Имя пользователя обязательна к заполнению")
      .not()
      .isEmpty(),
    check("email", "Укажите почтовый ящик в правильном формате").isEmail(),
    check(
      "password",
      "Создайте пароль с длиной минимум в 6 символов"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Пользователь уже существует" }] });
      }

      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      req.session.user = true;

      res.redirect("/");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Создать пользователя GET
router.get("/", (req, res) => {
  res.render("users");
});

module.exports = router;
