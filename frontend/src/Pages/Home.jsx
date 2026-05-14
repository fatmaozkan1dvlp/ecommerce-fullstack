import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'
import { ArrowDownUp, ChevronDown, Heart, Loader2, Plus, CheckCircle2, SearchX } from 'lucide-react';
import UserLayout from './UserLayout';
import api, { getImageUrl } from '../api';

const Home = () => {

    const [urunler, setUrunler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);
    const [open, setOpen] = useState(false);
    const [favoriler, setFavoriler] = useState([]);
    const [sirala, setSirala] = useState("onerilen");
    const [notification, setNotification] = useState({ show: false, message: "" });
    const dropdownRef = useRef();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search")?.toLowerCase() || "";

    const showMessage = (msg) => {
        setNotification({ show: true, message: msg });
        setTimeout(() => {
            setNotification({ show: false, message: "" });
        }, 3000);
    };

    const fetchFavoriler = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await api.get("/Favoriler");
            setFavoriler(res.data.map(f => f.urunId));
        } catch (err) {
            console.error("Favoriler çekilemedi:", err);
        }
    };

    const toggleFavori = async (urunId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            showMessage("Favorilere eklemek için giriş yapmalısınız");
            return;
        }
        try {
            await api.post("/Favoriler/toggle", { urunId });
            const isAdding = !favoriler.includes(urunId);
            setFavoriler(prev =>
                prev.includes(urunId)
                    ? prev.filter(id => id !== urunId)
                    : [...prev, urunId]
            );
            showMessage(isAdding ? "Ürün favorilere eklendi" : "Favorilerden kaldırıldı");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchUrunler = async () => {
            try {
                setLoading(true);
                const response = await api.get('/Urunler');
                setUrunler(response.data);
            } catch (error) {
                console.error("Ürünler yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUrunler();
        if (localStorage.getItem("token")) fetchFavoriler();

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadMore = () => setVisibleCount(prev => prev + 12);

    const filteredUrunler = urunler.filter(u => {
        const search = searchTerm.trim().toLowerCase();

        const ad = (u.ad || u.Ad || "").toLowerCase();
        const kategori = (u.kategoriAd || u.KategoriAd || "").toLowerCase();

        if (!search) return true;

        return ad.includes(search) || kategori.includes(search);
    });

    const currentUrunler = [...filteredUrunler]
        .sort((a, b) => {
            const fiyatA = a.fiyat ?? a.Fiyat ?? 0;
            const fiyatB = b.fiyat ?? b.Fiyat ?? 0;

            if (sirala === "artan") return fiyatA - fiyatB;
            if (sirala === "azalan") return fiyatB - fiyatA;
            if (sirala === "yeniler") return new Date(b.olusturmaTarihi || b.OlusturmaTarihi) - new Date(a.olusturmaTarihi || a.OlusturmaTarihi);
            return 0;
        })
        .slice(0, visibleCount);

    return (
        <UserLayout>
            <Helmet>
                <title>DECO.STUDIO </title>
                <meta name="description" content="Özel tasarım dekorasyon ürünleri." />
            </Helmet>
            {/* Bildirim Bannerı */}
            <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 transform ${notification.show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"}`}>
                <div className="bg-gray-900 dark:bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
                    <CheckCircle2 size={18} className="text-green-400 dark:text-white" />
                    <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-3 md:px-10 py-6 md:py-12">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800 gap-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {searchTerm ? `"${searchTerm}" Sonuçları (${filteredUrunler.length})` : `${urunler.length} Ürün Listeleniyor`}
                    </span>

                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-4 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:border-amber-600 transition-all active:scale-95"
                        >
                            <ArrowDownUp size={16} className="text-amber-600" />
                            <span>{sirala === "onerilen" ? "Önerilen" : sirala === "artan" ? "Fiyat: Artan" : sirala === "azalan" ? "Fiyat: Azalan" : "En Yeniler"}</span>
                            <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>

                        <div className={`absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 transition-all z-50 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                            {[
                                { label: 'Önerilen', value: 'onerilen' },
                                { label: 'Fiyat: Artan', value: 'artan' },
                                { label: 'Fiyat: Azalan', value: 'azalan' },
                                { label: 'En Yeniler', value: 'yeniler' }
                            ].map(item => (
                                <button
                                    key={item.value}
                                    onClick={() => { setSirala(item.value); setOpen(false); }}
                                    className={`w-full text-left text-[10px] px-4 py-2.5 rounded-lg font-bold uppercase ${sirala === item.value ? "bg-amber-100 text-amber-700" : "hover:bg-amber-50 dark:text-gray-300"}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
                        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Yükleniyor...</p>
                    </div>
                ) : filteredUrunler.length === 0 ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center">
                        <SearchX size={64} className="text-gray-300 mb-4" />
                        <p className="text-gray-400 text-[11px] font-black uppercase">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {currentUrunler.map((u) => {
                            let resimUrl = "https://via.placeholder.com/600x800";
                            if (u.galeri?.length > 0) {
                                resimUrl = getImageUrl(u.galeri?.[0])
                                    ?? "https://via.placeholder.com/600x800?text=Gorsel+Yok";;
                            }
                            return (
                                <div key={u.id || u.ID} className="group flex flex-col">
                                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group-hover:shadow-xl transition-all duration-500">
                                        <Link to={`/urun/${u.slug || u.id || u.ID}`}>
                                            <img src={resimUrl} alt={u.ad} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </Link>
                                        <button
                                            onClick={() => toggleFavori(u.id || u.ID)}
                                            className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition"
                                        >
                                            <Heart size={18} className={favoriler.includes(u.id || u.ID) ? "text-red-500 fill-red-500" : "text-gray-400"} />
                                        </button>
                                        {(u.stok <= 0 || u.Stok <= 0) && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                                                <span className="text-[8px] font-black uppercase">Tükendi</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 px-1">
                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{u.kategoriAd || "DECO"}</span>
                                        <Link to={`/urun/${u.slug || u.id || u.ID}`}>
                                            <h3 className="text-sm md:text-base font-serif italic font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-amber-600 transition-colors">{u.ad || u.Ad}</h3>
                                        </Link>
                                        <p className="text-lg font-black tracking-tighter mt-1">₺{parseFloat(u.fiyat || u.Fiyat || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredUrunler.length > visibleCount && (
                    <div className="mt-16 flex justify-center">
                        <button onClick={loadMore} className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-600 transition-all">
                            <Plus size={18} /> Daha Fazla Gör
                        </button>
                    </div>
                )}
            </div>
            {!searchTerm && (
                <section className="py-16 md:py-32 bg-[#FBFBFB] dark:bg-gray-900/80 overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-[0.02] whitespace-nowrap text-[10rem] md:text-[20rem] font-black select-none pointer-events-none">
                        DECOSTUDIO
                    </div>
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] text-amber-600 mb-6 block">Zanaatın Dijital Sanatı</span>
                        <h2 className="text-3xl md:text-6xl font-light leading-tight mb-8 dark:text-white">
                            Eviniz, Sizin <span className="italic font-serif">Kişisel</span> <br />
                            <span className="font-bold">Müzenizdir.</span>
                        </h2>
                        <div className="w-16 h-0.5 bg-amber-600 mx-auto mb-8 rounded-full"></div>
                        <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto font-medium italic">
                            "Evinizi Güzelleştirin"
                        </p>
                    </div>
                </section>
            )}
        </UserLayout>
    );
};

export default Home;