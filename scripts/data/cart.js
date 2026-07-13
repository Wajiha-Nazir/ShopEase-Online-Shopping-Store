import { loadFromStorage, saveToStorage } from './storage.js';

const CART_KEY = 'cart';

function normalizeCart(savedCart) {
    if (!Array.isArray(savedCart)) {
        return [{
            productId: 'p001',
            quantity: 2,
            size: 'M',
            color: 'Blue',
            deliveryOption: 'FREE Delivery'
        }, {
            productId: 'p002',
            quantity: 1,
            size: '42',
            color: 'Black',
            deliveryOption: 'FREE Delivery'
        }];
    }

    return savedCart.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        deliveryOption: item.deliveryOption || 'FREE Delivery'
    }));
}//done

export function loadCart() {
    return normalizeCart(loadFromStorage(CART_KEY, []));
} //done

export function saveCart(items = cart) {
    saveToStorage(CART_KEY, items);
} //done

export let cart = loadCart(); //done

export function addToCart(productId, options = {}) {
    const quantity = Number(options.quantity) || 1;
    const size = options.size || '';
    const color = options.color || '';
    const deliveryOption = options.deliveryOption || 'FREE Delivery';

    const existingItem = cart.find((item) => item.productId === productId && item.size === size && item.color === color);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity, size, color, deliveryOption });
    }

    saveCart(cart);
    return cart;
} //done

export function updateCartItem(index, updates) {
    if (typeof index !== 'number' || index < 0 || index >= cart.length) {
        return cart;
    }

    cart[index] = {
        ...cart[index],
        ...updates,
        quantity: Number(updates.quantity) || cart[index].quantity
    };

    saveCart(cart);
    return cart;
}//done

export function setDeliveryOption(index, deliveryOption) {
    if (typeof index !== 'number' || index < 0 || index >= cart.length) {
        return cart;
    }

    cart[index] = {
        ...cart[index],
        deliveryOption
    };

    saveCart(cart);
    return cart;
}

export function removeFromCart(index) {
    if (typeof index === 'number' && index >= 0 && index < cart.length) {
        cart.splice(index, 1);
    } else {
        cart = cart.filter((cartItem) => cartItem.productId !== index);
    }

    saveCart(cart);
    return cart;
}

export function clearCart() {
    cart = [];
    saveCart(cart);
    return cart;
}//done

export function calculateCartQuantity(items = cart) {
    return items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
} //done

export function updateCartQuantityUI(selector = '.JS-cart-quantity') {
    const cartQuantityElement = document.querySelector(selector);
    if (!cartQuantityElement) return;

    cartQuantityElement.innerHTML = calculateCartQuantity();
} //done

