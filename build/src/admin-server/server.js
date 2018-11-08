const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = 4567;
const fs = require("fs");

// default options
app.use(fileUpload());

const clientapp = __dirname + "/../admin-client/build";

app.use(express.static(clientapp));

files = [
  {
    destination: __dirname + "/data/keystore/wallet",
    filename: "wallet",
    description: "Your GETH compatible keystore file"
  },
  {
    destination: __dirname + "/data/password",
    filename: "password",
    description: "A textfile containing your password"
  }
];

app.get("/fileinfo", (req, res) => {
  const fileInfo = files.map(file => {
    file.exists = fs.existsSync(file.destination);
    return file;
  });
  return res.status(200).json(fileInfo);
});

app.post("/upload", (req, res) => {
  if (!req.body || !req.body.filename) {
    return res.status(400).send("No filename provided in upload response.");
  }
  const filename = req.body.filename;
  const fileInfo = files.find(item => {
    return item.filename === filename;
  });

  if (!fileInfo || !fileInfo.destination) {
    return res.status(400).send("Wrong filename.");
  }
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let sampleFile = req.files.file;
  sampleFile.mv(fileInfo.destination, err => {
    if (err) return res.status(500).send(err);
    res.send("File uploaded!");
  });
});

app.post("/delete", (req, res) => {
  if (!req.body || !req.body.filename) {
    return res.status(400).send("No filename provided in request.");
  }
  const filename = req.body.filename;
  const fileInfo = files.find(item => {
    return item.filename === filename;
  });
  if (!fileInfo.destination) {
    return res.status(400).send("No file path found for this file.");
  }
  console.log("Delete file", fileInfo.destination);
  fs.unlinkSync(fileInfo.destination);
  res.send("File deleted!");
});

app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! serving from ${clientapp}`
  )
);
