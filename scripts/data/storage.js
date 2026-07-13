// Shared localStorage helpers for simple data persistence.

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
} //done

export function loadFromStorage(key, fallback = null) {
    const savedValue = localStorage.getItem(key);

    if (!savedValue) {
        return fallback;
    }

    try {
        return JSON.parse(savedValue);
    } catch (error) {
        console.error(`Could not read ${key}:`, error);
        return fallback;
    }
} //done
