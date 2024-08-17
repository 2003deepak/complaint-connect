var worker = document.querySelector("#worker");
var user = document.querySelector("#user");
var form = document.querySelector("form");

// Set default background color for user
user.style.backgroundColor = "#FF9F00";

worker.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    worker.style.backgroundColor = "#FF9F00";
    user.style.backgroundColor = "#ffffff";
    form.action = "/worker/login"; // Update form action
});

user.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    user.style.backgroundColor = "#FF9F00";
    worker.style.backgroundColor = "#ffffff";
    form.action = "/user/login"; // Update form action
});