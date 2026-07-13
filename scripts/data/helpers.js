// Shared formatting and utility helpers.

export function formatCurrency(priceCents) {
    return ((Number(priceCents) || 0) / 100).toFixed(2);
}

export function formatDate(value = new Date()) {
    return new Date(value).toLocaleString();
}

export function generateUniqueId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function capitalize(value = '') {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
