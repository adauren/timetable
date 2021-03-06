const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "faculty"
  },
  specialty: {
    type: Schema.Types.ObjectId,
    ref: "specialty"
  }
});

module.exports = Group = mongoose.model("group", GroupSchema);
