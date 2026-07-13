import { addToCart, clearCart } from './cart.js';
import { products } from './products.js';
import { loadFromStorage, saveToStorage } from './storage.js';
import { createOrderCard } from './components.js';

const ORDERS_STORAGE_KEY = 'orders';

export function saveOrders(orders) {
    saveToStorage(ORDERS_STORAGE_KEY, orders);
}//done

export function getOrders() {
    return loadFromStorage(ORDERS_STORAGE_KEY, []);
}//done

export function placeOrder({ cartItems, shippingCost, subtotal, tax, totalAmount }) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return null;
    }

    const orders = getOrders();
    const orderId = `ORD-${Date.now()}`;
    const orderDate = new Date().toLocaleString();
    const orderTimestamp = Date.now();
    const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

    const roundedTotalAmount = Number(totalAmount || 0).toFixed(2);

    const newOrder = {
        orderId,
        orderDate,
        orderTimestamp,
        orderStatus: 'Placed',
        quantity: totalQuantity,
        shippingCost,
        subtotal,
        tax,
        totalAmount: Number(roundedTotalAmount),
        products: cartItems.map((item) => {
            const product = products.find((productItem) => productItem.id === item.productId);
            return {
                productId: item.productId,
                image: product ? product.image : '',
                name: product ? product.name : 'Unknown Product',
                quantity: Number(item.quantity || 1),
                size: item.size || 'N/A',
                color: item.color || 'N/A',
                deliveryOption: item.deliveryOption || 'FREE Delivery',
                price: product ? product.price : 0
            };
        })
    };

    orders.unshift(newOrder);
    saveOrders(orders);
    clearCart();
    return newOrder;
}//done


export function renderOrders() {
    const ordersList = document.querySelector('.JS-orders-list');
    if (!ordersList) {
        return;
    }

    const orders = getOrders()
        .slice()
        .sort((a, b) => b.orderTimestamp - a.orderTimestamp);

    if (!orders.length) {
        ordersList.innerHTML = '<p class="empty-orders">You haven\'t placed any orders yet.</p>';
        return;
    }

    ordersList.innerHTML = orders.map(createOrderCard).join('');
}


renderOrders();
