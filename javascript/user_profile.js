document.addEventListener("DOMContentLoaded", function () {
    // Check login status and user data
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const isAdmin = userData.isAdmin || false;

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
                if (linkText === "user profile") {
                    link.remove();
                }
            }
        });
    }

    // Hide admin tabs for non-admin users
    if (!isAdmin) {
        document.querySelector('label[for="tab6"]').style.display = "none"; // Add Book
        document.querySelector('label[for="tab7"]').style.display = "none"; // Delete & List Books
        document.querySelector(".tab6").style.display = "none";
        document.querySelector(".tab7").style.display = "none";
        document.querySelector(".tab8 .form-section:nth-child(3)").style.display = "none"; // Invite User
    }

    // Initialize books database in localStorage if not exists
    if (!localStorage.getItem("booksDB")) {
        localStorage.setItem("booksDB", JSON.stringify([]));
    }

    // Temporary user data to stage changes
    let tempUserData = { ...userData };

    // General Tab: Profile photo and user data
    const profileImg = document.querySelector(".profile-img");
    const fileInput = document.querySelector(".file-input");
    const resetBtn = document.querySelector(".profile-actions .btn-default");
    const usernameInput = document.querySelector(".tab1 .form-group:nth-child(1) input");
    const nameInput = document.querySelector(".tab1 .form-group:nth-child(2) input");
    const emailInput = document.querySelector(".tab1 .form-group:nth-child(3) input");
    const genreInput = document.querySelector(".tab1 .form-group:nth-child(4) input");

    // Load user data
    if (isLoggedIn && userData) {
        profileImg.src = userData.profilePhoto || "assets/av2.jpg";
        usernameInput.value = userData.username || "";
        nameInput.value = userData.name || "";
        emailInput.value = userData.email || "";
        genreInput.value = userData.favoriteGenre || "";
    }

    // Upload new photo
    fileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file && file.size <= 800 * 1024 && ["image/jpeg", "image/gif", "image/png"].includes(file.type)) {
            const reader = new FileReader();
            reader.onload = function (event) {
                profileImg.src = event.target.result;
                tempUserData.profilePhoto = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a JPG, GIF, or PNG image under 800KB.");
        }
    });

    // Reset photo
    resetBtn.addEventListener("click", function () {
        profileImg.src = "assets/av2.jpg";
        tempUserData.profilePhoto = "assets/av2.jpg";
    });

    // Change Password Tab
    const currentPassword = document.querySelector(".tab2 .form-group:nth-child(1) input");
    const newPassword = document.querySelector(".tab2 .form-group:nth-child(2) input");
    const repeatPassword = document.querySelector(".tab2 .form-group:nth-child(3) input");

    // Info Tab
    const aboutInput = document.querySelector(".tab3 textarea");
    const birthdayInput = document.querySelector(".tab3 .form-group:nth-child(2) input");
    const countryInput = document.querySelector(".tab3 select");
    const phoneInput = document.querySelector(".tab3 .form-group:nth-child(4) input");
    const websiteInput = document.querySelector(".tab3 .form-group:nth-child(5) input");

    // Load Info data
    aboutInput.value = userData.about || "";
    birthdayInput.value = userData.birthday || "";
    countryInput.value = userData.country || "";
    phoneInput.value = userData.phone || "";
    websiteInput.value = userData.website || "";

    // Social Links Tab
    const twitterInput = document.querySelector(".tab4 .form-group:nth-child(1) input");
    const facebookInput = document.querySelector(".tab4 .form-group:nth-child(2) input");
    const googleInput = document.querySelector(".tab4 .form-group:nth-child(3) input");
    const linkedinInput = document.querySelector(".tab4 .form-group:nth-child(4) input");
    const instagramInput = document.querySelector(".tab4 .form-group:nth-child(5) input");

    // Load Social Links data
    twitterInput.value = userData.social?.twitter || "";
    facebookInput.value = userData.social?.facebook || "";
    googleInput.value = userData.social?.google || "";
    linkedinInput.value = userData.social?.linkedin || "";
    instagramInput.value = userData.social?.instagram || "";

    // Notifications Tab
    const notificationInputs = document.querySelectorAll(".tab5 .switcher-input");
    if (userData.notifications) {
        notificationInputs[0].checked = userData.notifications.comment || false;
        notificationInputs[1].checked = userData.notifications.forum || false;
        notificationInputs[2].checked = userData.notifications.follow || false;
        notificationInputs[3].checked = userData.notifications.news || false;
        notificationInputs[4].checked = userData.notifications.updates || false;
        notificationInputs[5].checked = userData.notifications.blog || false;
        notificationInputs[6].checked = userData.notifications.collection || false;
    }

    // Save Changes button
    const saveChangesBtn = document.querySelector(".save-changes-btn");
    saveChangesBtn.addEventListener("click", function () {
        // Validate General Tab
        if (!usernameInput.value.trim() || !emailInput.value.trim()) {
            alert("Username and email are required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        // Validate Change Password Tab
        if (currentPassword.value || newPassword.value || repeatPassword.value) {
            if (currentPassword.value !== userData.password) {
                alert("Current password is incorrect.");
                return;
            }
            if (newPassword.value !== repeatPassword.value) {
                alert("New passwords do not match.");
                return;
            }
            if (newPassword.value) {
                tempUserData.password = newPassword.value;
            }
        }

        // Update user data
        tempUserData.username = usernameInput.value.trim();
        tempUserData.name = nameInput.value.trim();
        tempUserData.email = emailInput.value.trim();
        tempUserData.favoriteGenre = genreInput.value.trim();
        tempUserData.about = aboutInput.value.trim();
        tempUserData.birthday = birthdayInput.value.trim();
        tempUserData.country = countryInput.value;
        tempUserData.phone = phoneInput.value.trim();
        tempUserData.website = websiteInput.value.trim();
        tempUserData.social = {
            twitter: twitterInput.value.trim(),
            facebook: facebookInput.value.trim(),
            google: googleInput.value.trim(),
            linkedin: linkedinInput.value.trim(),
            instagram: instagramInput.value.trim()
        };
        tempUserData.notifications = {
            comment: notificationInputs[0].checked,
            forum: notificationInputs[1].checked,
            follow: notificationInputs[2].checked,
            news: notificationInputs[3].checked,
            updates: notificationInputs[4].checked,
            blog: notificationInputs[5].checked,
            collection: notificationInputs[6].checked
        };

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(tempUserData));
        alert("Changes saved successfully!");

        // Clear password fields
        currentPassword.value = "";
        newPassword.value = "";
        repeatPassword.value = "";
    });

    // Admin: Add Book
    const addBookBtn = document.querySelector(".add-book-btn");
    if (addBookBtn) {
        addBookBtn.addEventListener("click", function () {
            const bookName = document.querySelector(".tab6 .form-group:nth-child(1) input").value.trim();
            const author = document.querySelector(".tab6 .form-group:nth-child(2) input").value.trim();
            const borrowPrice = parseFloat(document.querySelector(".tab6 .form-group:nth-child(3) input").value);
            const buyPrice = parseFloat(document.querySelector(".tab6 .form-group:nth-child(4) input").value);
            const description = document.querySelector(".tab6 textarea").value.trim();

            if (!bookName || !author || isNaN(borrowPrice) || isNaN(buyPrice) || !description) {
                alert("Please fill in all book fields.");
                return;
            }

            const booksDB = JSON.parse(localStorage.getItem("booksDB")) || [];
            booksDB.push({
                id: Date.now().toString(), // Unique ID
                volumeInfo: {
                    title: bookName,
                    authors: [author],
                    description: description,
                    imageLinks: { thumbnail: "assets/default_book.jpg" }
                },
                saleInfo: {
                    listPrice: { amount: buyPrice, currencyCode: "USD" },
                    retailPrice: { amount: borrowPrice, currencyCode: "USD" }
                }
            });
            localStorage.setItem("booksDB", JSON.stringify(booksDB));
            alert("Book added successfully!");

            // Clear fields
            document.querySelector(".tab6 .form-group:nth-child(1) input").value = "";
            document.querySelector(".tab6 .form-group:nth-child(2) input").value = "";
            document.querySelector(".tab6 .form-group:nth-child(3) input").value = "";
            document.querySelector(".tab6 .form-group:nth-child(4) input").value = "";
            document.querySelector(".tab6 textarea").value = "";
        });
    }

    // Admin: Delete Book
    const deleteBookBtn = document.querySelector(".delete-book-btn");
    if (deleteBookBtn) {
        deleteBookBtn.addEventListener("click", function () {
            const bookName = document.querySelector(".tab7 .form-group:nth-child(1) input").value.trim();
            if (!bookName) {
                alert("Please enter a book name.");
                return;
            }

            let booksDB = JSON.parse(localStorage.getItem("booksDB")) || [];
            const initialLength = booksDB.length;
            booksDB = booksDB.filter(book => book.volumeInfo.title.toLowerCase() !== bookName.toLowerCase());
            if (booksDB.length < initialLength) {
                localStorage.setItem("booksDB", JSON.stringify(booksDB));
                alert("Book deleted successfully!");
                document.querySelector(".tab7 .form-group:nth-child(1) input").value = "";
            } else {
                alert("Book not found.");
            }
        });
    }

    // Advanced Tab: Logout
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.setItem("loggedIn", "false");
            window.location.href = "index.html";
        });
    }

    // Advanced Tab: Delete Account
    const deleteAccountBtn = document.querySelector(".delete-account-btn");
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                localStorage.removeItem("user");
                localStorage.setItem("loggedIn", "false");
                window.location.href = "index.html";
            }
        });
    }

    // Advanced Tab: Invite User (Admin only)
    const inviteBtn = document.querySelector(".invite-btn");
    if (inviteBtn) {
        inviteBtn.addEventListener("click", function () {
            const username = document.querySelector(".invite-username").value.trim();
            const email = document.querySelector(".invite-email").value.trim();
            const password = document.querySelector(".invite-password").value.trim();

            if (!username || !email || !password) {
                alert("Please fill in all invitation fields.");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            const adminInvitations = JSON.parse(localStorage.getItem("adminInvitations")) || [];
            adminInvitations.push({ username, email, password, isAdmin: true });
            localStorage.setItem("adminInvitations", JSON.stringify(adminInvitations));
            alert("Invitation sent successfully!");

            // Clear fields
            document.querySelector(".invite-username").value = "";
            document.querySelector(".invite-email").value = "";
            document.querySelector(".invite-password").value = "";
        });
    }
});
// ---------------------------------------------------------------------------------------------------------------------------------------------
// document.addEventListener("DOMContentLoaded", function () {
//     // Check login status and user data
//     const isLoggedIn = localStorage.getItem("loggedIn") === "true";
//     const userData = JSON.parse(localStorage.getItem("user")) || {};
//     const isAdmin = userData.isAdmin || false;

