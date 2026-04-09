import { useState, useEffect } from 'react';
import { ListFilter, ArrowDownUp, ChevronDown, ShoppingBag, Heart, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserLayout from './UserLayout';
import api, { IMG_URL } from '../api';

const Home = () => {
    const [urunler, setUrunler] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sayfalama yerine "Görünür Ürün Sayısı" mantığına geçtik
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const fetchUrunler = async () => {
            try {
                setLoading(true);
                const response = await api.get('/Urunler');
                setUrunler(response.data);
            } catch (error) {
                console.error("Ürünler yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUrunler();
    }, []);

   

    // Daha fazla ürün gösteren fonksiyon
    const loadMore = () => {
        setVisibleCount(prev => prev + 12); // Her tıklandığında 12 ürün daha ekler
    };

    // Şu an gösterilecek ürünler (0'dan görünür sayıya kadar kesiyoruz)
    const currentUrunler = urunler.slice(0, visibleCount);

    return (
        <UserLayout>
            <div className="max-w-[1800px] mx-auto px-3 md:px-10 py-6 md:py-12">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800 gap-3">
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {urunler.length} Ürün
                        </span>
                    </div>

                    <div className="relative group">
                        <button className="flex items-center gap-4 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:border-amber-600 transition-all active:scale-95">
                            <div className="flex items-center gap-2">
                                <ArrowDownUp size={16} className="text-amber-600" />
                                <span>Sıralama</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
                            {['Önerilen', 'Fiyat: Artan', 'Fiyat: Azalan', 'En Yeniler'].map(item => (
                                <button key={item} className="w-full text-left text-[10px] px-4 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 text-gray-600 dark:text-gray-300 font-bold transition-colors uppercase">{item}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-amber-600" size={48} strokeWidth={1} />
                        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[9px]">Yükleniyor</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
                        {currentUrunler.map((u) => {
                            let resimUrl = "https://via.placeholder.com/600x800?text=Gorsel+Yok";
                            if (u.galeri?.length > 0) {
                                const cleanPath = u.galeri[0].startsWith('/') ? u.galeri[0] : `/${u.galeri[0]}`;
                                resimUrl = `${IMG_URL}${cleanPath}`;
                            }

                            return (
                                <div key={u.id || u.ID} className="group flex flex-col">
                                    <Link to={`/urun/${u.id || u.ID}`} className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#F5F5F5] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5">
                                        <img
                                            src={resimUrl}
                                            alt={u.ad || u.Ad}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/600x800?text=Hata"; }}
                                        />
                                        
                                        {/*<div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-2">*/}
                                        {/*    <button onClick={() => addToCart(u)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-amber-600 transition-all active:scale-90 flex items-center justify-center">*/}
                                        {/*        <ShoppingBag size={18} />*/}
                                        {/*    </button>*/}
                                        {/*    <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-red-500 transition-all active:scale-90 flex items-center justify-center">*/}
                                        {/*        <Heart size={18} />*/}
                                        {/*    </button>*/}
                                        {/*</div>*/}
                                        
                                        {u.stok <= 0 && (
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg">
                                                <span className="text-[8px] font-black text-gray-900 uppercase">Tükendi</span>
                                            </div>
                                        )}
                                    </Link>

                                    <div className="mt-4 flex flex-col space-y-1.5 px-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-amber-600/80">
                                                {u.kategoriAd || u.KategoriAd || "DECOSTUDIO"}
                                            </span>
                                            {u.stok < 5 && u.stok > 0 && (
                                                <span className="text-[8px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md uppercase">
                                                    Son {u.stok}
                                                </span>
                                            )}
                                        </div>
                                        <Link to={`/urun/${u.id || u.ID}`}>
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors line-clamp-1 italic font-serif">
                                                {u.ad || u.Ad}
                                            </h3>
                                        </Link>

                                        <div className="pt-2 flex items-baseline gap-1.5">
                                            <span className="text-lg md:text-xl font-black text-gray-950 dark:text-white tracking-tighter">
                                                ₺{parseFloat(u.fiyat || u.Fiyat || 0).toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* YENİ: DAHA FAZLA GÖR BUTONU */}
                {!loading && urunler.length > visibleCount && (
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

export default Home;