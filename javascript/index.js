// index.js
const API_KEY = 'AIzaSyCPqN2mAZ134yn8xDJoZZK1-WDS6pDUWMw'; // Google Books API key

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const navbar = document.querySelector(".navbar");
    const buttonsDiv = document.querySelector(".rightsub .buttons");

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

    if (isLoggedIn) {
        // Get user data from localStorage
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const username = savedUser ? savedUser.username : "User";

        // Replace Log In and Sign Up buttons with username and avatar
        if (buttonsDiv) {
            buttonsDiv.innerHTML = `
                <div class="user-info" style="display:flex;justify-content: center;align-items: center;gap:20px">
                    <a href="user_profile.html"><img src="${savedUser?.profilePhoto || 'assets/av2.jpg'}" alt="User Avatar" class="avatar" style="width: 40px;height: 40px;border-radius: 50%;"></a>
                    <span class="username" style="font-size:20px;background-color:#336361;color:#f8f2e8;border-radius:5px;padding:10px">${username}</span>
                </div>
            `;
        }
    } else {
        // Restore Sign In and Sign Up buttons when not logged in
        if (buttonsDiv) {
            buttonsDiv.innerHTML = `
                <a href="sign In.html"><button class="bt-one">Log In</button></a>
                <a href="sign up.html"><button class="bt-tow">Sign Up</button></a>
            `;
        }
    }

    // Fetch best-selling books from Google Books API
    async function fetchBestSellingBooks() {
        try {
            // Fetch 4 popular books
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=bestseller&maxResults=4&key=${API_KEY}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const books = data.items || [];

            // Update the Best Selling Books section
            const booksContainer = document.querySelector(".best-section .books");
            if (booksContainer) {
                booksContainer.innerHTML = books.map(book => {
                    const volumeInfo = book.volumeInfo || {};
                    const saleInfo = book.saleInfo || {};

                    // Get book image, title, price, and description
                    const imageUrl = volumeInfo.imageLinks?.thumbnail ||
                        volumeInfo.imageLinks?.smallThumbnail ||
                        'https://via.placeholder.com/150x200?text=No+Cover';
                    const title = volumeInfo.title || 'Unknown Title';
                    let price = '30.00'; // Default price
                    if (saleInfo.listPrice) {
                        price = saleInfo.listPrice.amount.toFixed(2);
                    } else if (saleInfo.retailPrice) {
                        price = saleInfo.retailPrice.amount.toFixed(2);
                    }
                    let description = volumeInfo.description || 'No description available.';
                    if (description.length > 50) {
                        description = description.substring(0, 50) + '...';
                    }
                    const bookId = book.id || ''; // Google Books API book ID

                    return `
                        <div class="book">
                            <div class="book-img">
                                <a href="book-details.html?bookId=${encodeURIComponent(bookId)}"><img src="${imageUrl}" alt="${title}"></a>
                            </div>
                            <div class="book-description">
                                <div class="book-details">
                                    <p class="name">${title}</p>
                                    <p class="price">$${price}</p>
                                </div>
                                <div class="des">
                                    <p class="des">${description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Error fetching best-selling books:', error);
            const booksContainer = document.querySelector(".best-section .books");
            if (booksContainer) {
                booksContainer.innerHTML = '<p>Error loading best-selling books. Please try again later.</p>';
            }
        }
    }

    // Call the function to fetch and display best-selling books
    fetchBestSellingBooks();
});

function sendmail() {
    let recipientEmail = document.getElementById("email").value;

    let para = {
        to_email: recipientEmail,
        email: recipientEmail,
        from_email: "youssefaboalyouser@gmail.com",
        subject: "Ask any question to Us",
        name: "InKwave",
        message: `Hi there,

Thank you for getting in touch with us! 🎉
We're excited to have you as part of our community.

If you ever have any questions, suggestions, or just want to say hello, feel free to reply to this email—we’re always happy to hear from you!

Looking forward to chatting with you soon 😊

Warm regards,  
InKwave Team  
📬 Just hit reply to this message any time you need us!`
    };

    emailjs.send("service_00kuirr", "template_f4oow7f", para)
        .then(function (response) {
            alert("Check your mail!!");
        }, function (error) {
            console.error("FAILED...", error);
            alert("Failed to send email. Please try again later.");
        });
}