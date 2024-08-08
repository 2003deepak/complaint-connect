async function validate(event) {
    event.preventDefault(); // Prevent default form submission

    let email = document.getElementById("emailID").value;
    let key = "ema_live_m0M86pVGRGvNX5CJgwacnvuXw1j0UhwekVMpzFAA";  // Api key of code with harry not mine personal account 
    let url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`;

    try {
        let call = await fetch(url);
        let data = await call.json();

        if (data["smtp_check"]) {
            // Allow form submission
           
            document.forms[0].submit();
        } else {
            alert("Email Validation Failed")
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.innerHTML = "An error occurred during email validation.";
        messageElement.style.color = "red";
        spinner.style.display = "none";
    }
}
