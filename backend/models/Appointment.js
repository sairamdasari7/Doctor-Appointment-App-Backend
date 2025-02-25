const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // ✅ Ensure it's an ObjectId
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  appointmentType: { type: String, required: true },
  patientName: { type: String, required: true },
  notes: { type: String }
});

// ✅ Ensure `doctorId` is returned as a string in API responses
appointmentSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.doctorId = ret.doctorId ? ret.doctorId.toString() : null;
    return ret;
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
