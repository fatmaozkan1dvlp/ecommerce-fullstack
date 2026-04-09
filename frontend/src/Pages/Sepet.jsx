import React from 'react';
import { useCart } from '../context/CartContext';
import UserLayout from './UserLayout';

const Sepet = () => {

    const {
        cart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartTotal,
        clearCart
    } = useCart();

    return (
        <UserLayout>
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
                <h2 className="text-3xl font-black mb-8">Sepetim</h2>

                {cart.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-500 text-lg">Sepetiniz boş.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        {item.resimUrl && (
                                            <img
                                                src={item.resimUrl}
                                                alt={item.ad}
                                                className="w-20 h-20 object-cover rounded-2xl border border-gray-100"
                                            />
                                        )}

                                        <div>
                                            <h3 className="text-lg font-bold">{item.ad}</h3>
                                            <p className="text-gray-500 text-sm">
                                                Birim Fiyat: {Number(item.fiyat).toFixed(2)} TL
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-lg"
                                        >
                                            -
                                        </button>

                                        <span className="font-bold text-lg min-w-[30px] text-center">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-lg"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-lg">
                                            {(Number(item.fiyat) * item.quantity).toFixed(2)} TL
                                        </span>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 font-bold hover:underline"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 h-fit sticky top-24">
                            <h3 className="text-xl font-black mb-6">Sipariş Özeti</h3>

                            <div className="flex justify-between mb-4 text-gray-600 dark:text-gray-300">
                                <span>Toplam</span>
                                <span>{cartTotal.toFixed(2)} TL</span>
                            </div>

                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold transition-all">
                                Siparişi Tamamla
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full mt-3 bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-2xl font-bold transition-all"
                            >
                                Sepeti Temizle
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default Sepet;