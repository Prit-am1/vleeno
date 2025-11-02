import { Schema, model } from "mongoose";

// ✅ Regex helpers for cleaner schema
const nameRegex = /^[A-Z][a-zA-Z]+(?:[ '-][A-Za-z]+)*$/;
const locationRegex = /^[A-Z][A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
      required: [true, "Name is required"],
      validate: {
        validator: (value) => nameRegex.test(value),
        message:
          "Name must start with uppercase and contain only alphabets, space, hyphen or apostrophe",
      },
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: "Invalid email format",
      },
    },

    address: {
      city: {
        type: String,
        trim: true,
        required: [true, "City is required"],
        validate: {
          validator: (value) => locationRegex.test(value),
          message:
            "City must start with uppercase and contain only alphabet characters",
        },
      },
      state: {
        type: String,
        trim: true,
        required: [true, "State is required"],
        validate: {
          validator: (value) => locationRegex.test(value),
          message:
            "State must start with uppercase and contain only alphabet characters",
        },
      },
      country: {
        type: String,
        trim: true,
        required: [true, "Country is required"],
        validate: {
          validator: (value) => locationRegex.test(value),
          message:
            "Country must start with uppercase and contain only alphabet characters",
        },
      },
    },

    password: {
      type: String,
      select: false, // ✅ Good security practice
      required: [true, "Password is required"],
      minlength: [8, "Min length is 8"],
      maxlength: [12, "Max length is 12"],
      validate: {
        validator: (value) => passwordRegex.test(value),
        message:
          "Password must contain at least 1 letter, 1 number & 1 special character",
      },
    },

    age: {
      type: Number,
      min: [18, "Minimum age of 18 is required"],
      required: [true, "Age required"],
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be either male, female or other",
      },
      lowercase: true,
      trim: true,
      required: [true, "Gender required"],
    },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("User", userSchema, "users");
