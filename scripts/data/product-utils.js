// Shared helpers for working with product data.

import { formatCurrency } from './helpers.js';

export function getProductById(productId, products = []) {
    return products.find((product) => product.id === productId) || null;
}

export function getProductOptions(product) {
    return {
        sizes: Array.isArray(product?.sizes) ? product.sizes : [],
        colors: Array.isArray(product?.colors) ? product.colors : []
    };
} //done

export function getCategory(product) {
    return product?.category || 'General';
}

export function formatProduct(product) {
    return {
        ...product,
        priceLabel: `$${formatCurrency(product?.price || 0)}`
    };
}

export function parseRatingValue(product) {
    const match = product?.rating?.stars?.match(/rating-(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : 0;
}//done

export function isOnSale(product) {
    return Boolean(product?.onSale);
}//done

export function isInStock(product) {
    return Boolean(product?.inStock);
}//done

export function getColorValue(color = '') {
    const map = {
        black: '#000000',
        white: '#ffffff',
        blue: '#1e88e5',
        gray: '#6c757d',
        brown: '#8d6e63',
        silver: '#c0c0c0',
        green: '#4caf50',
        yellow: '#fdd835',
        red: '#e53935'
    };

    return map[String(color).toLowerCase()] || String(color).toLowerCase();
} //done
