var fs = require("fs");
var path = require("path");
var express = require("express");
var mustache = require("mustache-express");
var rollup = require("rollup-endpoint");
var resolve = require("rollup-plugin-node-resolve");
var commonjs = require("rollup-plugin-commonjs");

var app = express();

app.engine("mustache", mustache());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

app.use(express.static("public"));

var rollupConfig = {
  plugins: [resolve({ browser: true }), commonjs()],
  entry: path.join(__dirname, "client.js")
};

app.get("/", delayMiddleware(300, 1000), function (req, res) {
  var data = {
    title: "the collection page",
    items: range(51).map(makeItem),
  };

  res.render("collection", data);
});

app.get("/item/:id", delayMiddleware(300, 700), function (req, res) {
  var id = parseInt(req.params.id, 10);

  var data = {
    title: "the item page",
    color: makeItem(id).color,
  };

  if (id < 50) data.nextImageLink = `/item/${id + 1}`
  if (id > 0) data.previousImageLink = `/item/${id - 1}`

  res.render("itempage", data);
});

app.get("/client.js", rollup.serve(rollupConfig));

app.listen(3000);

function makeItem (id) {
  var color = ["hsl(", (id * 20) % 360, ", 60%, 60%)"].join("");
  return { id: id, color: color };
}

function range(count) {
  return Array.apply(0, Array(count)).map(function (element, index) {
    return index;
  });
}

function delayMiddleware (min, max) {
  return function (req, res, next) {
    var delay = Math.floor(Math.random() * max - min) + min;
    setTimeout(next, delay)
  }
}
