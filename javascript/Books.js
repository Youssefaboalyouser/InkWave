const API_KEY = 'AIzaSyCPqN2mAZ134yn8xDJoZZK1-WDS6pDUWMw'; // Google Books API key

document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("user"));
    const navbar = document.querySelector(".navbar");
    const userProfileSpan = document.querySelector(".user-profile span");
    const profileImage = document.querySelector(".user-profile img");

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
            if (linkText === "User profile"|| linkText === "purchases") {
                link.remove();
                if (userProfileSpan) userProfileSpan.remove();
                if (profileImage) profileImage.remove();
            }
        }
    });

    // Update user profile in header
    if (isLoggedIn && userData) {
        if (userProfileSpan) {
            userProfileSpan.textContent = userData.username;
        }
        if (profileImage) {
            profileImage.src = userData.profilePhoto || "assets/av2.jpg";
            profileImage.alt = `${userData.username}'s profile`;
        }
    }

    // Autofill Recommended Section
    const recommendedSection = document.querySelector(".recommended .book-list");
    async function fetchRecommendedBooks() {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=popular&maxResults=6&key=${API_KEY}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const books = data.items || [];
            updateRecommendations(books);
        } catch (error) {
            console.error("Error fetching recommended books:", error);
            if (recommendedSection) {
                recommendedSection.innerHTML = '<p>Error loading recommended books. Please try again.</p>';
            }
        }
    }

    function updateRecommendations(books) {
        if (!recommendedSection) return;

        recommendedSection.innerHTML = books.map((book) => {
            const volumeInfo = book.volumeInfo || {};
            const imageUrl = volumeInfo.imageLinks?.thumbnail || "assets/default_book.jpg";
            const title = volumeInfo.title?.length > 20 ? volumeInfo.title.substring(0, 17) + "..." : volumeInfo.title || "Unknown Title";
            const author = volumeInfo.authors?.[0] || "Unknown Author";
            const rating = volumeInfo.averageRating ? `★★★★★ ${volumeInfo.averageRating}` : "★★★★★ 4.0";
            const bookId = book.id || '';

            return `
                <a href="book-details.html?bookId=${encodeURIComponent(bookId)}">
                    <div class="book-card">
                        <img src="${imageUrl}" alt="${volumeInfo.title || 'Book'}">
                        <h3>${title}</h3>
                        <p>${author}</p>
                        <div class="rating">${rating}</div>
                    </div>
                </a>
            `;
        }).join("");
    }

    // Autofill Best Author in 2025 Section (e.g., books by a specific author)
    const bestAuthorSection = document.querySelector(".Best-Author .book-list");
    async function fetchBestAuthorBooks() {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:"نجيب محفوظ"&maxResults=6&key=${API_KEY}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const books = data.items || [];
            updateBestAuthorBooks(books);
        } catch (error) {
            console.error("Error fetching best author books:", error);
            if (bestAuthorSection) {
                bestAuthorSection.innerHTML = '<p>Error loading best author books. Please try again.</p>';
            }
        }
    }

    function updateBestAuthorBooks(books) {
        if (!bestAuthorSection) return;

        bestAuthorSection.innerHTML = books.map((book) => {
            const volumeInfo = book.volumeInfo || {};
            const imageUrl = volumeInfo.imageLinks?.thumbnail || "assets/default_book.jpg";
            const title = volumeInfo.title?.length > 20 ? volumeInfo.title.substring(0, 17) + "..." : volumeInfo.title || "Unknown Title";
            const author = volumeInfo.authors?.[0] || "Unknown Author";
            const rating = volumeInfo.averageRating ? `★★★★★ ${volumeInfo.averageRating}` : "★★★★★ 4.0";
            const bookId = book.id || '';

            return `
                <a href="book-details.html?bookId=${encodeURIComponent(bookId)}">
                    <div class="book-card">
                        <img src="${imageUrl}" alt="${volumeInfo.title || 'Book'}">
                        <h3>${title}</h3>
                        <p>${author}</p>
                        <div class="rating">${rating}</div>
                    </div>
                </a>
            `;
        }).join("");
    }

    // Search functionality
    const searchInput = document.querySelector(".search-bar input");
    if (searchInput) {
        searchInput.addEventListener("input", async function (e) {
            const searchTerm = e.target.value.trim();
            if (!searchTerm) return;

            try {
                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=6&key=${API_KEY}`
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                updateRecommendations(data.items || []);
            } catch (error) {
                console.error("Error fetching books:", error);
                if (recommendedSection) {
                    recommendedSection.innerHTML = '<p>Error loading books. Please try again.</p>';
                }
            }
        });
    }

    // Category filter functionality
    const filterButtons = document.querySelectorAll(".category-filters .filter-btn");
    const bookGrid = document.querySelector(".categories .book-grid");

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const category = button.textContent;
            filterBooks(category);
        });
    });

    async function filterBooks(category) {
        if (!bookGrid) return;

        let books = [];
        if (category === "All") {
            // Fetch from API
            try {
                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=books&maxResults=20&key=${API_KEY}`
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                books = data.items || [];
            } catch (error) {
                console.error("Error fetching books:", error);
                bookGrid.innerHTML = '<p>Error loading books. Please try again.</p>';
                return;
            }
        } else {
            // Map category to Google Books API subject
            const categoryMap = {
                "Sci-Fi": "science_fiction",
                "Fantasy": "fantasy",
                "Drama": "drama",
                "Business": "business",
                "Education": "education",
                "Geography": "geography"
            };
            const subject = categoryMap[category] || category.toLowerCase();

            // Fetch from API
            try {
                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(subject)}&maxResults=20&key=${API_KEY}`
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                books = data.items || [];
            } catch (error) {
                console.error("Error fetching books:", error);
                bookGrid.innerHTML = '<p>Error loading books. Please try again.</p>';
                return;
            }
        }

        displayCategoryBooks(books);
    }

    function displayCategoryBooks(books) {
        bookGrid.innerHTML = books.map((book) => {
            const volumeInfo = book.volumeInfo || {};
            const imageUrl = volumeInfo.imageLinks?.thumbnail || "assets/default_book.jpg";
            const title = volumeInfo.title?.length > 20 ? volumeInfo.title.substring(0, 17) + "..." : volumeInfo.title || "Unknown Title";
            const author = volumeInfo.authors?.[0] || "Unknown Author";
            const bookId = book.id || '';

            return `
                <a href="book-details.html?bookId=${encodeURIComponent(bookId)}">
                    <div class="book-card">
                        <img src="${imageUrl}" alt="${volumeInfo.title || 'Book'}">
                        <h3>${title}</h3>
                        <p>${author}</p>
                    </div>
                </a>
            `;
        }).join("");
    }

    // Initial fetch for Recommended and Best Author sections
    fetchRecommendedBooks();
    fetchBestAuthorBooks();
    filterBooks("All"); // Load "All" category by default
});