
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();
dns.setServers(["8.8.8.8", "1.1.1.1"])
const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "https://event-registation-form.netlify.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// MongoDB Connection
// Note: In newer Mongoose versions, options like useNewUrlParser are default
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Schema
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  event: { type: String, required: true }
}, { timestamps: true }); // Good practice to track when people registered

// Model
const Registration = mongoose.model("Registration", registrationSchema);

// API Route
app.post("/register", async (req, res) => {
  try {
    // Optional: Check if data exists
    if (!req.body.email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const newUser = new Registration(req.body);
    await newUser.save();

    res.status(201).json({
      message: "🎉 Registration Successful!"
    });

  } catch (err) {
    console.error(err); // Log the actual error for debugging
    res.status(500).json({
      message: "❌ Error Saving Data",
      error: err.message 
    });
  }
});

// Server Start - Added a fallback port (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
