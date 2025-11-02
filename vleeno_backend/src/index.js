// index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/database.js";
import userRouter from "./routes/usersRoute.js";

const app = express(); // create express app
app.use(cors()); // enable CORS
app.use(express.json({ limit: "10kb" })); // body parser
app.use(helmet()); // set secure headers

app.use("/api/users", userRouter); // user routes

// connect to database and start server

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(7777, () => {
      console.log("Server is running on http://localhost:7777");
    });
  })
  .catch(() => console.log("Something went wrong"));
