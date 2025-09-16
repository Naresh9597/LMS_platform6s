const { users } = require("../data/mockdata");
const jwt = require("jsonwebtoken");

// Use an environment variable for production
const SECRET_KEY = process.env.JWT_SECRET;

const login = (req, res) => {
  const { username, password } = req.body;

  // Find user in mock data
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // ✅ Generate JWT token with user info
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        name: user.name,
      },
      SECRET_KEY,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Send response including token
    res.json({
      success: true,
      token, // <- this is the new JWT token
      role: user.role,
      name: user.name,
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { login, authenticate };
