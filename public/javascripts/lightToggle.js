const toggleNav = () => {
  let mode = "dark";
  var a = document.querySelector(".dark");
  if (document.body.classList.contains("light-mode")) {
    document.body.classList.remove("light-mode");
    a.innerHTML = "Light Mode";
  } else {
    document.body.classList.add("light-mode");
    a.innerHTML = "Dark Mode";
    mode = "light";
  }
  // Store the mode in session storage
  sessionStorage.setItem("mode", mode);
};

// Function to apply mode when page loads
const applyMode = () => {
  let mode = sessionStorage.getItem("mode");
  if (mode === "light") {
    document.body.classList.add("light-mode");
    document.querySelector(".dark").innerHTML = "Dark Mode";
  } else {
    document.body.classList.remove("light-mode");
    document.querySelector(".dark").innerHTML = "Light Mode";
  }
};

// Apply mode when page loads
applyMode();

// Code for navigation bar and blur effect in responsive mode

var toggle = document.getElementById("toggle");
var close = document.getElementById("close");
var nav = document.querySelector(".nav");
var content = document.querySelector(".content");
var preview = document.querySelector(".preview");
var previewContent = document.querySelectorAll("#previewContent");

toggle.addEventListener("click", function () {
  nav.classList.add("nav-active");
  content.classList.add("blur");
});
close.addEventListener("click", function () {
  nav.classList.remove("nav-active");
  content.classList.remove("blur");
});
previewContent.forEach(function (element) {
  element.addEventListener("click", function () {
    preview.classList.add("preview-active");
  });
});
