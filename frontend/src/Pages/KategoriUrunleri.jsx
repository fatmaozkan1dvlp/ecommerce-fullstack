import { useState, useEffect,useRef } from 'react';
import { Link,useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'
import api, { getImageUrl } from '../api';
import { ShoppingBag, Heart, ArrowDownUp, ChevronDown, Plus, CheckCircle2 } from 'lucide-react';
import UserLayout from './UserLayout';

const KategoriUrunleri = () => {
    const { slug } = useParams();
    const [urunler, setUrunler] = useState([]);
    const [kategoriAd, setKategoriAd] = useState('');
    const [yukleniyor, setYukleniyor] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12);
    const [open, setOpen] = useState(false);
    const [favoriler, setFavoriler] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: "" });
    const [sirala, setSirala] = useState("onerilen");
    const dropdownRef = useRef();

    const showMessage = (msg) => {
        setNotification({ show: true, message: msg });
        setTimeout(() => {
            setNotification({ show: false, message: "" });
        }, 4000);
    };


    const fetchFavoriler = async () => {
        const token = localStorage.getItem("token");

        if (!token) return; 

        try {
            const res = await api.get("/Favoriler");
            setFavoriler(res.data.map(f => f.urunId));
        } catch (err) {
            console.error(err);
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

            showMessage(
                isAdding
                    ? "Ürün favorilerinize eklendi"
                    : "Favorilerden çıkarıldı"
            );

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchVeri = async () => {
            if (!slug) return;

            setYukleniyor(true);
            try {
                const res = await api.get(`/Urunler/kategori/slug/${slug}`);

                const gelenVeri = Array.isArray(res.data) ? res.data : [];
                setUrunler(gelenVeri);

                if (gelenVeri.length > 0) {
                    const ilkUrun = gelenVeri[0];
                    setKategoriAd(ilkUrun?.kategoriAd || ilkUrun?.KategoriAd || "");
                }
            } catch (error) {
                console.error("Veriler çekilemedi:", error);
                setUrunler([]);
            } finally {
                setYukleniyor(false);
            }
        };

        fetchVeri();
        fetchFavoriler();

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, [slug]);

    const loadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    const currentUrunler = [...urunler]
        .sort((a, b) => {
            const stokA = a.stok ?? a.Stok ?? 0;
            const stokB = b.stok ?? b.Stok ?? 0;

            if (stokA === 0 && stokB > 0) return 1;
            if (stokB === 0 && stokA > 0) return -1;

            switch (sirala) {
                case "artan":
                    return (a.fiyat ?? a.Fiyat ?? 0) - (b.fiyat ?? b.Fiyat ?? 0);

                case "azalan":
                    return (b.fiyat ?? b.Fiyat ?? 0) - (a.fiyat ?? a.Fiyat ?? 0);

                case "yeniler":
                    return new Date(b.olusturmaTarihi ?? b.OlusturmaTarihi) - new Date(a.olusturmaTarihi ?? a.OlusturmaTarihi);

                default:
                    return 0;
            }
        })
        .slice(0, visibleCount);

    return (
        <UserLayout> 
            <Helmet>
                <title> DECO.STUDIO</title>
            </Helmet>
            <div
                className={`fixed top-10 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 transform ${notification.show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="bg-gray-900 dark:bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
                    <CheckCircle2 size={18} className="text-green-400 dark:text-white" />
                    <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
                </div>
            </div>
            <div className="max-w-[1800px] mx-auto px-3 md:px-10 py-6 md:py-12">

                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800 gap-3">

                <div className="mb-8">
                    <h2 className="text-xl md:text-3xl font-light dark:text-white italic text-gray-900">
                        {kategoriAd || "Ürünler"}
                    </h2>
                </div>
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800 gap-3">
                    <div className="flex items-center gap-3">

                        <span className="hidden sm:inline text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {urunler.length} Ürün
                        </span>
                    </div>

                        <div ref={dropdownRef} className="relative">
                            <button
                                onClick={() => setOpen(prev => !prev)}
                                className="flex items-center gap-4 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:border-amber-600 transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowDownUp size={16} className="text-amber-600" />
                                    <span>
                                        {
                                            {
                                                onerilen: "Önerilen",
                                                artan: "Fiyat ↑",
                                                azalan: "Fiyat ↓",
                                                yeniler: "En Yeniler"
                                            }[sirala]
                                        }
                                    </span>
                                </div>

                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                                />
                            </button>

                            <div
                                className={`absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 transition-all duration-200 z-50
                            ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
                            >
                                {[
                                    { label: 'Önerilen', value: 'onerilen' },
                                    { label: 'Fiyat: Artan', value: 'artan' },
                                    { label: 'Fiyat: Azalan', value: 'azalan' },
                                    { label: 'En Yeniler', value: 'yeniler' }
                                ].map(item => (
                                    <button
                                        key={item.value}
                                        onClick={() => {
                                            setSirala(item.value);
                                            setOpen(false);
                                        }}
                                        className={`w-full text-left text-[10px] px-4 py-2.5 rounded-lg font-bold uppercase transition-colors
                                    ${sirala === item.value
                                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                </div></div>

                {yukleniyor ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-tighter text-sm animate-pulse">Yükleniyor...</p>
                    </div>
                ) : urunler.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
                        {currentUrunler.map((urun) => {
                            const galeri = urun?.galeri || urun?.Galeri;
                            const gosterilecekResim = getImageUrl(galeri?.[0])
                                ?? "https://via.placeholder.com/400x500?text=Resim+Yok";


                            return (
                                <div key={urun?.id || urun?.ID} className="group flex flex-col">
                                    <Link to={`/urun/${urun.slug || urun.id || urun.ID}`} className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#F5F5F5] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5">
                                        <img
                                            src={gosterilecekResim}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            alt={urun?.ad || urun?.Ad}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/400x500?text=Hata";
                                            }}
                                        />
                                        <div >
                                        {/*    <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-amber-600 transition-all active:scale-90 flex items-center justify-center">*/}
                                        {/*        <ShoppingBag size={18} />*/}
                                        {/*    </button>*/}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavori(urun.id || urun.ID);
                                                }}
                                                className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
                                            >
                                                <Heart
                                                    size={18}
                                                    className={
                                                        favoriler.includes(urun.id || urun.ID)
                                                            ? "text-red-500 fill-red-500"
                                                            : "text-gray-400"
                                                    }
                                                />
                                            </button>

                                        </div>
                                        {(urun?.stok === 0 || urun?.Stok === 0) && (
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg">
                                                <span className="text-[8px] font-black text-gray-900 uppercase">Tükendi</span>
                                            </div>
                                        )}

                                    </Link>
                                    <div className="mt-4 flex flex-col space-y-1.5 px-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-amber-600/80">
                                                {urun.kategoriAd || urun.KategoriAd || "DECOSTUDIO"}
                                            </span>
                                            {urun.stok < 5 && urun.stok > 0 && (
                                                <span className="text-[8px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md uppercase">
                                                    Son {urun.stok}
                                                </span>
                                            )}
                                        </div>
                                        <Link to={`/urun/${urun.slug || urun.id || urun.ID}`}>
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors line-clamp-1 italic font-serif">
                                                {urun.ad || urun.Ad}
                                            </h3>
                                        </Link>
                                        <div className="pt-2 flex items-baseline gap-1.5">
                                            <span className="text-lg md:text-xl font-black text-gray-950 dark:text-white tracking-tighter">
                                                ₺{parseFloat(urun.fiyat || urun.Fiyat || 0).toFixed(2).replace('.', ',')}
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                            
                    
                   

                ) : (
                    <div className="text-center py-32 bg-gray-50 dark:bg-gray-900/20 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="max-w-xs mx-auto">
                            <p className="text-gray-400 font-black uppercase italic tracking-tighter text-xl">Bu koleksiyonda henüz parça bulunmuyor.</p>
                            <button
                                onClick={() => window.history.back()}
                                className="mt-6 text-amber-600 font-bold text-sm uppercase tracking-widest hover:underline"
                            >
                                Geri Dön
                            </button>
                        </div>
                    </div>
                )}
                {!yukleniyor && urunler.length > visibleCount && (
                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={loadMore}
                            className="flex items-center gap-3 px-8 py-4 bg-gray-950 dark:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-all active:scale-95 shadow-2xl"
                        >
                            <Plus size={18} />
                            Daha Fazla Gör
                        </button>
                    </div>
                )}
            </div>
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
        </UserLayout>
    );
};

export default KategoriUrunleri;