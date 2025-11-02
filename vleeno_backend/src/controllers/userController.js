// userController.js
import express from "express";
import User from "../models/User.js";
import mongoose from "mongoose";
import mongoSanitize from "mongo-sanitize"; // lightweight sanitizer

const app = express();

// --- Safe sanitizer middleware (mutates existing req objects)
function safeSanitizeMiddleware(req, res, next) {
  const mutate = (obj) => {
    if (!obj || typeof obj !== "object") return;
    // deep-clone to plain object first
    const plain = JSON.parse(JSON.stringify(obj));
    const cleaned = mongoSanitize(plain) || {};
    // clear original keys (retain same reference)
    for (const k of Object.keys(obj)) delete obj[k];
    Object.assign(obj, cleaned);
  };
  mutate(req.body);
  mutate(req.query);
  mutate(req.params);
  next();
}

app.use(safeSanitizeMiddleware);

// ---- Helpers ----

// normalize one user document (Mongoose doc or plain object) to a consistent shape
function normalizeUser(u) {
  const doc = u && typeof u.toObject === "function" ? u.toObject() : u || {};
  return {
    id: doc._id ? String(doc._id) : null,
    name: doc.name ?? null,
    email: doc.email ?? null,
    age: doc.age ?? null,
    gender: doc.gender ? String(doc.gender).toLowerCase() : null,
    isAdmin: !!doc.isAdmin,
    address: doc.address
      ? {
          city: doc.address.city ?? null,
          state: doc.address.state ?? null,
          country: doc.address.country ?? null,
        }
      : { city: null, state: null, country: null },
    createdAt: doc.createdAt ?? null,
    updatedAt: doc.updatedAt ?? null,
  };
}

// ------------------- ROUTES -------------------

export const registerUser = async (req, res) => {
  const body = req.body || {};

  if (Object.keys(body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided to register" });
  }
  const userInfo = new User(body);

  try {
    await userInfo.save();
    return res
      .status(201)
      .json({ success: true, message: "User created successfully!😀" });
  } catch (err) {
    console.error("POST /signup error:", err);

    // Duplicate key (unique email) -> 409 Conflict
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Mongoose validation errors -> 400 Bad Request with messages
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all users (normalized)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean(); // lean() -> plain objects

    // always return 200 + array (empty array if none)
    if (!users || users.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const normalized = users.map(normalizeUser);
    return res.status(200).json({ success: true, data: normalized });
  } catch (err) {
    console.error("GET /users error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single user (normalized)
export const getSingleUser = async (req, res) => {
  const { id } = req.params;

  // 1. Validate ID format first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!😒" });
    }
    return res.status(200).json({ success: true, data: normalizeUser(user) });
  } catch (err) {
    console.error("GET /users/:id error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSingleUser = async (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  // 1️⃣ Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format" });
  }

  // 2️⃣ Empty body check
  if (Object.keys(body).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided to update" });
  }

  // 3️⃣ Allowed fields
  const fields = ["name", "password", "age", "gender", "address", "isAdmin"];
  const allowedAddressFields = ["city", "state", "country"];

  // 4️⃣ Convert address object → dot-notation automatically
  const updateData = {};

  for (const key in body) {
    if (
      key === "address" &&
      typeof body[key] === "object" &&
      !Array.isArray(body[key])
    ) {
      for (const subKey in body[key]) {
        if (!allowedAddressFields.includes(subKey)) continue;
        updateData[`address.${subKey}`] = body[key][subKey];
      }
    } else {
      updateData[key] = body[key];
    }
  }

  // 5️⃣ Validate top-level fields (simple check)
  const invalidFields = Object.keys(updateData).filter(
    (field) => !fields.includes(field) && !field.startsWith("address.")
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid fields: ${invalidFields.join(", ")}`,
    });
  }

  try {
    // 6️⃣ Update user (validators ON)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found! 😒" });
    }

    // Return normalized updated user
    return res.status(200).json({ success: true, data: normalizeUser(updatedUser) });
  } catch (err) {
    console.error("PATCH /users/:id error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // 1. Validate ID format first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format" });
  }

  try {
    const updatedUser = await User.findByIdAndDelete(id);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!😒" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully!" });
    }
  } catch (err) {
    console.error("DELETE /users/:id error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
