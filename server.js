var express = require("express");
var fs = require("fs");

var app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
  introduceDelay(function () {
    res.send(renderTemplate("collection", {
      title: "the collection page",
      grid: renderItems()
    }));
  });
});

app.get("/item/:id", function (req, res) {
  introduceDelay(function () {
    var itemNumber = parseInt(req.params.id, 10);
    res.send(renderTemplate("itempage", {
      title: "the item page",
      color: colorForNumber(itemNumber),
      "next-image-link": `/item/${itemNumber + 1}`,
      "previous-image-link": `/item/${itemNumber - 1}`
    }));
  });
});

app.listen(3000);

function renderItempage (data) {
  var body = `this is the page for item ${data.id}`
  return itempage.replace("<!-- $body -->", body);
}

function renderTemplate (templateName, data) {
  var layout = fs.readFileSync("public/application.layout.html", "utf8");
  var html = fs.readFileSync("public/" + templateName + ".template.html", "utf8");

  html = layout.replace("<!-- yield -->", html);

  for (var key in data) {
    html = html.replace("<!-- $" + key + " -->", data[key]);
  }

  return html;
}

function renderItems () {
  return range(51).map(function (i) {
    var url = "/item/" + i;
    var style = 'background-color:' + colorForNumber(i)
    return '<a href="' + url + '"' + i + ' style="' + style + '">' + i + '</a>';
  }).join("\n");
}

function colorForNumber (number) {
  return ["hsl(", (number * 20) % 360, ", 60%, 70%)"].join("");
}

function range(count) {
  return Array.apply(0, Array(count)).map(function (element, index) {
    return index;
  });
}

function introduceDelay (fn) {
  var delay = Math.floor(Math.random() * 700) + 300;
  setTimeout(fn, delay);
}
