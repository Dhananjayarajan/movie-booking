const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// Register a new user
router.post("/register", async (req, res) => {
  console.log("📥 POST /api/users/register called");
  console.log("Request body:", req.body);

  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      console.log("❌ User already exists:", req.body.email);
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();

    console.log("✅ New user registered:", req.body.email);
    res.send({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("❌ Error in /register:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  console.log("📥 POST /api/users/login called");
  console.log("Request body:", req.body);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("❌ User not found:", req.body.email);
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      console.log("❌ Invalid password for:", req.body.email);
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    console.log("✅ User logged in:", req.body.email);
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    console.error("❌ Error in /login:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  console.log("📥 GET /api/users/get-current-user called");
  console.log("Authenticated user ID:", req.userId);

  try {
    const user = await User.findById(req.userId).select("-password");

    console.log("✅ User fetched:", user.email);
    res.send({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ Error in /get-current-user:", error);
    res.send({
      success: false,
      message: error.message,
    });
  }
});
