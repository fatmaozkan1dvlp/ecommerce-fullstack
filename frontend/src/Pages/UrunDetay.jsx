import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShoppingCart, ArrowLeft, Plus, Minus,
    ShieldCheck, Truck, Loader2
} from 'lucide-react';
import api, { IMG_URL } from '../api';
import { useCart } from '../context/CartContext';
import UserLayout from './UserLayout';

const UrunDetay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [urun, setUrun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [adet, setAdet] = useState(1);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        const fetchUrun = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/Urunler/${id}`);
                setUrun(res.data);
            } catch (err) {
                console.error("Ürün yüklenemedi", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUrun();
    }, [id]);

    const sepeteEkle = () => {
        if (!urun) return;

        const sepettekiUrun = cart.find(item => item.id === urun.id);
        const mevcutSepetAdedi = sepettekiUrun ? sepettekiUrun.quantity : 0;

        // seçilen adet + sepetteki adet > stok ise engelle
        if (mevcutSepetAdedi + adet > urun.stok) {
            alert(`Bu üründen en fazla ${urun.stok} adet ekleyebilirsiniz.`);
            return;
        }

        const anaResim =
            urun.resimler?.length > 0
                ? `${IMG_URL}${urun.resimler[0].url.startsWith('/') ? '' : '/'}${urun.resimler[0].url}`
                : "";

        addToCart(
            {
                id: urun.id,
                ad: urun.ad,
                fiyat: urun.fiyat,
                resimUrl: anaResim
            },
            adet
        );

        alert("Ürün sepete eklendi!");
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
            <Loader2 className="animate-spin text-amber-600" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Yükleniyor</p>
        </div>
    );

    if (!urun) return <div className="text-center py-20 font-bold">Ürün bulunamadı.</div>;

    return (
        <UserLayout>
            <div className="bg-[#F8F9FA] min-h-screen pt-8 pb-16 md:pt-12 md:pb-24 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2.5 text-gray-400 hover:text-gray-950 transition-colors mb-10 group"
                    >
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-amber-200 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Geri</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        <div className="lg:col-span-5 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-5">
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                                <img
                                    src={urun.resimler?.length > 0
                                        ? `${IMG_URL}${urun.resimler[activeImage].url.startsWith('/') ? '' : '/'}${urun.resimler[activeImage].url}`
                                        : "https://via.placeholder.com/800x800?text=Gorsel+Yok"}
                                    className="w-full h-full object-cover transition-all duration-500"
                                    alt={urun.ad}
                                />
                                {urun.stok <= 0 && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                                        <span className="px-6 py-2.5 bg-gray-950 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full shadow-lg">Tükendi</span>
                                    </div>
                                )}
                            </div>

                            {urun.resimler?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                                    {urun.resimler.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === index
                                                    ? 'border-amber-600 scale-95 shadow-lg'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={`${IMG_URL}${img.url.startsWith('/') ? '' : '/'}${img.url}`}
                                                className="w-full h-full object-cover"
                                                alt={`Görsel ${index + 1}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-full">
                            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/50">
                                    {urun.kategoriAd || "Özel Tasarım"}
                                </span>
                                <div className="h-4 w-px bg-gray-100"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SKU: #00{urun.id}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-gray-950 leading-tight mb-5 tracking-tight font-serif italic">
                                {urun.ad}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter">
                                    ₺{(urun.fiyat)?.toLocaleString('tr-TR')}
                                </span>
                                {urun.stok > 0 && urun.stok < 5 && (
                                    <span className="text-xs font-bold text-red-500 animate-pulse uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-md">
                                        Son {urun.stok} Ürün!
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 font-medium max-w-xl">
                                {urun.aciklama || "Bu ürün, DecoStudio'nun zanaatkar ellerinde özel işçilikle hazırlanmıştır."}
                            </p>

                            <div className="mt-auto space-y-6 pt-8 border-t border-gray-100/70 border-dashed">
                                <div className="flex flex-col sm:flex-row gap-4">

                                    <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 w-full sm:w-fit border border-gray-100 shadow-inner">
                                        <button
                                            onClick={() => adet > 1 && setAdet(adet - 1)}
                                            className="w-11 h-11 flex items-center justify-center hover:bg-white hover:shadow rounded-xl transition-all"
                                        >
                                            <Minus size={14} />
                                        </button>

                                        <span className="w-12 text-center font-black text-base text-gray-950">
                                            {adet}
                                        </span>

                                        <button
                                            onClick={() => {
                                                if (adet < urun.stok) {
                                                    setAdet(adet + 1);
                                                }
                                            }}
                                            className="w-11 h-11 flex items-center justify-center hover:bg-white hover:shadow rounded-xl transition-all disabled:opacity-50"
                                            disabled={adet >= urun.stok}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        disabled={urun.stok <= 0}
                                        onClick={sepeteEkle}
                                        className="flex-1 bg-gray-950 text-white h-14 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-3.5 hover:bg-amber-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-xl shadow-gray-100"
                                    >
                                        <ShoppingCart size={18} />
                                        {urun.stok <= 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Stok: <span className="font-bold text-gray-900">{urun.stok}</span>
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center gap-3.5 shadow-inner">
                                        <Truck className="text-amber-600 flex-shrink-0" size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-800 leading-none">Hızlı Kargo</span>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center gap-3.5 shadow-inner">
                                        <ShieldCheck className="text-green-600 flex-shrink-0" size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-800 leading-none">Garantili</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default UrunDetay;