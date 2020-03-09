const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  room: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "group"
  }
});

module.exports = Lesson = mongoose.model("lesson", LessonSchema);
