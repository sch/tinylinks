import Turbolinks from "turbolinks";

console.log("Starting turbolinks disabled");
Turbolinks.controller.stop();

document.addEventListener("change", function (event) {
  if (matchesParent(event.target, ".settings-controls")) {
    if (Turbolinks.controller.started) {
      console.log("stopping");
      Turbolinks.controller.stop();
      Turbolinks.controller.disable();
    } else {
      console.log("starting");
      Turbolinks.controller.start();
    }
  }
});

document.addEventListener("turbolinks:before-render", function (event) {
  console.log("before-render", document.body, "new body", event.data.newBody)
  event.data.newBody.classList.add("loading");
  console.log("modified new body", event.data.newBody.classList);
});

document.addEventListener("turbolinks:before-visit", function (event) {
  console.log("before-visit", event.data.url)
  if (event.data.url.indexOf("item") > -1) {
    document.body.classList.add("dark", "loading");
  } else {
    document.body.classList.remove("dark");
  }
});

document.addEventListener("turbolinks:load", function (event) {
  console.log("load");
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
