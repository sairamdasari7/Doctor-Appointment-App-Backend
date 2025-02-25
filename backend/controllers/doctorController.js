const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const moment = require("moment");

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error });
  }
};

exports.getDoctorSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  // ✅ Validate that 'id' is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Doctor ID format" });
  }

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ Validate date format
    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    let availableSlots = [];
    let startTime = moment(`${date} ${doctor.workingHours.start}`, "YYYY-MM-DD HH:mm");
    let endTime = moment(`${date} ${doctor.workingHours.end}`, "YYYY-MM-DD HH:mm");

    // ✅ Ensure valid working hours
    if (!startTime.isValid() || !endTime.isValid()) {
      return res.status(400).json({ message: "Invalid doctor working hours format" });
    }

    // ✅ Generate available slots in 30-minute intervals
    while (startTime.isBefore(endTime)) {
      availableSlots.push(startTime.format("HH:mm"));
      startTime.add(30, "minutes");
    }

    // ✅ Fetch booked appointments and remove booked slots
    const bookedAppointments = await Appointment.find({
      doctorId: id,
      date: { 
        $gte: new Date(`${date}T00:00:00Z`), 
        $lt: new Date(`${date}T23:59:59Z`) 
      }
    });

    bookedAppointments.forEach((appt) => {
      availableSlots = availableSlots.filter((slot) => slot !== moment(appt.date).format("HH:mm"));
    });

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: "Error fetching available slots", error });
  }
};
