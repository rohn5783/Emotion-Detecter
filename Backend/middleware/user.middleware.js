import jwt from "jsonwebtoken";
import BlackList from "../model/blacklist.model.js";
// import jwt from "jsonwebtoken";
import redis from "../config/cache.js";


async function identifyUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

  const isTokenBlacklisted = await redis.get(token);
  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "invalid token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

export default identifyUser;
