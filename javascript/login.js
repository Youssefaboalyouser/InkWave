document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    // Remove User Profile link if not logged in
    if (!isLoggedIn && navbar) {
        const navLinks = navbar.querySelectorAll("a");
        navLinks.forEach(link => {
            if (link.textContent.trim().toLowerCase() === "user profile") {
                link.remove();
            }
        });
    }

    const form = document.querySelector("form");
    const usernameInput = document.querySelector(".username");
    const passwordInput = document.querySelector(".password");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value;

        // Get saved user data from localStorage
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (!savedUser) {
            alert("No account found. Please sign up first.");
            return;
        }

        if (
            enteredUsername === savedUser.username &&
            enteredPassword === savedUser.password
        ) {
            // Store session flag
            localStorage.setItem("loggedIn", "true");

            // Redirect to homepage
            window.location.href = "index.html";
        } else {
            alert("Incorrect username or password.");
        }
    });
});