//     // Navbar link management
//     const navbar = document.querySelector(".navbar");
//     if (navbar) {
//         const navLinks = navbar.querySelectorAll("a");
//         navLinks.forEach(link => {
//             const linkText = link.textContent.trim().toLowerCase();
//             if (isLoggedIn) {
//                 if (linkText === "sign in" || linkText === "sign up") {
//                     link.remove();
//                 }
//             } else {
//                 if (linkText === "user profile") {
//                     link.remove();
//                 }
//             }
//         });
//     }

//     // Hide admin tabs for non-admin users
//     if (!isAdmin) {
//         document.querySelector('label[for="tab6"]').style.display = "none"; // Add Book
//         document.querySelector('label[for="tab7"]').style.display = "none"; // Delete & List Books
//         document.querySelector(".tab6").style.display = "none";
//         document.querySelector(".tab7").style.display = "none";
//         document.querySelector(".tab8 .form-section:nth-child(3)").style.display = "none"; // Invite User
//     }

//     // Initialize books database in localStorage to simulate booksDB.json
//     if (!localStorage.getItem("booksDB.json")) {
//         localStorage.setItem("booksDB.json", JSON.stringify([]));
//     }

//     // General Tab: Profile photo and user data
//     const profileImg = document.querySelector(".profile-img");
//     const fileInput = document.querySelector(".file-input");
//     const resetBtn = document.querySelector(".profile-actions .btn-default");
//     const usernameInput = document.querySelector(".tab1 .form-group:nth-child(1) input");
//     const nameInput = document.querySelector(".tab1 .form-group:nth-child(2) input");
//     const emailInput = document.querySelector(".tab1 .form-group:nth-child(3) input");
//     const genreInput = document.querySelector(".tab1 .form-group:nth-child(4) input");

