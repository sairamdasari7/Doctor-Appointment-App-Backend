const express = require("express");
const { getDoctors, getDoctorSlots } = require("../controllers/doctorController");

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id/slots", getDoctorSlots);

module.exports = router;
