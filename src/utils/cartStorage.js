// creiamo var per leggere e scrivere il carrello
const CART_KEY = "cart";
// creiamo var per leggere e scrivere la wishlist
const WISHLIST_KEY = "wishlist"

// cart
// lettura carrello
export const getCartFromStorage = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

// scrittura carrello
export const saveCartToStorage = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// wishlist
// lettura wishlist
export const getWishlistFromStorage = () => {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed)) return [];

        return parsed.filter((id) => id != null);
    } catch (e) {
        console.warn("Errore parsing wishlist:", e);
        return [];
    }
};


// srcittura wishlist
export const saveWishlistToStorage = (wishlist) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}