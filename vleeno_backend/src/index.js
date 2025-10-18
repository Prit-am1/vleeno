import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/check", (req, res, next) => {
    res.send("This is check 1!");
    // next();
}, (req, res, next) => {
    // res.send("This is check 2!");
    next();
}, (req, res, next) => {
    // res.send("This is check 3!");
    next();
});

app.get("/test/:userId", (req, res) => {
    console.log(req.query);
    console.log(req.params);
    res.send("This is a test route!");
});

app.listen(7777, () => {
    console.log("Server is running on http://localhost:7777");
});