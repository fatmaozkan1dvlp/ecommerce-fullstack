import React from 'react';
import { useCart } from '../context/CartContext';

const Sepet = () => {
    const { cart, removeFromCart } = useCart(); 

    const toplamTutar = cart.reduce((toplam, item) => toplam + (item.fiyat * item.quantity), 0);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Sepetim</h2>
            {cart.length === 0 ? (
                <p>Sepetiniz boş.</p>
            ) : (
                <div>
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between border-b p-2">
                            <span>{item.ad} (x{item.quantity})</span>
                            <span>{item.fiyat * item.quantity} TL</span>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500"
                            >
                                Sil
                            </button>
                        </div>
                    ))}
                    <div className="mt-4 text-xl font-bold">
                        Toplam: {toplamTutar} TL
                    </div>
                    <button className="bg-green-600 text-white p-3 mt-4 w-full">
                        Siparişi Tamamla
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sepet;