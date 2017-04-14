// var checkbox = document.querySelector(".settings-controls");

// if (checkbox) {
//   checkbox.

//   checkbox.addEventListener("change", function (event) {
//     if (event.target.checked) {
//       Turbolinks.controller.start();
//     } else {
//       Turbolinks.controller.stop();
//     }
//   });
// }

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
  document.body.classList.remove("loading");
  if (event.data.url.indexOf("item") === -1) {
    document.body.classList.remove("dark");
  }
});
