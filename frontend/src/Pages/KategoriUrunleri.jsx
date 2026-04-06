import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api, { IMG_URL } from '../api';
import { ShoppingBag, Heart, ArrowDownUp, ChevronDown } from 'lucide-react';
import UserLayout from './UserLayout';

const KategoriUrunleri = () => {
    const { id } = useParams();
    const [urunler, setUrunler] = useState([]);
    const [kategoriAd, setKategoriAd] = useState('');
    const [yukleniyor, setYukleniyor] = useState(true);

    useEffect(() => {
        const fetchVeri = async () => {
            if (!id) return;

            setYukleniyor(true);
            try {
                const res = await api.get(`/Urunler/Kategori/${id}`);

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
    }, [id]);

    return (
        <UserLayout> 
            <div className="max-w-[1800px] mx-auto px-3 md:px-10 py-6 md:py-12">

                

                <div className="mb-8">
                    <h2 className="text-4xl font-black uppercase italic mt-2 text-gray-900">
                        {kategoriAd || "Ürünler"}
                    </h2>
                </div>
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

                {yukleniyor ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-tighter text-sm animate-pulse">Yükleniyor...</p>
                    </div>
                ) : urunler.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
                        {urunler.map((urun) => {
                            let gosterilecekResim = "https://via.placeholder.com/400x500?text=Resim+Yok";
                            const galeri = urun?.galeri || urun?.Galeri;

                            if (galeri && galeri.length > 0) {
                                const path = galeri[0];
                                const cleanPath = path.startsWith('/') ? path : `/${path}`;
                                gosterilecekResim = `${IMG_URL}${cleanPath}`;
                            }

                            return (
                                <div key={urun?.id || urun?.ID} className="group flex flex-col">
                                    <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#F5F5F5] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5">
                                        <img
                                            src={gosterilecekResim}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            alt={urun?.ad || urun?.Ad}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/400x500?text=Hata";
                                            }}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-2">
                                            <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-amber-600 transition-all active:scale-90 flex items-center justify-center">
                                                <ShoppingBag size={18} />
                                            </button>
                                            <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-red-500 transition-all active:scale-90 flex items-center justify-center">
                                                <Heart size={18} />
                                            </button>

                                            
                                        </div>
                                        {(urun?.stok === 0 || urun?.Stok === 0) && (
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg">
                                                <span className="text-[8px] font-black text-gray-900 uppercase">Tükendi</span>
                                            </div>
                                        )}

                                    </div>
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

                                        <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors line-clamp-1 italic font-serif">
                                            {urun.ad || urun.Ad}
                                        </h3>

                                        <div className="pt-2 flex items-baseline gap-1.5">
                                            <span className="text-lg md:text-xl font-black text-gray-950 dark:text-white tracking-tighter">
                                                ₺{urun.fiyat?.toLocaleString('tr-TR')}
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
            </div>
        </UserLayout>
    );
};

export default KategoriUrunleri;