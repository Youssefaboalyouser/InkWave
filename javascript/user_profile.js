document.addEventListener("DOMContentLoaded", function () {
    console.log("user_profile.js loaded");

    // Check login status and user data
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    let userData = {};
    try {
        userData = JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {
        console.error("Error parsing user data:", e);
    }
    const isAdmin = userData.isAdmin || (
        userData.username === "Youssef Aboalyouser" &&
        userData.email === "youssefaboalyouser@gmail.com" &&
        userData.password === "InKwave"
    );

    // Navbar link management
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        const navLinks = navbar.querySelectorAll("a");
        navLinks.forEach(link => {
            const linkText = link.textContent.trim().toLowerCase();
            if (isLoggedIn) {
                if (linkText === "sign in" || linkText === "sign up") {
                    link.remove();
                }
            } else {
                if (linkText === "user profile"|| linkText === "purchases") {
                    link.remove();
                }
            }
        });
    }
    
    // Hide admin tabs for non-admin users
    if (!isAdmin) {
        ['tab6', 'tab7'].forEach(tab => {
            const label = document.querySelector(`label[for="${tab}"]`);
            const content = document.querySelector(`.${tab}`);
            if (label) label.style.display = "none";
            if (content) content.style.display = "none";
        });
    }

    // Initialize booksDB
    if (!localStorage.getItem("booksDB")) {
        localStorage.setItem("booksDB", JSON.stringify([]));
    }

    // Helper function to select elements safely
    function selectElement(selector, context = document) {
        const element = context.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    }

    // General Tab
    const profileImg = selectElement(".profile-img");
    const fileInput = selectElement(".file-input");
    const resetPhotoBtn = selectElement(".reset-photo-btn");
    const usernameInput = selectElement(".tab1 .form-group:nth-child(1) input");
    const nameInput = selectElement(".tab1 .form-group:nth-child(2) input");
    const emailInput = selectElement(".tab1 .form-group:nth-child(3) input");
    const genreInput = selectElement(".tab1 .form-group:nth-child(4) input");
    const saveGeneralBtn = selectElement(".tab1 .save-general-btn");

    // Load General tab data (with error handling)
    if (isLoggedIn && userData) {
        try {
            if (profileImg) profileImg.src = userData.profilePhoto || "";
            if (usernameInput) usernameInput.value = userData.username || "";
            if (nameInput) nameInput.value = userData.name || "";
            if (emailInput) emailInput.value = userData.email || "";
            if (genreInput) genreInput.value = userData.favoriteGenre || "";
        } catch (e) {
            console.error("Error loading General tab data:", e);
        }
    }

    if (fileInput) {
        fileInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (file && file.size <= 800 * 1024 && ["image/jpeg", "image/gif", "image/png"].includes(file.type)) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    if (profileImg) profileImg.src = event.target.result;
                    userData.profilePhoto = event.target.result;
                    localStorage.setItem("user", JSON.stringify(userData));
                    alert("Profile photo updated!");
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please upload a JPG, GIF, or PNG image under 800KB.");
            }
        });
    }

    if (resetPhotoBtn) {
        resetPhotoBtn.addEventListener("click", function () {
            if (profileImg) profileImg.src = "";
            userData.profilePhoto = "";
            localStorage.setItem("user", JSON.stringify(userData));
            alert("Profile photo reset!");
        });
    }

    if (saveGeneralBtn) {
        saveGeneralBtn.addEventListener("click", function () {
            if (!usernameInput || !emailInput) {
                alert("Error: Required input fields missing.");
                return;
            }
            if (!usernameInput.value.trim() || !emailInput.value.trim()) {
                alert("Username and email are required.");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                alert("Please enter a valid email address.");
                return;
            }
            try {
                userData.username = usernameInput.value.trim();
                userData.name = nameInput ? nameInput.value.trim() : "";
                userData.email = emailInput.value.trim();
                userData.favoriteGenre = genreInput ? genreInput.value.trim() : "";
                localStorage.setItem("user", JSON.stringify(userData));
                alert("General settings saved!");
            } catch (e) {
                console.error("Error saving General settings:", e);
                alert("Failed to save General settings.");
            }
        });
    }

    // Change Password Tab
    const currentPassword = selectElement(".tab2 .form-group:nth-child(1) input");
    const newPassword = selectElement(".tab2 .form-group:nth-child(2) input");
    const repeatPassword = selectElement(".tab2 .form-group:nth-child(3) input");
    const savePasswordBtn = selectElement(".tab2 .save-password-btn");

    if (savePasswordBtn) {
        savePasswordBtn.addEventListener("click", function () {
            if (!currentPassword || !newPassword || !repeatPassword) {
                alert("Error: Password input fields missing.");
                return;
            }
            if (!currentPassword.value) {
                alert("Please enter your current password.");
                return;
            }
            if (currentPassword.value !== userData.password) {
                alert("Current password is incorrect.");
                return;
            }
            if (!newPassword.value || !repeatPassword.value) {
                alert("Please enter both new password and repeat new password.");
                return;
            }
            if (newPassword.value !== repeatPassword.value) {
                alert("New passwords do not match.");
                return;
            }
            try {
                userData.password = newPassword.value;
                localStorage.setItem("user", JSON.stringify(userData));
                alert("Password changed successfully!");
                currentPassword.value = "";
                newPassword.value = "";
                repeatPassword.value = "";
            } catch (e) {
                console.error("Error saving password:", e);
                alert("Failed to save password.");
            }
        });
    }

    // Info Tab
    const aboutInput = selectElement(".tab3 .form-group:nth-child(1) textarea");
    const birthdayInput = selectElement(".tab3 .form-group:nth-child(2) input");
    const countryInput = selectElement(".tab3 .form-group:nth-child(3) select");
    const phoneInput = selectElement(".tab3 .form-section:nth-child(2) .form-group:nth-child(2) input");
    const websiteInput = selectElement(".tab3 .form-section:nth-child(2) .form-group:nth-child(3) input");
    const saveInfoBtn = selectElement(".tab3 .save-info-btn");

    if (isLoggedIn && userData) {
        try {
            if (aboutInput) aboutInput.value = userData.about || "";
            if (birthdayInput) birthdayInput.value = userData.birthday || "";
            if (countryInput) countryInput.value = userData.country || "";
            if (phoneInput) phoneInput.value = userData.phone || "";
            if (websiteInput) websiteInput.value = userData.website || "";
        } catch (e) {
            console.error("Error loading Info tab data:", e);
        }
    }

    if (saveInfoBtn) {
        saveInfoBtn.addEventListener("click", function () {
            try {
                userData.about = aboutInput ? aboutInput.value.trim() : "";
                userData.birthday = birthdayInput ? birthdayInput.value.trim() : "";
                userData.country = countryInput ? countryInput.value || "" : "";
                userData.phone = phoneInput ? phoneInput.value.trim() : "";
                userData.website = websiteInput ? websiteInput.value.trim() : "";
                localStorage.setItem("user", JSON.stringify(userData));
                alert("Info settings saved successfully!");
            } catch (e) {
                console.error("Error saving Info settings:", e);
                alert("Failed to save Info settings.");
            }
        });
    }

    // Social Links Tab
    const twitterInput = selectElement(".tab4 .form-group:nth-child(1) input");
    const facebookInput = selectElement(".tab4 .form-group:nth-child(2) input");
    const googleInput = selectElement(".tab4 .form-group:nth-child(3) input");
    const linkedinInput = selectElement(".tab4 .form-group:nth-child(4) input");
    const instagramInput = selectElement(".tab4 .form-group:nth-child(5) input");
    const saveSocialBtn = selectElement(".tab4 .save-social-btn");

    userData.social = userData.social || {};
    if (isLoggedIn && userData) {
        try {
            if (twitterInput) twitterInput.value = userData.social.twitter || "";
            if (facebookInput) facebookInput.value = userData.social.facebook || "";
            if (googleInput) googleInput.value = userData.social.google || "";
            if (linkedinInput) linkedinInput.value = userData.social.linkedin || "";
            if (instagramInput) instagramInput.value = userData.social.instagram || "";
        } catch (e) {
            console.error("Error loading Social Links data:", e);
        }
    }

    if (saveSocialBtn) {
        saveSocialBtn.addEventListener("click", function () {
            try {
                userData.social = {
                    twitter: twitterInput ? twitterInput.value.trim() : "",
                    facebook: facebookInput ? facebookInput.value.trim() : "",
                    google: googleInput ? googleInput.value.trim() : "",
                    linkedin: linkedinInput ? linkedinInput.value.trim() : "",
                    instagram: instagramInput ? instagramInput.value.trim() : ""
                };
                localStorage.setItem("user", JSON.stringify(userData));
                alert("Social links saved successfully!");
            } catch (e) {
                console.error("Error saving Social Links:", e);
                alert("Failed to save Social Links.");
            }
        });
    }

    // Admin: Add Book
    const addBookBtn = selectElement(".tab6 .add-book-btn");
    if (addBookBtn) {
        addBookBtn.addEventListener("click", function () {
            const bookNameInput = selectElement(".tab6 .form-group:nth-child(2) input");
            const authorInput = selectElement(".tab6 .form-group:nth-child(3) input");
            const borrowPriceInput = selectElement(".tab6 .form-group:nth-child(4) input");
            const buyPriceInput = selectElement(".tab6 .form-group:nth-child(5) input");
            const descriptionInput = selectElement(".tab6 .form-group:nth-child(6) textarea");

            if (!bookNameInput || !authorInput || !borrowPriceInput || !buyPriceInput || !descriptionInput) {
                alert("Error: Book input fields missing.");
                return;
            }

            const bookName = bookNameInput.value.trim();
            const author = authorInput.value.trim();
            const borrowPrice = parseFloat(borrowPriceInput.value);
            const buyPrice = parseFloat(buyPriceInput.value);
            const description = descriptionInput.value.trim();

            if (!bookName || !author || isNaN(borrowPrice) || isNaN(buyPrice) || !description) {
                alert("Please fill in all book fields with valid data.");
                return;
            }

            try {
                const booksDB = JSON.parse(localStorage.getItem("booksDB")) || [];
                booksDB.push({
                    id: Date.now().toString(),
                    volumeInfo: {
                        title: bookName,
                        authors: [author],
                        description: description,
                        imageLinks: { thumbnail: "" }
                    },
                    saleInfo: {
                        listPrice: { amount: buyPrice, currencyCode: "USD" },
                        retailPrice: { amount: borrowPrice, currencyCode: "USD" }
                    }
                });
                localStorage.setItem("booksDB", JSON.stringify(booksDB));
                alert("Book added successfully!");
                bookNameInput.value = "";
                authorInput.value = "";
                borrowPriceInput.value = "";
                buyPriceInput.value = "";
                descriptionInput.value = "";
            } catch (e) {
                console.error("Error adding book:", e);
                alert("Failed to add book.");
            }
        });
    }

    // Admin: Delete Book
    const deleteBookBtn = selectElement(".tab7 .delete-book-btn");
    if (deleteBookBtn) {
        deleteBookBtn.addEventListener("click", function () {
            const bookNameInput = selectElement(".tab7 .form-group:nth-child(2) input");
            if (!bookNameInput) {
                alert("Error: Book name input missing.");
                return;
            }

            const bookName = bookNameInput.value.trim();
            if (!bookName) {
                alert("Please enter a book name.");
                return;
            }

            try {
                let booksDB = JSON.parse(localStorage.getItem("booksDB")) || [];
                const initialLength = booksDB.length;
                booksDB = booksDB.filter(book => book.volumeInfo.title.toLowerCase() !== bookName.toLowerCase());
                if (booksDB.length < initialLength) {
                    localStorage.setItem("booksDB", JSON.stringify(booksDB));
                    alert("Book deleted successfully!");
                    bookNameInput.value = "";
                } else {
                    alert("Book not found.");
                }
            } catch (e) {
                console.error("Error deleting book:", e);
                alert("Failed to delete book.");
            }
        });
    }

    // Advanced Tab
    const logoutBtn = selectElement(".tab8 .logout-btn");
    const deleteAccountBtn = selectElement(".tab8 .delete-account-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            try {
                alert("Logged out successfully!");
                localStorage.setItem("loggedIn", "false");
                window.location.href = "index.html";
            } catch (e) {
                console.error("Error logging out:", e);
                alert("Failed to log out.");
            }
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete your account?")) {
                try {
                    alert("Account deleted successfully!");
                    localStorage.removeItem("user");
                    localStorage.setItem("loggedIn", "false");
                    window.location.href = "index.html";
                } catch (e) {
                    console.error("Error deleting account:", e);
                    alert("Failed to delete account.");
                }
            }
        });
    }
});
