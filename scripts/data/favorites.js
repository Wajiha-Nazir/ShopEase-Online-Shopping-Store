import { products } from './products.js';
import { loadFromStorage, saveToStorage } from './storage.js';

export const FAVORITES_KEY = 'shopEaseFavorites';

export function getFavorites() {
    return loadFromStorage(FAVORITES_KEY, []);
} //done

export function saveFavorites(ids) {
    saveToStorage(FAVORITES_KEY, ids);
}//done

export function addFavorite(productId) {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        saveFavorites(favorites);
        window.dispatchEvent(new Event('favoritesUpdated'));
    }
    return favorites;
}//done

export function removeFavorite(productId) {
    const favorites = getFavorites().filter((favoriteId) => favoriteId !== productId);
    saveFavorites(favorites);
    window.dispatchEvent(new Event('favoritesUpdated'));
    return favorites;
} //done

export function toggleFavorite(productId) {
    return getFavorites().includes(productId) ? removeFavorite(productId) : addFavorite(productId);
} //done

export function isFavorite(productId) {
    return getFavorites().includes(productId);
} //done

export function getFavoriteIcon(productId) {
    return isFavorite(productId) ? 'images/filled-heart.png' : 'images/unfilled-heart.png';
} //done

export function getFavoriteProducts(allProducts = products) {
    return allProducts.filter((product) => isFavorite(product.id));
}

export function updateFavoriteButton(button, productId) {
    if (!button) return;

    const icon = button.querySelector('img');
    if (icon) {
        icon.src = `${getFavoriteIcon(productId)}`;
        icon.alt = isFavorite(productId) ? 'Remove from favorites' : 'Add to favorites';
    }
}//done

export function updateFavoriteLink(link = document.querySelector('.fav-link')) {
    if (!link) return;

    const icon = link.querySelector('img');
    const hasFavorites = getFavorites().length > 0;

    if (icon) {
        icon.src = hasFavorites ? 'images/filled-heart.png' : 'images/unfilled-heart.png';
    }
}//done

export function syncFavoriteUi() {
    document.querySelectorAll('.product-fav-button').forEach((button) => {
        const productId = button.dataset.productId;
        if (productId) {
            updateFavoriteButton(button, productId);
        }
    });

    updateFavoriteLink();
}//done

window.addEventListener('storage', () => {
    window.dispatchEvent(new Event('favoritesUpdated'));
});
