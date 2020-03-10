const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialtySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "faculty"
  }
});

module.exports = Specialty = mongoose.model("specialty", SpecialtySchema);
