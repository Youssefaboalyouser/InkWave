document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    const navLinks = navbar.querySelectorAll("a");
    navLinks.forEach(link => {
        const linkText = link.textContent.trim();
        if (isLoggedIn) {
            // Remove Sign In and Sign Up links when logged in
            if (linkText === "Sign In" || linkText === "Sign Up") {
                link.remove();
            }
        } else {
            // Remove User Profile link when not logged in
            if (linkText === "User Profile" || linkText === "purchases") {
                link.remove();
            }
        }
    });

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

        const adminData = {
            AdminName: "Youssef Aboalyouser",
            AdminEmail: "youssefaboalyouser@gmail.com",
            AdminPass: "InKwave"
        };

        // Initialize adminInvitations if not present
        const adminInvitations = JSON.parse(localStorage.getItem("adminInvitations")) || [];

        // Check for admin credentials
        const isAdmin = (username === adminData.AdminName && email === adminData.AdminEmail && password === adminData.AdminPass) ||
            adminInvitations.some(inv => inv.username === username && inv.email === email && inv.password === password);

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