const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    console.log("Connection");
});

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname + "/style.css");
});

app.get("/index.js", (req, res) => {
    res.sendFile(__dirname + "/index.js");
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
});