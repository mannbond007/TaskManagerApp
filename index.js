const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync("./files")) {
  fs.mkdirSync("./files");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) return res.status(500).send("Failed to read task list");
    res.render("index", { files });
  });
});

app.post("/create", (req, res) => {
  const fileName = req.body.title.trim().replace(/\s+/g, "") + ".txt";
  const filePath = path.join(__dirname, "files", fileName);
  fs.writeFile(filePath, req.body.details, (err) => {
    if (err) return res.status(500).send("Failed to create task");
    res.redirect("/");
  });
});

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

app.get("/delete/:fileName", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.fileName);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send("Failed to delete task");
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
