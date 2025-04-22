document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    // Navbar link management
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
            if (linkText === "User profile") {
                link.remove();
            }
        }
    });
});

function sendcompliancemail() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (!isLoggedIn) {
        alert("Please log in to submit feedback.");
        window.location.href = "sign In.html";
        return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const usermail = savedUser ? savedUser.email : "user@example.com";
    const data = document.getElementById("comp").value;

    if (!data.trim()) {
        alert("Please enter your feedback before submitting.");
        return;
    }

    let para = {
        to_email: usermail,
        email: usermail,
        from_email: "youssefaboalyouser@gmail.com",
        subject: "Thank You for Your Feedback! 🙏",
        name: "InKwave",
        message: `Hi there,

Thank you so much for taking the time to rate our website! 🌟
Your feedback means a lot to us and helps us grow and improve every day.

Your submission: ${data}

Whether it's a compliment, a suggestion, or a complaint — we want you to know that your voice matters and will always be heard. We're already working hard to make your experience even better!

If there's anything more you'd like to share, feel free to reply to this email anytime.

Thanks again for being part of the InKwave community! 💙

Warm wishes,
InKwave Team
📬 We’re always just one reply away!`
    };

    emailjs.send("service_sdc4i6h", "template_neivftg", para)
        .then(function (response) {
            alert(`Your Feedback: ${data}\nIs under consideration. Check your email!`);
            document.getElementById("comp").value = "";
        }, function (error) {
            console.error("FAILED...", error);
            alert("Failed to send email. Please try again later.");
        });
}