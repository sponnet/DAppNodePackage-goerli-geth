const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = 80;
const fs = require("fs");

// default options
app.use(fileUpload());

const clientapp = __dirname + "/../admin-client/build";

app.use(express.static(clientapp));

config = {
  wallet: {
    type: "file",
    destination: __dirname + "/data/keystore/wallet",
    description: "Your GETH compatible keystore file"
  },
  EXTRA_OPTS: {
    type: "param",
    destination: __dirname + "/data/EXTRA_OPTS",
    description: "Extra options to pass to geth"
  },
  password: {
    type: "file",
    destination: __dirname + "/data/password",
    description: "A textfile containing your password"
  }
};

app.get("/config", (req, res) => {
  Object.keys(config).forEach(file => {
    const destination = config[file].destination;
    config[file].exists = fs.existsSync(destination);
    if (config[file].type === "param"){
      // get its' value
    }
  });
  return res.status(200).json(config);
});

app.post("/param", (req, res) => {
  console.log("param", req.body);
  if (
    Object.keys(req.body) &&
    Object.keys(req.body)[0] &&
    config[Object.keys(req.body)[0]]
  ) {
    const destFile = config[Object.keys(req.body)[0]].destination;
    const value = req.body[Object.keys(req.body)[0]];
    console.log("val=", value, "dest=", destFile);
    fs.writeFile(destFile, value, err => {
      console.log("Parameter ${value} successfully written to disk");
      res.send("Parameter saved");
    });
  }
});

app.post("/file", (req, res) => {
  if (!req.body || !req.body.filename) {
    return res.status(400).send("No filename provided in upload response.");
  }
  const filename = req.body.filename;
  const fileInfo = config[filename];

  console.log(req.body);

  if (!fileInfo || !fileInfo.destination) {
    return res.status(400).send(`Wrong filename. ${filename}`);
  }

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let sampleFile = req.files.file;
  sampleFile.mv(fileInfo.destination, err => {
    if (err) return res.status(500).send(err);
    res.send("File uploaded!");
    console.log("File ${filename} successfully written to disk");
  });
});

app.post("/delete", (req, res) => {
  if (!req.body || !req.body.filename) {
    return res.status(400).send("No filename provided in request.");
  }
  const fileName = req.body.filename;
  const fileInfo = config[fileName];

  if (!fileInfo.destination) {
    return res.status(400).send("No file path found for this file.");
  }
  fs.unlinkSync(fileInfo.destination);
  res.send("File deleted!");
  console.log(`Deleted file ${fileName}`);
});

app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! serving from ${clientapp}`
  )
);
