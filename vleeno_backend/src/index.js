import express from "express";
import connectDB from "./config/database.js";
import User from "./models/user.js";

const app = express();

app.post("/signup", async (req, res) => {
  const userInfo = new User({
    name: "Pritam Roy Chowdhury",
    email: "Lk3Yg@example.com",
    password: "pritam123",
    age: 32,
    gender: "Male",
    isAdmin: false,
  });

  try {
    await userInfo.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("User creation failed!😒");
  }
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(7777, () => {
      console.log("Server is running on http://localhost:7777");
    });
  })
  .catch(() => console.log("Something went wrong"));