//     // Load user data
//     if (isLoggedIn && userData) {
//         profileImg.src = userData.profilePhoto || "assets/av2.jpg";
//         usernameInput.value = userData.username || "";
//         nameInput.value = userData.name || "";
//         emailInput.value = userData.email || "";
//         genreInput.value = userData.favoriteGenre || "";
//     }

//     // Upload new photo (staged, saved on "Save changes")
//     fileInput.addEventListener("change", function (e) {
//         const file = e.target.files[0];
//         if (file && file.size <= 800 * 1024 && ["image/jpeg", "image/gif", "image/png"].includes(file.type)) {
//             const reader = new FileReader();
//             reader.onload = function (event) {
//                 profileImg.src = event.target.result;
//                 userData.profilePhoto = event.target.result; // Stage change
//             };
//             reader.readAsDataURL(file);
//         } else {
//             alert("Please upload a JPG, GIF, or PNG image under 800KB.");
//         }
//     });

//     // Reset photo (staged, saved on "Save changes")
//     resetBtn.addEventListener("click", function () {
//         profileImg.src = "assets/av2.jpg";
//         userData.profilePhoto = "assets/av2.jpg"; // Stage change
//     });

//     // Change Password Tab
//     const currentPassword = document.querySelector(".tab2 .form-group:nth-child(1) input");
//     const newPassword = document.querySelector(".tab2 .form-group:nth-child(2) input");
//     const repeatPassword = document.querySelector(".tab2 .form-group:nth-child(3) input");

