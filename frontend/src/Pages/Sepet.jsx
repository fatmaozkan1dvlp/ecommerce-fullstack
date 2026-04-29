import React, { useEffect, useState } from "react";
import { Loader2, Plus, Minus, Trash2 } from "lucide-react";
import api, { IMG_URL } from "../api";
import UserLayout from "./UserLayout";

const Sepet = () => {
    const [sepet, setSepet] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSepet = async () => {
        try {
            const res = await api.get("/Sepet");
            setSepet(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sil = async (id) => {
        await api.delete(`/Sepet/sil/${id}`);
        fetchSepet();
    };

    const adetGuncelle = async (item, yeniAdet) => {
        if (yeniAdet < 1) return;

        if (yeniAdet > item.stok) {
            alert(`Maksimum ${item.stok} adet alabilirsiniz`);
            return;
        }

        try {
            await api.put(`/Sepet/guncelle/${item.id}/${yeniAdet}`);
            fetchSepet();
        } catch (err) {
            console.error(err);
            alert("Güncelleme başarısız");
        }
    };

    const toplamFiyat = sepet.reduce(
        (acc, item) => acc + item.fiyat * item.adet,
        0
    );

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        fetchSepet();
    }, []);

    if (loading)
        return <Loader2 className="animate-spin m-auto mt-20" />;

    return (
        <UserLayout>
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ÜRÜNLER */}
                <div className="lg:col-span-2 space-y-4">
                    <h1 className="text-2xl font-bold">Sepetim</h1>

                    {sepet.length === 0 ? (
                        <p>Sepet boş</p>
                    ) : (
                        sepet.map(item => (
                            <div
                                key={item.id}
                                className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border"
                            >
                                <img
                                    src={`${IMG_URL}${item.gorsel}`}
                                    className="w-24 h-24 object-cover rounded-xl"
                                />

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {item.urunAd}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            ₺{item.fiyat}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        {/* ADET */}
                                        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">
                                            <button
                                                disabled={item.adet <= 1}
                                                onClick={() =>
                                                    adetGuncelle(item, item.adet - 1)
                                                }
                                                className="disabled:opacity-50"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span className="font-bold">
                                                {item.adet}
                                            </span>

                                            <button
                                                disabled={item.adet >= item.stok}
                                                onClick={() =>
                                                    adetGuncelle(item, item.adet + 1)
                                                }
                                                className="disabled:opacity-50"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* ALT TOPLAM */}
                                        <div className="font-bold text-gray-900">
                                            ₺{(item.fiyat * item.adet).toLocaleString("tr-TR")}
                                        </div>
                                    </div>
                                </div>

                                {/* SİL */}
                                <button
                                    onClick={() => sil(item.id)}
                                    className="text-red-500 hover:scale-110 transition"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* ÖZET */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-24">
                    <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>

                    <div className="flex justify-between text-sm mb-2">
                        <span>Ürün Sayısı</span>
                        <span>{sepet.length}</span>
                    </div>

                    <div className="flex justify-between text-sm mb-4">
                        <span>Ara Toplam</span>
                        <span>₺{toplamFiyat.toLocaleString("tr-TR")}</span>
                    </div>

                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Toplam</span>
                        <span>₺{toplamFiyat.toLocaleString("tr-TR")}</span>
                    </div>

                    <button className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition">
                        Ödeme Yap
                    </button>
                </div>
            </div>
        </UserLayout>
    );
};

export default Sepet;