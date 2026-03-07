import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlackList from "../model/blacklist.model.js";
import redis from "../config/cache.js";

/* ================= REGISTER ================= */

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    

    const isAlreadyRegistered = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isAlreadyRegistered) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/* ================= LOGIN ================= */

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

/* ================= GET USER ================= */

async function getUser(req, res) {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User fetched successfully",
    user,
  });
}

//  log out user

async function logoutUser(req, res) {
  const token = req.cookies.token;
  res.clearCookie("token");
 await redis.set(token,Date.now().toString(),"EX",3600);
  // await BlackList.create({
  //   token,
  // });
  res.status(200).json({
    message: "User logged out successfully",
  });
}



export default { registerUser, loginUser, getUser, logoutUser };
