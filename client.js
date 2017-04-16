import Turbolinks from "turbolinks";
import makeLogger from "debug";

var log = makeLogger("navigation");

window.logger = {
  on: function () { localStorage.debug = "*"; },
  off: function () { localStorage.debug = ""; }
};

window.Turbolinks.ProgressBar = function () {
}

Turbolinks.ProgressBar.prototype.show = function () {
  console.log("showing progress bar");
}

Turbolinks.ProgressBar.prototype.hide = function () {
  console.log("hiding progress bar");
}

Turbolinks.ProgressBar.prototype.setValue = function (value) {
  console.log("setting progress bar", value);
}

log("Starting turbolinks disabled");
Turbolinks.controller.stop();
Turbolinks.controller.disable();

document.addEventListener("click", function (event) {
  var active = Turbolinks.controller.enabled;
  var hasPreviousPage = window.history.length;
  var requestPreviousPage = "turbolinksNavigateBack" in event.target.dataset;

  if (active && hasPreviousPage && requestPreviousPage) {
    event.preventDefault();
    window.history.back();
  }
})

document.addEventListener("change", function (event) {
  if (matchesParent(event.target, ".settings-controls")) {
    if (Turbolinks.controller.started) {
      log("stopping");
      Turbolinks.controller.stop();
      Turbolinks.controller.disable();
    } else {
      log("starting");
      Turbolinks.controller.start();
    }
  }
});

document.addEventListener("turbolinks:before-render", function (event) {
  log("before-render")
  log("current body classes", document.body.className)
  log("new body classes", document.body.className)
  event.data.newBody.classList.add("loading");
  log("modified new body classes", event.data.newBody.className);
});

document.addEventListener("turbolinks:before-visit", function (event) {
  log("before-visit", event.data.url)
  if (event.data.url.indexOf("item") > -1) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  document.body.classList.add("loading");
});

document.addEventListener("turbolinks:load", function (event) {
  log("load");
  var checkbox = document.querySelector(".settings-controls input")

  if (checkbox) {
    checkbox.checked = Turbolinks.controller.started
  }

  document.body.classList.remove("loading");

  if (event.data.url.indexOf("item") === -1) {
    document.body.classList.remove("dark");
  }
});

function matchesParent(element, selector) {
  if (element.parentNode === null) return false;
  if (element.matches(selector)) return true;
  return matchesParent(element.parentNode, selector);
}