//     // Info Tab
//     const aboutInput = document.querySelector(".tab3 textarea");
//     const birthdayInput = document.querySelector(".tab3 .form-group:nth-child(2) input");
//     const countryInput = document.querySelector(".tab3 select");
//     const phoneInput = document.querySelector(".tab3 .form-group:nth-child(4) input");
//     const websiteInput = document.querySelector(".tab3 .form-group:nth-child(5) input");

//     // Load Info data (initially blank unless previously set)
//     aboutInput.value = userData.about || "";
//     birthdayInput.value = userData.birthday || "";
//     countryInput.value = userData.country || "";
//     phoneInput.value = userData.phone || "";
//     websiteInput.value = userData.website || "";

//     // Social Links Tab
//     const twitterInput = document.querySelector(".tab4 .form-group:nth-child(1) input");
//     const facebookInput = document.querySelector(".tab4 .form-group:nth-child(2) input");
//     const googleInput = document.querySelector(".tab4 .form-group:nth-child(3) input");
//     const linkedinInput = document.querySelector(".tab4 .form-group:nth-child(4) input");
//     const instagramInput = document.querySelector(".tab4 .form-group:nth-child(5) input");

//     // Load Social Links data (initially blank unless previously set)
//     twitterInput.value = userData.social?.twitter || "";
//     facebookInput.value = userData.social?.facebook || "";
//     googleInput.value = userData.social?.google || "";
//     linkedinInput.value = userData.social?.linkedin || "";
//     instagramInput.value = userData.social?.instagram || "";

//     // Notifications Tab
//     const notificationInputs = document.querySelectorAll(".tab5 .switcher-input");
//     if (userData.notifications) {
//         notificationInputs[0].checked = userData.notifications.comment || false;
//         notificationInputs[1].checked = userData.notifications.forum || false;
//         notificationInputs[2].checked = userData.notifications.follow || false;
//         notificationInputs[3].checked = userData.notifications.news || false;
//         notificationInputs[4].checked = userData.notifications.updates || false;
//         notificationInputs[5].checked = userData.notifications.blog || false;
//         notificationInputs[6].checked = userData.notifications.collection || false;
//     }

