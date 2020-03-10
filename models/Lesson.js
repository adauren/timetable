const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: Number,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  timeOrder: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "group"
  }
});

module.exports = Lesson = mongoose.model("lesson", LessonSchema);
