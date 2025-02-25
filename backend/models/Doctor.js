const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: { type: Object, required: true }, // { start: "09:00", end: "17:00" }
});

module.exports = mongoose.model("Doctor", DoctorSchema);
