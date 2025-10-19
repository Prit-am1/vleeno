import express from "express";
import { adminAuth, userAuth } from "./Middleware/auth.js";

const app = express();

app.use("/admin", adminAuth);

app.use("/admin/access", (req, res, next) => {
    res.send("Admin Access Granted!😀");
});

app.use("/admin/data", (req, res, next) => {
    res.send("Admin Data Fetched!😀");
});

app.use("/user", userAuth);

app.use("/user/data", (req, res, next) => {
    res.send("User Data Fetched!😀");
});

app.use("/user/access", (req, res, next) => {
    res.send("User Access Granted!😀");
});

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// app.get("/check", (req, res, next) => {
//     res.send("This is check 1!");
//     // next();
// }, (req, res, next) => {
//     // res.send("This is check 2!");
//     next();
// }, (req, res, next) => {
//     // res.send("This is check 3!");
//     next();
// });

// app.get("/test/:userId", (req, res) => {
//     console.log(req.query);
//     console.log(req.params);
//     res.send("This is a test route!");
// });

app.listen(7777, () => {
    console.log("Server is running on http://localhost:7777");
});