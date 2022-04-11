var express = require("express");
const bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get("/", function (req, res) {
  res.send("Hello World");
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

app.post("/update-json", function (req, res) {
  let myJson = require("./data.json");
  myJson = {
    data: [...myJson.data, req.body],
  };
  fs.writeFile("data.json", JSON.stringify(myJson), "utf8", () => {
    res.send({
      message: "Data Saved",
    });
  });
});

app.get("/read-json", function (req, res) {
  let myJson = require("./data.json");
  res.send(myJson);
});
