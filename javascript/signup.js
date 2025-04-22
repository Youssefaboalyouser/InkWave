document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    // Remove User Profile link if not logged in
    if (!isLoggedIn) {
        const navLinks = navbar.querySelectorAll("a");
        navLinks.forEach(link => {
            if (link.textContent.trim().toLowerCase() === "user profile") {
                link.remove();
            }
        });
    }

    const form = document.querySelector("form");
    const usernameInput = document.querySelector(".username");
    const emailInput = document.querySelector(".email");
    const passwordInput = document.querySelector(".password");
    const confirmPasswordInput = document.querySelector(".confirm-password");
    const termsCheckbox = document.querySelector("#check");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!username || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!termsCheckbox.checked) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        // Check for admin invitation
        const adminInvitations = JSON.parse(localStorage.getItem("adminInvitations")) || [];
        const isAdmin = adminInvitations.some(inv =>
            inv.username === username && inv.email === email && inv.password === password
        );

        // Save to localStorage
        const userData = {
            username,
            email,
            password,
            isAdmin,
            profilePhoto: "assets/av2.jpg"
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loggedIn", "true");
        alert("Sign up successful!");

        // Redirect to homepage
        window.location.href = "index.html";
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});