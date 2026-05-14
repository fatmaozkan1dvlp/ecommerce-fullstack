import { useState, useEffect } from "react";
import { Heart, Loader2, LogIn } from "lucide-react";
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from "react-router-dom";
import api, { getImageUrl, isAuthenticated } from "../api";
import UserLayout from "./UserLayout";
import toast from "react-hot-toast";

const Favoriler = () => {
    const [favoriler, setFavoriler] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const girisYapildi = isAuthenticated();

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
            await api.post("/Favoriler/toggle", { urunId });
            setFavoriler(prev => prev.filter(f => f.urunId !== urunId));
            toast.success("Favorilerden kaldırıldı.");
        } catch (err) {
            console.error(err);
            toast.error("Bir hata oluştu.");
        }
    };

    useEffect(() => {
        if (!girisYapildi) {
            setLoading(false);
            return;
        }
        fetchFavoriler();
    }, [girisYapildi]);

    if (loading) return (
        <UserLayout>
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-600" size={40} />
            </div>
        </UserLayout>
    );

    return (
        <UserLayout>
            <Helmet>
                <title>Favorilerim | DECO.STUDIO</title>
            </Helmet>
            <div className="max-w-[1800px] mx-auto px-3 md:px-10 py-6 md:py-12 min-h-[70vh]">

                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl md:text-3xl font-light dark:text-white italic text-gray-700">
                        Favorilerim
                    </h1>
                    {girisYapildi && (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {favoriler.length} Ürün
                        </span>
                    )}
                </div>

                {!girisYapildi ? (
                    <div className="flex flex-col items-center justify-center text-center py-24 space-y-6">
                        <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center">
                            <Heart size={40} className="text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Favorilerinizi Görüntüleyin</h2>
                        <p className="text-gray-400 max-w-sm text-sm font-medium">
                            Beğendiğiniz ürünleri kaydetmek için giriş yapmanız gerekiyor.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/giris"
                                className="flex items-center gap-2 px-8 py-3.5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all shadow-lg"
                            >
                                <LogIn size={16} /> Giriş Yap
                            </Link>
                            <Link
                                to="/kayit"
                                className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:border-amber-600 hover:text-amber-600 transition-all"
                            >
                                Kayıt Ol
                            </Link>
                        </div>
                        <Link to="/" className="text-[11px] text-gray-400 hover:text-amber-600 font-bold uppercase tracking-widest transition-colors">
                            Alışverişe Devam Et →
                        </Link>
                    </div>


                ) : favoriler.length === 0 ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative mb-2">
                            <Heart size={80} className="text-gray-100 dark:text-gray-800 fill-current" />
                            <Heart size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Listeniz Henüz Boş</h2>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto italic">
                            Beğendiğiniz ürünleri buraya ekleyerek daha sonra kolayca bulabilirsiniz.
                        </p>
                        <Link
                            to="/"
                            className="px-8 py-3.5 bg-gray-950 dark:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all shadow-lg"
                        >
                            Alışverişe Başla
                        </Link>
                    </div>

                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
                        {favoriler.map((f) => {
                            const resimUrl = getImageUrl(f.gorsel)
                                ?? "https://via.placeholder.com/600x800?text=Gorsel+Yok";

                            return (
                                <div key={f.id} className="group flex flex-col">
                                    <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#F5F5F5] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5">
                                        <img
                                            src={resimUrl}
                                            alt={f.urunAd}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/600x800?text=Hata"; }}
                                        />

                                        <button
                                            onClick={() => removeFavori(f.urunId)}
                                            className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition active:scale-90"
                                        >
                                            <Heart size={18} className="text-red-500 fill-red-500" />
                                        </button>

                                        <button
                                            onClick={() => navigate(`/urun/${f.slug || f.urunId}`)}
                                            className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col space-y-1.5 px-1">
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-amber-600/80">
                                            {f.kategoriAd || "DECOSTUDIO"}
                                        </span>
                                        <h3
                                            className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors line-clamp-1 italic font-serif cursor-pointer"
                                            onClick={() => navigate(`/urun/${f.slug || f.urunId}`)}
                                        >
                                            {f.urunAd}
                                        </h3>
                                        <div className="pt-2">
                                            <span className="text-lg md:text-xl font-black text-gray-950 dark:text-white tracking-tighter">
                                                ₺{parseFloat(f.fiyat || 0).toFixed(2).replace('.', ',')}
                                            </span>
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