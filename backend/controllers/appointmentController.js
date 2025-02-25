const Appointment = require("../models/Appointment");

// Fetch all appointments with populated doctor details
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error });
  }
};

// Book a new appointment and return the appointment with populated doctor details
exports.bookAppointment = async (req, res) => {
  const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required." });
  }

  try {
    const appointment = new Appointment({ doctorId, date, duration, appointmentType, patientName, notes });
    await appointment.save();
    // Re-query to populate doctorId
    const populatedAppointment = await Appointment.findById(appointment._id).populate("doctorId");
    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

// Update an appointment and return the updated document with populated doctor details
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(id, updatedData, { new: true }).populate("doctorId");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment canceled" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling appointment", error });
  }
};
