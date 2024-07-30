const toggle = () => {
    let mode = 'dark';
    var a = document.querySelector(".dark");
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove("light-mode");
        a.innerHTML = "Light Mode";
    } else {
        document.body.classList.add("light-mode");
        a.innerHTML = "Dark Mode";
        mode = 'light';
    }
    // Store the mode in session storage
    sessionStorage.setItem('mode', mode);
}

// Function to apply mode when page loads
const applyMode = () => {
    let mode = sessionStorage.getItem('mode');
    if (mode === 'light') {
        document.body.classList.add("light-mode");
        document.querySelector(".dark").innerHTML = "Dark Mode";
    } else {
        document.body.classList.remove("light-mode");
        document.querySelector(".dark").innerHTML = "Light Mode";
    }
}

// Apply mode when page loads
applyMode();
