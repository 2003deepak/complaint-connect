async function validate(event) {
    event.preventDefault(); // Prevent default form submission

    let email = document.getElementById("emailID").value;
    let key = "ema_live_m0M86pVGRGvNX5CJgwacnvuXw1j0UhwekVMpzFAA";  // Api key of code with harry not mine personal account 
    let url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`;

    let messageElement = document.getElementById("text");
    let boxtop = document.querySelector(".boxtop");
    let spinner = document.querySelector(".spinner-border");

    // Show spinner and hide message
    spinner.style.display = "inline-block";
    messageElement.innerHTML = "";

    try {
        let call = await fetch(url);
        let data = await call.json();

        // Hide spinner
        spinner.style.display = "none";

        if (data["smtp_check"]) {
            // Allow form submission
            messageElement.innerHTML = "Registration Successful";
            messageElement.style.color = "green";
            document.forms[0].submit();
        } else {
            messageElement.innerHTML = "Email Validation Failed";
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.innerHTML = "An error occurred during email validation.";
        messageElement.style.color = "red";
        spinner.style.display = "none";
    }
}
