const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Ensure ./files folder exists
if (!fs.existsSync("./files")) {
  fs.mkdirSync("./files");
}

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home page - list tasks
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) return res.status(500).send("Failed to read task list");
    res.render("index", { files });
  });
});

// Create task
app.post("/create", (req, res) => {
  const fileName = req.body.title.trim().split(" ").join("") + ".txt";
  const filePath = path.join(__dirname, "files", fileName);
  fs.writeFile(filePath, req.body.details, (err) => {
    if (err) return res.status(500).send("Failed to create task");
    res.redirect("/");
  });
});

// Read task
app.get("/file/:fileName", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.fileName);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Failed to read task");
    res.render("task", {
      title: req.params.fileName.replace(".txt", ""),
      details: data,
    });
  });
});

// Delete task
app.get("/delete/:fileName", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.fileName);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send("Failed to delete task");
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
