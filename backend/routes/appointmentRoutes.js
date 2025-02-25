const express = require("express");
const {
  getAppointments,
  bookAppointment,
  updateAppointment,  // Make sure this function is properly imported
  cancelAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

router.get("/", getAppointments);
router.post("/", bookAppointment);
router.put("/:id", updateAppointment); // This is where the error occurs
router.delete("/:id", cancelAppointment);

module.exports = router;