//     // Save Changes button
//     const saveChangesBtn = document.querySelector(".save-changes-btn");
//     saveChangesBtn.addEventListener("click", function () {
//         // Validate General Tab
//         if (!usernameInput.value.trim() || !emailInput.value.trim()) {
//             alert("Username and email are required.");
//             return;
//         }
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
//             alert("Please enter a valid email address.");
//             return;
//         }

//         // Update username and email directly in localStorage
//         userData.username = usernameInput.value.trim();
//         userData.email = emailInput.value.trim();

//         // General: Update name and favorite genre if changed
//         if (nameInput.value.trim() !== userData.name) {
//             userData.name = nameInput.value.trim();
//         }
//         if (genreInput.value.trim() !== userData.favoriteGenre) {
//             userData.favoriteGenre = genreInput.value.trim();
//         }

//         // Validate and Update Change Password
//         if (currentPassword.value || newPassword.value || repeatPassword.value) {
//             if (!currentPassword.value) {
//                 alert("Please enter your current password.");
//                 return;
//             }
//             if (currentPassword.value !== JSON.parse(localStorage.getItem("user")).password) {
//                 alert("Current password is incorrect.");
//                 return;
//             }
//             if (!newPassword.value || !repeatPassword.value) {
//                 alert("Please enter both new password and repeat new password.");
//                 return;
//             }
//             if (newPassword.value !== repeatPassword.value) {
//                 alert("New passwords do not match.");
//                 return;
//             }
//             userData.password = newPassword.value;
//         }

//         // Info: Update fields if changed
//         if (aboutInput.value.trim() !== userData.about) {
//             userData.about = aboutInput.value.trim();
//         }
//         if (birthdayInput.value.trim() !== userData.birthday) {
//             userData.birthday = birthdayInput.value.trim();
//         }
//         if (countryInput.value !== userData.country) {
//             userData.country = countryInput.value;
//         }
//         if (phoneInput.value.trim() !== userData.phone) {
//             userData.phone = phoneInput.value.trim();
//         }
//         if (websiteInput.value.trim() !== userData.website) {
//             userData.website = websiteInput.value.trim();
//         }

//         // Social Links: Update fields if changed
//         userData.social = userData.social || {};
//         if (twitterInput.value.trim() !== userData.social.twitter) {
//             userData.social.twitter = twitterInput.value.trim();
//         }
//         if (facebookInput.value.trim() !== userData.social.facebook) {
//             userData.social.facebook = facebookInput.value.trim();
//         }
//         if (googleInput.value.trim() !== userData.social.google) {
//             userData.social.google = googleInput.value.trim();
//         }
//         if (linkedinInput.value.trim() !== userData.social.linkedin) {
//             userData.social.linkedin = linkedinInput.value.trim();
//         }
//         if (instagramInput.value.trim() !== userData.social.instagram) {
//             userData.social.instagram = instagramInput.value.trim();
//         }

//         // Notifications: Update settings
//         userData.notifications = {
//             comment: notificationInputs[0].checked,
//             forum: notificationInputs[1].checked,
//             follow: notificationInputs[2].checked,
//             news: notificationInputs[3].checked,
//             updates: notificationInputs[4].checked,
//             blog: notificationInputs[5].checked,
//             collection: notificationInputs[6].checked
//         };

//         // Save updated user data to localStorage
//         localStorage.setItem("user", JSON.stringify(userData));
//         alert("Changes saved successfully!");

//         // Clear password fields
//         currentPassword.value = "";
//         newPassword.value = "";
//         repeatPassword.value = "";
//     });

//     // Admin: Add Book (save immediately to simulated booksDB.json)
//     const addBookBtn = document.querySelector(".add-book-btn");
//     if (addBookBtn) {
//         addBookBtn.addEventListener("click", function () {
//             const bookName = document.querySelector(".tab6 .form-group:nth-child(1) input").value.trim();
//             const author = document.querySelector(".tab6 .form-group:nth-child(2) input").value.trim();
//             const borrowPrice = parseFloat(document.querySelector(".tab6 .form-group:nth-child(3) input").value);
//             const buyPrice = parseFloat(document.querySelector(".tab6 .form-group:nth-child(4) input").value);
//             const description = document.querySelector(".tab6 textarea").value.trim();

