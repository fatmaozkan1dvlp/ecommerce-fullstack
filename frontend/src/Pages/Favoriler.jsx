import React, { useEffect, useState } from "react";
import { Heart, Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api, { IMG_URL } from "../api";
import UserLayout from "./UserLayout";

const Favoriler = () => {
    const [favoriler, setFavoriler] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ show: false, message: "" });

    const showMessage = (msg) => {
        setNotification({ show: true, message: msg });

        setTimeout(() => {
            setNotification({ show: false, message: "" });
        }, 4000);
    };

    const fetchFavoriler = async () => {
        try {
            setLoading(true);
            const res = await api.get("/Favoriler");
            setFavoriler(res.data);
        } catch (err) {
            console.error("Favoriler yüklenirken hata:", err);
        } finally {
            setLoading(false);
        }
    };

    const removeFavori = async (urunId) => {
        try {
            await api.post("/Favoriler/ekle-cikar", { urunId });

            setFavoriler(prev => prev.filter(f => f.urunId !== urunId));

            showMessage("Ürün favorilerden kaldırıldı");

        } catch (err) {
            console.error("Favori işlemi başarısız:", err);
            showMessage("Bir hata oluştu");
        }
    };

    useEffect(() => {
        fetchFavoriler();
    }, []);

    return (
        <UserLayout>
            <div
                className={`fixed top-10 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 transform ${notification.show
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-20 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                    <Heart size={18} className="text-red-400" />
                    <span className="text-xs font-black uppercase tracking-widest">
                        {notification.message}
                    </span>
                </div>
            </div>
            <div className="max-w-[1800px] mx-auto px-3 md:px-10 py-6 md:py-12 min-h-screen">
                {/* Başlık Alanı */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl md:text-3xl font-light dark:text-white italic text-gray-700">
                            Favorilerim
                        </h1>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {favoriler.length} Ürün
                    </span>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-amber-600" size={48} strokeWidth={1} />
                        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[9px]">Yükleniyor</p>
                    </div>
                ) : favoriler.length === 0 ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="relative mb-6">
                            <Heart size={80} className="text-gray-100 dark:text-gray-800 fill-current" />
                            <Heart size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Listeniz Henüz Boş</h2>
                        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto italic">
                            Beğendiğiniz ürünleri buraya ekleyerek daha sonra kolayca bulabilirsiniz.
                        </p>
                        <Link
                            to="/"
                            className="px-8 py-3 bg-gray-950 dark:bg-amber-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                        >
                            Alışverişe Başla
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
                        {favoriler.map((f) => {
                            const cleanPath = f.gorsel?.startsWith('/') ? f.gorsel : `/${f.gorsel}`;
                            const resimUrl = f.gorsel ? `${IMG_URL}${cleanPath}` : "https://via.placeholder.com/600x800?text=Gorsel+Yok";

                            return (
                                <div key={f.id} className="group flex flex-col">
                                    <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#F5F5F5] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5">
                                        <img
                                            src={resimUrl}
                                            alt={f.urunAd}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />

                                        {/* Favoriden Kaldır Butonu */}
                                        <button
                                            onClick={() => removeFavori(f.urunId)}
                                            className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition active:scale-90"
                                        >
                                            <Heart size={18} className="text-red-500 fill-red-500" />
                                        </button>

                                        {/* Ürüne Git Overlay (Opsiyonel) */}
                                        <button
                                            onClick={() => navigate(`/urun/${f.urunId}`)}
                                            className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col space-y-1.5 px-1">
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-amber-600/80">
                                            {f.kategoriAd || "DECOSTUDIO"}
                                        </span>

                                        <h3
                                            className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors line-clamp-1 italic font-serif cursor-pointer"
                                            onClick={() => navigate(`/urun/${f.urunId}`)}
                                        >
                                            {f.urunAd}
                                        </h3>

                                        <div className="pt-2 flex items-center justify-between">
                                            <span className="text-lg md:text-xl font-black text-gray-950 dark:text-white tracking-tighter">
                                                ₺{parseFloat(f.fiyat || 0).toFixed(2).replace('.', ',')}
                                            </span>
                                            {/*<button*/}
                                            {/*    onClick={() => navigate(`/urun/${f.urunId}`)}*/}
                                            {/*    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-amber-600 hover:text-white transition-colors"*/}
                                            {/*>*/}
                                            {/*    <ShoppingBag size={16} />*/}
                                            {/*</button>*/}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default Favoriler;