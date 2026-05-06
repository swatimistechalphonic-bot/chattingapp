const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.checkUser = async (req, res) => {
  const { user_id } = req.body;

  try {
    const [result] = await db.execute(
      "SELECT id FROM users WHERE user_id = ?",
      [user_id]
    );

    if (result.length === 0) {
      return res.json({ status: false, message: "Invalid User ID" });
    }

    res.json({ status: true, message: "User Found" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.register = async (req, res) => {
  const { user_id, passkey } = req.body;

  try {
    // Check if user already exists
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE user_id = ?",
      [user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passkey_hash = await bcrypt.hash(passkey, salt);

    const [result] = await db.execute(
      "INSERT INTO users (user_id, passkey_hash) VALUES (?, ?)",
      [user_id, passkey_hash]
    );

    res.json({
      status: true,
      message: "User registered successfully",
      id: result.insertId,
      user_id: user_id
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  const { user_id, passkey } = req.body;

  try {
    const [result] = await db.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );

    if (result.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result[0];

    const isMatch = await bcrypt.compare(passkey, user.passkey_hash);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong passkey" });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: true,
      token,
      id: user.id,
      user_id: user.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
