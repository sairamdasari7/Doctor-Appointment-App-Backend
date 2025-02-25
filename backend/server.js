require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
