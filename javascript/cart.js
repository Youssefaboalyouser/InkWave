document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const navbar = document.querySelector(".navbar");
    const cartItemCount = document.querySelector(".cart-item-count");
    const cartItemsContainer = document.querySelector("#cart-items");
    const totalItemsCount = document.querySelector("#total-items-count");
    const totalPriceAmount = document.querySelector("#total-price-amount");
    const confirmRequestBtn = document.querySelector("#confirm-request-btn");

    // 1. Manage Navbar Links
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

    // 2. Load and Display Cart Items
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <div class="cart-item-left">
                    <img src="${item.image}" alt="${item.title}" class="cart-book-img">
                </div>
                <div class="cart-item-right">
                    <h3 class="product-title">${item.title}</h3>
                    <p class="ref">Ref: LIB-${String(index + 1).padStart(3, "0")}</p>
                    <div class="delivery-options">
                        <span><i class="ri-store-2-line"></i> Library Pickup</span>
                        <span><i class="ri-truck-line"></i> Home Delivery</span>
                    </div>
                    <div class="item-details">
                        <span>Qty: 1</span>
                        <span>Due in: 14 days</span>
                        <span>Price: $${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                    <button class="btn-delete" data-index="${index}">
                        <i class="ri-delete-bin-line"></i> Delete
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);

            // Add item price to total
            totalPrice += parseFloat(item.price);
        });

        // Update cart icon, total items count, and total price
        cartItemCount.textContent = cart.length;
        totalItemsCount.textContent = cart.length;
        totalPriceAmount.textContent = `$${totalPrice.toFixed(2)}`;

        // Disable confirm button if cart is empty
        confirmRequestBtn.disabled = cart.length === 0;

        // Attach event listeners to delete buttons
        const deleteButtons = document.querySelectorAll(".btn-delete");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(button.getAttribute("data-index"));
                cart.splice(index, 1); // Remove item from cart array
                localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
                updateCartDisplay(); // Refresh cart display
            });
        });
    }

    // Initial cart display
    updateCartDisplay();

    // 3. Handle Confirm Request
    if (confirmRequestBtn) {
        confirmRequestBtn.addEventListener("click", function () {
            if (!isLoggedIn) {
                alert("Please log in to confirm your request.");
                window.location.href = "sign In.html";
                return;
            }

            const cardNumber = prompt("Please enter your credit card number:");
            if (cardNumber && cardNumber.trim().length >= 12) { // Basic validation
                alert("Payment processed successfully! Your request has been confirmed.");
                // Clear cart after successful confirmation
                localStorage.removeItem("cart");
                cart = [];
                updateCartDisplay();
            } else {
                alert("Invalid credit card number. Please try again.");
            }
        });
    }
});

// Function to add book to cart (called from book_details.js)
function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
}