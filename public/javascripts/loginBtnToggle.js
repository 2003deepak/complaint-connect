var worker = document.querySelector("#worker");
var user = document.querySelector("#user");
var btn = document.querySelector("#btn");
var form = document.querySelector("form");



// Set default background color for user
user.style.backgroundColor = "#FF9F00";

    worker.addEventListener("click", function() {
        worker.style.backgroundColor = "#FF9F00";
        user.style.backgroundColor = "#ffffff";
        form.action = "/worker/login"; // Replace with your form action
    });

        user.addEventListener("click", function() {
        user.style.backgroundColor = "#FF9F00";
        worker.style.backgroundColor = "#ffffff";
        form.action = "/user/login"; // Replace with your form action
        
    });