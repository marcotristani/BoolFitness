
// permette di usar il carrello in qualsiasi componente
import { createContext, useContext, useState, useEffect } from "react";
import { getCartFromStorage, saveCartToStorage } from "../utils/cartStorage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCartFromStorage());
  }, []);

  // aggiungi al carrello
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exist = prevCart.find((item) => item.id === product.id);

      let updated;

      if (exist) {
        updated = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prevCart, { ...product, quantity: 1 }];
      }

      saveCartToStorage(updated);
      return updated;
    });
  };

  // rimuovi dal carrello
  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveCartToStorage(updated);
      return updated;
    });
  };

  const decreseFromCart = (product) => {
    setCart((prevCart) => {
      const updated = prevCart
        .map((item) => {
          if (item.id === product.id && item.quantity > 0) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        })
        .filter((item) => item.quantity > 0);

      saveCartToStorage(updated);
      return updated;
    });
  };

  // pulizia carrello
  const clearCart = () => {
    setCart([]);
    saveCartToStorage([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, decreseFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);