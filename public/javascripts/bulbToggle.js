var bulb = document.getElementById("bulb");

bulb.addEventListener("click", () => {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove("light-mode");
        bulb.src = "../images/bulb off.svg";
        
    } else {
        document.body.classList.add("light-mode");

        bulb.src = "../images/onBulb.svg";
    }
});