//             if (!bookName || !author || isNaN(borrowPrice) || isNaN(buyPrice) || !description) {
//                 alert("Please fill in all book fields.");
//                 return;
//             }

//             const booksDB = JSON.parse(localStorage.getItem("booksDB.json")) || [];
//             booksDB.push({
//                 id: Date.now().toString(),
//                 volumeInfo: {
//                     title: bookName,
//                     authors: [author],
//                     description: description,
//                     imageLinks: { thumbnail: "assets/default_book.jpg" }
//                 },
//                 saleInfo: {
//                     listPrice: { amount: buyPrice, currencyCode: "USD" },
//                     retailPrice: { amount: borrowPrice, currencyCode: "USD" }
//                 }
//             });
//             localStorage.setItem("booksDB.json", JSON.stringify(booksDB));
//             alert("Book added successfully and saved to booksDB.json!");

//             // Clear fields
//             document.querySelector(".tab6 .form-group:nth-child(1) input").value = "";
//             document.querySelector(".tab6 .form-group:nth-child(2) input").value = "";
//             document.querySelector(".tab6 .form-group:nth-child(3) input").value = "";
//             document.querySelector(".tab6 .form-group:nth-child(4) input").value = "";
//             document.querySelector(".tab6 textarea").value = "";
//         });
//     }

//     // Admin: Delete Book (delete immediately from simulated booksDB.json)
//     const deleteBookBtn = document.querySelector(".delete-book-btn");
//     if (deleteBookBtn) {
//         deleteBookBtn.addEventListener("click", function () {
//             const bookName = document.querySelector(".tab7 .form-group:nth-child(1) input").value.trim();
//             if (!bookName) {
//                 alert("Please enter a book name.");
//                 return;
//             }

//             let booksDB = JSON.parse(localStorage.getItem("booksDB.json")) || [];
//             const initialLength = booksDB.length;
//             booksDB = booksDB.filter(book => book.volumeInfo.title.toLowerCase() !== bookName.toLowerCase());
//             if (booksDB.length < initialLength) {
//                 localStorage.setItem("booksDB.json", JSON.stringify(booksDB));
//                 alert("Book deleted successfully from booksDB.json!");
//                 document.querySelector(".tab7 .form-group:nth-child(1) input").value = "";
//             } else {
//                 alert("Book not found.");
//             }
//         });
//     }

//     // Advanced Tab: Logout (for both admin and user)
//     const logoutBtn = document.querySelector(".logout-btn");
//     if (logoutBtn) {
//         logoutBtn.addEventListener("click", function () {
//             localStorage.setItem("loggedIn", "false");
//             window.location.href = "index.html";
//         });
//     }

//     // Advanced Tab: Delete Account (for both admin and user)
//     const deleteAccountBtn = document.querySelector(".delete-account-btn");
//     if (deleteAccountBtn) {
//         deleteAccountBtn.addEventListener("click", function () {
//             if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
//                 localStorage.removeItem("user");
//                 localStorage.setItem("loggedIn", "false");
//                 window.location.href = "index.html";
//             }
//         });
//     }

//     // Advanced Tab: Invite User (Admin only)
//     const inviteBtn = document.querySelector(".invite-btn");
//     if (inviteBtn) {
//         inviteBtn.addEventListener("click", function () {
//             const username = document.querySelector(".invite-username").value.trim();
//             const email = document.querySelector(".invite-email").value.trim();
//             const password = document.querySelector(".invite-password").value.trim();

//             if (!username || !email || !password) {
//                 alert("Please fill in all invitation fields.");
//                 return;
//             }

//             if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//                 alert("Please enter a valid email address.");
//                 return;
//             }

//             const adminInvitations = JSON.parse(localStorage.getItem("adminInvitations")) || [];
//             adminInvitations.push({ username, email, password, isAdmin: true });
//             localStorage.setItem("adminInvitations", JSON.stringify(adminInvitations));
//             alert("Invitation sent successfully!");

//             // Clear fields
//             document.querySelector(".invite-username").value = "";
//             document.querySelector(".invite-email").value = "";
//             document.querySelector(".invite-password").value = "";
//         });
//     }
// });