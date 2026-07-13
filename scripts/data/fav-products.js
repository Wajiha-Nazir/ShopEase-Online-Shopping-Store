import { addToCart } from './cart.js';
import { products } from './products.js';
import { getFavoriteProducts, toggleFavorite, syncFavoriteUi } from './favorites.js';
import { createProductCard } from './components.js';

function renderFavorites() {
    const favorites = getFavoriteProducts(products);
    const container = document.querySelector('.favorites-grid');

    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = '<div class="empty-state">No favorite products yet.</div>';
        return;
    }

    container.innerHTML = favorites.map(createProductCard).join('');
    setupFavoriteEvents();
    syncFavoriteUi();
}

function setupFavoriteEvents() {
    document.querySelectorAll('.add-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const card = button.closest('.card');
            const quantitySelect = card.querySelector('.JS-quantity-select');
            const sizeInput = card.querySelector(`input[name="size-${productId}"]:checked`);
            const colorInput = card.querySelector(`input[name="color-${productId}"]:checked`);

            const quantity = quantitySelect ? Number(quantitySelect.value) : 1;
            const size = sizeInput ? sizeInput.value : '';
            const color = colorInput ? colorInput.value : '';

            addToCart(productId, { quantity, size, color });
            const originalText = button.textContent;
            button.textContent = 'Added To Cart';
            button.style.background = '#28a745';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#1a1a2e';
            }, 2000);
        });
    });

    document.querySelectorAll('.product-fav-button').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            toggleFavorite(productId);
            renderFavorites();
        });
    });
}

window.addEventListener('favoritesUpdated', renderFavorites);
renderFavorites();