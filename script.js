document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const menuButton = document.getElementById('menuButton');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.querySelector('.cart-count');
    const productListing = document.getElementById('productListing');
    const categoryBlocks = document.querySelectorAll('.category-block');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

    // Modals
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');

    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.modal .close-button');

    // Modal specific buttons
    const modalAddToCartButton = document.getElementById('modalAddToCart');
    const checkoutButton = document.getElementById('checkoutButton');
    const checkoutForm = document.getElementById('checkoutForm');


    // --- Data (Example Products) ---
    const products = [
        { id: 1, name: 'Golden Abstract', description: 'A vibrant abstract piece with splashes of gold.', price: 450, imageUrl: 'https://via.placeholder.com/400x300/FFD700/000000?text=Golden+Abstract', category: 'modern', priceCategory: 'under500' },
        { id: 2, name: 'Classic Portrait', description: 'Oil painting of a noble figure from the 18th century.', price: 680, imageUrl: 'https://via.placeholder.com/400x300/6A5ACD/FFFFFF?text=Classic+Portrait', category: 'classic', priceCategory: 'under750' },
        { id: 3, name: 'Modern Landscape', description: 'Contemporary landscape with bold colors and textures.', price: 520, imageUrl: 'https://via.placeholder.com/400x300/ADD8E6/000000?text=Modern+Landscape', category: 'modern', priceCategory: 'under750' },
        { id: 4, name: 'Baroque Still Life', description: 'Detailed still life reminiscent of the Baroque era.', price: 900, imageUrl: 'https://via.placeholder.com/400x300/CD853F/FFFFFF?text=Baroque+Still+Life', category: 'classic' },
        { id: 5, name: 'Minimalist Gold Lines', description: 'Simple yet striking design with gold lines on a dark canvas.', price: 300, imageUrl: 'https://via.placeholder.com/400x300/B8860B/000000?text=Minimalist+Gold', category: 'modern', priceCategory: 'under500' }
        // Add more products with various categories and prices
    ];

    let cart = []; // Array to hold cart items

    // --- Functions ---

    // Toggle Sidebar
    function toggleSidebar() {
        sidebarMenu.classList.toggle('active');
    }

    // Show Modal
    function showModal(modalElement) {
        modalElement.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    // Hide Modal
    function hideModal(modalElement) {
        modalElement.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Render Product Cards
    function renderProducts(filteredProducts = products) {
        productListing.innerHTML = ''; // Clear existing products
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productListing.appendChild(productCard);

            // Add click listener to show product detail modal
            productCard.querySelector('img').addEventListener('click', () => showProductDetail(product));
            productCard.querySelector('h3').addEventListener('click', () => showProductDetail(product));
            productCard.querySelector('p').addEventListener('click', () => showProductDetail(product));

            // Add to cart button directly on card (can remove if only using modal button)
            productCard.querySelector('.add-to-cart-button').addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent modal from opening
                addToCart(product);
            });
        });
    }

    // Show Product Detail Modal
    function showProductDetail(product) {
        document.getElementById('modalImage').src = product.imageUrl;
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
        modalAddToCartButton.dataset.productId = product.id; // Store product ID
        showModal(productModal);
    }

    // Add to Cart
    function addToCart(productToAdd) {
        const existingItem = cart.find(item => item.id === productToAdd.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        updateCartDisplay();
        hideModal(productModal); // Hide product detail modal after adding
    }

    // Update Cart Display
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #E0B973;">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" data-action="increase">+</button>
                        <button data-id="${item.id}" data-action="remove">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Add event listeners for cart item actions
        cartItemsContainer.querySelectorAll('.cart-item-actions button').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                const action = event.target.dataset.action;
                updateCartItemQuantity(id, action);
            });
        });
    }

    // Update Cart Item Quantity
    function updateCartItemQuantity(id, action) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            if (action === 'increase') {
                cart[itemIndex].quantity++;
            } else if (action === 'decrease') {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1); // Remove if quantity drops to 0 or less
                }
            } else if (action === 'remove') {
                cart.splice(itemIndex, 1);
            }
        }
        updateCartDisplay();
    }


    // Filter Products
    function filterProducts(filterType, value) {
        let filtered = products;
        if (filterType === 'category') {
            filtered = products.filter(p => p.category === value);
        } else if (filterType === 'priceCategory') {
            if (value === 'under500') {
                filtered = products.filter(p => p.price < 500);
            } else if (value === 'under750') {
                filtered = products.filter(p => p.price < 750);
            }
        }
        renderProducts(filtered);
        hideModal(sidebarMenu); // Close sidebar after selection
    }

    // --- Event Listeners ---

    // Menu button to toggle sidebar
    menuButton.addEventListener('click', toggleSidebar);

    // Cart icon to open cart modal
    cartIcon.addEventListener('click', () => {
        updateCartDisplay(); // Ensure cart is updated before showing
        showModal(cartModal);
    });

    // Close buttons for all modals
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Find the parent modal and hide it
            const modal = event.target.closest('.modal');
            if (modal) {
                hideModal(modal);
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            hideModal(productModal);
        } else if (event.target === cartModal) {
            hideModal(cartModal);
        } else if (event.target === checkoutModal) {
            hideModal(checkoutModal);
        }
    });

    // Add to Cart button in product detail modal
    modalAddToCartButton.addEventListener('click', () => {
        const productId = parseInt(modalAddToCartButton.dataset.productId);
        const product = products.find(p => p.id === productId);
        if (product) {
            addToCart(product);
        }
    });

    // Checkout button in cart modal
    checkoutButton.addEventListener('click', () => {
        hideModal(cartModal);
        showModal(checkoutModal);
    });

    // Checkout Form submission
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        alert('Order Placed! Thank you for your purchase.');
        cart = []; // Clear cart
        updateCartDisplay(); // Update cart UI
        hideModal(checkoutModal);
        // In a real application, you would send this data to a server
        checkoutForm.reset(); // Clear form fields
    });

    // Category Block Click Handlers
    categoryBlocks.forEach(block => {
        block.addEventListener('click', () => {
            const category = block.dataset.category;
            filterProducts('category', category);
        });
    });

    // Sidebar Link Click Handlers
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const filter = event.target.dataset.filter;
            if (filter === 'classic' || filter === 'modern') {
                filterProducts('category', filter);
            } else if (filter === 'under500' || filter === 'under750') {
                filterProducts('priceCategory', filter);
            }
        });
    });

    // --- Initial Render ---
    renderProducts(); // Load all products on page load
    updateCartDisplay(); // Initialize cart count
});
