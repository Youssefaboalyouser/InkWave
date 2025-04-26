const API_KEY = 'AIzaSyCPqN2mAZ134yn8xDJoZZK1-WDS6pDUWMw'; // Google Books API key

document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const navbar = document.querySelector(".navbar");

    // Navbar link management
    if (navbar) {
        const navLinks = navbar.querySelectorAll("a");
        navLinks.forEach(link => {
            const linkText = link.textContent.trim();
            if (isLoggedIn) {
                // Remove Sign In and Sign Up links when logged in
                if (linkText === "Sign In" || linkText === "Sign Up") {
                    link.remove();
                }
            } else {
                // Remove User Profile and Purchases links when not logged in
                if (linkText === "User Profile" || linkText === "Purchases") {
                    link.remove();
                }
            }
        });
    }

    // Get bookId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("bookId");

    if (!bookId) {
        console.error("No bookId found in URL");
        document.querySelector(".book-container").innerHTML = "<p>Error: Book ID not found in URL.</p>";
        return;
    }

    // Fetch book details from Google Books API using bookId
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const book = await response.json();

        const volumeInfo = book.volumeInfo || {};
        const saleInfo = book.saleInfo || {};

        // Prepare book data
        const bookData = {
            image: volumeInfo.imageLinks?.thumbnail ||
                volumeInfo.imageLinks?.smallThumbnail ||
                'https://via.placeholder.com/150x200?text=No+Cover',
            title: volumeInfo.title || 'Unknown Title',
            authors: volumeInfo.authors?.join(', ') || 'Unknown Author',
            categories: volumeInfo.categories?.join(', ') || 'General',
            description: volumeInfo.description || 'No description available.',
            buyPrice: (saleInfo.listPrice?.amount || saleInfo.retailPrice?.amount || 30.00).toFixed(2),
            borrowPrice: ((saleInfo.listPrice?.amount || saleInfo.retailPrice?.amount || 30.00) * 0.2).toFixed(2), // Borrow price is 20% of buy price
            status: 'Available'
        };

        // Populate book details
        const bookImage = document.querySelector(".book-image");
        const bookTitle = document.querySelector(".book-title");
        const bookAuthor = document.querySelector(".book-detail:nth-child(2)");
        const bookCategory = document.querySelector(".book-detail:nth-child(3)");
        const bookDescription = document.querySelector(".book-detail:nth-child(4)");
        const bookStatus = document.querySelector(".book-detail:nth-child(5)");
        const borrowPrice = document.querySelector(".price-section div:nth-child(1)");
        const buyPrice = document.querySelector(".price-section div:nth-child(2)");

        if (bookImage) bookImage.src = bookData.image;
        if (bookTitle) bookTitle.textContent = bookData.title;
        if (bookAuthor) bookAuthor.innerHTML = `<strong>Author:</strong> ${bookData.authors}`;
        if (bookCategory) bookCategory.innerHTML = `<strong>Category:</strong> ${bookData.categories}`;
        if (bookDescription) bookDescription.innerHTML = `<strong>Description:</strong> ${bookData.description}`;
        if (bookStatus) bookStatus.innerHTML = `<strong>Status:</strong> ${bookData.status}`;
        if (borrowPrice) borrowPrice.textContent = `Borrow Price: $${bookData.borrowPrice}`;
        if (buyPrice) buyPrice.textContent = `Buy Price: $${bookData.buyPrice}`;

        // Handle dropdown and confirm button
        const select = document.querySelector("#option");
        const priceBox = document.querySelector(".price-box");
        const confirmBtn = document.querySelector(".confirm-btn");

        if (select && priceBox && confirmBtn) {
            select.addEventListener("change", function () {
                if (select.value === "") {
                    priceBox.textContent = "* Please choose an option to proceed.";
                    confirmBtn.disabled = true;
                } else {
                    const price = select.value === "borrow" ? bookData.borrowPrice : bookData.buyPrice;
                    priceBox.textContent = `Total: $${price}`;
                    confirmBtn.disabled = false;
                }
            });

            confirmBtn.addEventListener("click", function () {
                if (select.value === "") {
                    alert("Please select an option (Borrow or Buy).");
                    return;
                }
                if (!isLoggedIn) {
                    alert("Please log in to proceed with this action.");
                    window.location.href = "sign In.html";
                    return;
                }

                // Add book to cart
                const bookToAdd = {
                    image: bookData.image,
                    title: bookData.title,
                    action: select.value,
                    price: select.value === "borrow" ? bookData.borrowPrice : bookData.buyPrice
                };
                addToCart(bookToAdd);

                alert(`You have chosen to ${select.value} "${bookData.title}" for $${select.value === "borrow" ? bookData.borrowPrice : bookData.buyPrice}. Added to cart!`);
                confrimed = confirm("Do you want to spend now ?");
                if(confrimed){
                    window.location.href = "cart.html";
                }
                else{
                    window.location.href = "books.html"
                }
            });
        }
    } catch (error) {
        console.error('Error fetching book details:', error);
        document.querySelector(".book-container").innerHTML = "<p>Error loading book details. Please try again later.</p>";
    }
});

// Function to add book to cart
function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
}