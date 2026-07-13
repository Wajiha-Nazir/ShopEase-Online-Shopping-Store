// Reusable HTML builders for shared product and order cards.

import { formatCurrency } from './helpers.js';
import { getColorValue, getProductOptions } from './product-utils.js';
import { getFavoriteIcon } from './favorites.js';

export function createProductCard(product) {
    const { sizes, colors } = getProductOptions(product);
    const sizeOptionsHTML = buildSizeOptionsHTML(product.id, sizes);
    const colorOptionsHTML = buildColorOptionsHTML(product.id, colors);
    const quantitySelectHTML = buildQuantityHTML(product.id);

    return `
        <div class="card">
            <div class="product-image-wrapper">
                <img class="product-images" src="${product.image}" alt="Product">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="stars">
                <img class="product-rating-star" src="${product.rating.stars}" alt="Rating">
                <div class="product-rating-count">${product.rating.count}</div>
            </div>
            <div class="price">$${formatCurrency(product.price)}</div>
            <div class="options">
                ${quantitySelectHTML}
                ${sizeOptionsHTML}
                ${colorOptionsHTML}
            </div>
            <div class="card-actions">
                <button class="add-btn" data-product-id="${product.id}">Add to Cart</button>
                <button class="product-fav-button" type="button" data-product-id="${product.id}">
                    <img class="add-to-fav-icon" src="images/${getFavoriteIcon(product.id)}" alt="Favorite">
                </button>
            </div>
        </div>
    `;
} //done

export function createOrderCard(order) {
    return `
        <div class="order-card">
            <div class="order-card-header">
                <div>
                    <p class="order-label">Order ID</p>
                    <h3>${order.orderId}</h3>
                </div>
                <div>
                    <p class="order-label">Order Date</p>
                    <p>${order.orderDate}</p>
                </div>
                <div>
                    <p class="order-label">Order Status</p>
                    <p class="status-badge">${order.orderStatus}</p>
                </div>
                <div>
                    <p class="order-label">Total Amount</p>
                    <p>$${Number(order.totalAmount || 0).toFixed(2)}</p>
                </div>
            </div>

            <div class="order-items">
                ${order.products.map((product) => `
                    <div class="order-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="order-item-info">
                            <h4>${product.name}</h4>
                            <p><strong>Quantity:</strong> ${product.quantity}</p>
                            <p><strong>Size:</strong> ${product.size}</p>
                            <p><strong>Color:</strong> ${product.color}</p>
                            <p><strong>Price:</strong> $${formatCurrency(product.price)}</p>
                            <p><strong>Delivery:</strong> ${product.deliveryOption}</p>
                            
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function buildSizeOptionsHTML(productId, sizes) {
    if (!sizes.length) return '';
    return `<div class="size-picker">${sizes.map((size, index) => `
        <label class="size-label">
            <input type="radio" name="size-${productId}" value="${size}" ${index === 0 ? 'checked' : ''}>
            <span>${size}</span>
        </label>
    `).join('')}</div>`;
} //done

function buildColorOptionsHTML(productId, colors) {
    if (!colors.length) return '';
    return `<div class="color-picker">${colors.map((color, index) => {
        const swatch = getColorValue(color);
        return `
            <label class="color-label" title="${color}" style="background:${swatch};">
                <input type="radio" name="color-${productId}" value="${color}" ${index === 0 ? 'checked' : ''}>
                <span class="color-indicator"></span>
            </label>
        `;
    }).join('')}</div>`;
} //done

function buildQuantityHTML(productId) {
    const quantities = [1, 2, 3, 4, 5];
    return `<select class="JS-quantity-select" data-product-id="${productId}">${quantities.map((quantity, index) => `
        <option value="${quantity}">${index === 0 ? `Quantity: ${quantity}` : quantity}</option>
    `).join('')}</select>`;
}
