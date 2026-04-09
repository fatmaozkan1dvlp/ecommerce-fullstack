import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

const getCurrentUser = () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    try {
        return JSON.parse(savedUser);
    } catch {
        return null;
    }
};

const getCartKey = () => {
    const user = getCurrentUser();
    const userId = user?.id || user?.ID;

    if (userId) {
        return `cart_user_${userId}`;
    }

    return "guest_cart";
};

export const CartProvider = ({ children }) => {
    const [cartKey, setCartKey] = useState(getCartKey());
    const [cart, setCart] = useState(() => {
        const key = getCartKey();
        const savedCart = localStorage.getItem(key);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }, [cart, cartKey]);

    const refreshCart = () => {
        const newKey = getCartKey();
        setCartKey(newKey);

        const savedCart = localStorage.getItem(newKey);
        setCart(savedCart ? JSON.parse(savedCart) : []);
    };

    const mergeGuestCartToUser = () => {
        const user = getCurrentUser();
        const userId = user?.id || user?.ID;

        if (!userId) return;

        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
        const userCartKey = `cart_user_${userId}`;
        const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

        const mergedCart = [...userCart];

        guestCart.forEach((guestItem) => {
            const existing = mergedCart.find((item) => item.id === guestItem.id);

            if (existing) {
                existing.quantity += guestItem.quantity;
            } else {
                mergedCart.push(guestItem);
            }
        });

        localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
        localStorage.removeItem("guest_cart");

        setCartKey(userCartKey);
        setCart(mergedCart);
    };

    const addToCart = (urun, adet = 1) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === urun.id);

            if (existing) {
                return prevCart.map((item) =>
                    item.id === urun.id
                        ? { ...item, quantity: item.quantity + adet }
                        : item
                );
            }

            return [...prevCart, { ...urun, quantity: adet }];
        });
    };
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const increaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = useMemo(() => {
        return cart.reduce((toplam, item) => toplam + item.quantity, 0);
    }, [cart]);

    const cartTotal = useMemo(() => {
        return cart.reduce((toplam, item) => toplam + Number(item.fiyat) * item.quantity, 0);
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                cartCount,
                cartTotal,
                refreshCart,
                mergeGuestCartToUser
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};