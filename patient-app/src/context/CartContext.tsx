import React, { createContext, useState, useContext } from 'react';

type CartContextType = {
  cart: any[];
  toggleCart: (item: any) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cart: [],
  toggleCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);

  const toggleCart = (item: any) => {
    const exists = cart.find(t => t.id === item.id);
    if (exists) {
      setCart(cart.filter(t => t.id !== item.id));
    } else {
      setCart([...cart, item]);
    }
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, toggleCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
