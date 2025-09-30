document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.querySelector('.cart-count');
    const productListing = document.getElementById('productListing');
    
    // Modals
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');

    // Modal close buttons
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            productModal.style.display = 'none';
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
        });
    });

    // Close modal if clicking outside
    window.addEventListener('click', (event) => {
        if (event.target == productModal) productModal.style.display = 'none';
        if (event.target == cartModal) cartModal.style.display = 'none';
        if (event.target == checkoutModal) checkoutModal.style.display = 'none';
    });

    // Dummy product data
    const products = [
        {
            id: 'p1',
            name: 'Serene Sunset',
            category: 'classic',
            price: 450.00,
            image: 'https://via.placeholder.com/400x300/A2D2FF/000000?text=Serene+Sunset',
            description: 'A classic oil painting depicting a peaceful sunset over a tranquil lake. Rich colors and smooth brushstrokes capture the essence of natural beauty.',
            priceRange: 'under500'
        },
        {
            id: 'p2',
            name: 'Abstract Cityscape',
            category: 'modern',
            price: 680.00,
            image: 'https://via.placeholder.com/400x300/FFC7A2/000000?text=Abstract+Cityscape',
            description: 'A vibrant modern acrylic painting, abstractly representing a bustling city at night with bold lines and contrasting hues.',
            priceRange: 'under750'
        },
        {
            id: 'p3',
            name: 'Rustic Farmhouse',
            category: 'classic',
            price: 720.00,
            image: 'https://via.placeholder.com/400x300/B8E986/000000?text=Rustic+Farmhouse',
            description: 'Detailed watercolor of an old rustic farmhouse, showcasing intricate details and warm, inviting tones.',
            priceRange: 'under750'
        },
        {
            id: 'p4',
            name: 'Geometric Fusion',
            category: 'modern',
            price: 320.00,
            image: 'https://via.placeholder.com/400x300/E3DDF4/000000?text=Geometric+Fusion',
            description: 'A minimalist modern piece utilizing sharp geometric shapes and a limited color palette to create a sense of balance and rhythm.',
            priceRange: 'under500'
        },
        {
            id: 'p5',
            name: 'Mountain Vista',
            category: 'classic',
            price: 580.00,
            image: 'https://via.placeholder.com/400x300/D4F1F4/000000?text=Mountain+Vista',
            description: 'A grand landscape painting capturing the majestic view of snow-capped mountains under a clear blue sky.',
            priceRange: 'under750'
        },
        {
            id: 'p6',
            name: 'Pop Art Portrait',
            category: 'modern',
            price: 490.00,
            image: 'https://via.placeholder.com/400x300/FFDD65/000000?text=Pop+Art+Portrait',
            description: 'A striking pop art portrait with bold outlines and bright, contrasting colors, inspired by iconic comic book styles.',
            priceRange: 'under500'
        }
    ];

    let cart = JSON.parse(localStorage.getItem('sayaEhaqCart')) || [];

    // Function to render products
    function renderProducts(filteredProducts = products) {
        productListing.innerHTML = ''; // Clear current products
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="action-button view-button" data-id="${product.id}">View</button>
                        <button class="action-button cart-add-button" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            productListing.appendChild(productCard);
        });
        attachProductCardListeners();
    }

    // Function to attach listeners to dynamically created product cards
    function attachProductCardListeners() {
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const product = products.find(p => p.id === productId);
                if (product) {
                    document.getElementById('modalImage').src = product.image;
                    document.getElementById('modalTitle').textContent = product.name;
                    document.getElementById('modalDescription').textContent = product.description;
                    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
                    document.getElementById('modalAddToCart').dataset.id = product.id; // Set ID for adding to cart
                    productModal.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('.cart-add-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                addToCart(productId);
            });
        });
    }

    // Update cart count display
    function updateCartCount() {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('sayaEhaqCart', JSON.stringify(cart));
    }

    // Add to cart functionality
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartCount();
            alert(`${product.name} added to cart!`);
        }
    }

    // Render cart items in cart modal
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalSpan = document.getElementById('cartTotal');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-from-cart" data-id="${item.id}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
        attachCartItemListeners();
    }

    // Attach listeners to cart item buttons (e.g., remove)
    function attachCartItemListeners() {
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                removeFromCart(productId);
            });
        });
    }

    // Remove from cart functionality
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        renderCartItems(); // Re-render cart
    }

    // Event Listeners
    menuButton.addEventListener('click', () => {
        sidebarMenu.classList.toggle('active');
    });

    cartIcon.addEventListener('click', () => {
        renderCartItems();
        cartModal.style.display = 'flex';
    });

    document.getElementById('modalAddToCart').addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        addToCart(productId);
        productModal.style.display = 'none'; // Close product detail modal
    });

    document.getElementById('checkoutButton').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'flex';
    });

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the order data to a server
        const formData = new FormData(e.target);
        const orderDetails = Object.fromEntries(formData.entries());
        orderDetails.items = cart;
        orderDetails.total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

        console.log('Order Details:', orderDetails);
        alert('Thank you for your order! Your order has been placed.');

        // Clear cart and close modals
        cart = [];
        updateCartCount();
        checkoutModal.style.display = 'none';
        
        // Optionally, redirect to a thank you page or show a success message
        renderProducts(); // Re-render
