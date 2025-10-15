import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/test", (req, res) => {
    res.send("This is a test route!");
});

app.listen(7777, () => {
    console.log("Server is running on http://localhost:7777");
});