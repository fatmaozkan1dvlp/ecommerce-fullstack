import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api, { IMG_URL } from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, Edit, Package, Layers, Image as ImageIcon, Search, Archive } from 'lucide-react';

const Urunler = () => {
    const [urunler, setUrunler] = useState(null);
    const [kategoriler, setKategoriler] = useState([]);
    const [seciliKategoriId, setSeciliKategoriId] = useState(null);

    const [aramaMetni, setAramaMetni] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const urunSil = async (id) => {
        const onay = window.confirm("Bu ürün kalıcı olarak silinecek. Emin misiniz?");
        if (!onay) return;

        try {
            await api.delete(`/Urunler/kalici-sil/${id}`);
            setUrunler(prev => prev.filter(u => Number(u.id || u.ID) !== Number(id)));
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const arsivOnay = window.confirm("Bu ürün geçmiş siparişlerde bulunduğu için silinemez. Arşivlensin mi?");
                if (!arsivOnay) return;
                try {
                    await api.put(`/Urunler/arsivle/${id}`);
                    setUrunler(prev => prev.filter(u => Number(u.id || u.ID) !== Number(id)));
                } catch (arsivHata) {
                    console.error("Arşivleme hatası:", arsivHata);
                }
            } else {
                console.error("Silme hatası:", error);
            }
        }
    };

    const urunArsivle = async (id) => {
        const onay = window.confirm("Bu ürün satıştan kaldırılacak ve arşive taşınacak. Onaylıyor musunuz?");
        if (!onay) return;

        try {
            await api.put(`/Urunler/arsivle/${id}`);
            setUrunler(prev => prev.filter(u => Number(u.id || u.ID) !== Number(id)));
            alert("Ürün başarıyla arşivlendi.");
        } catch (error) {
            console.error("Arşivleme hatası:", error);
            alert("Ürün arşivlenirken bir hata oluştu.");
        }
    };

    useEffect(() => {
        const verileriGetir = async () => {
            try {
                setUrunler(null);

                const url = (seciliKategoriId && seciliKategoriId !== null)
                    ? `/Urunler/Kategori/${seciliKategoriId}`
                    : "/Urunler";

                const [urunRes, katRes] = await Promise.all([
                    api.get(url),
                    api.get("/Kategoriler")
                ]);

                setUrunler(urunRes.data);
                setKategoriler(katRes.data);
            } catch (err) {
                console.error("Veri çekme hatası:", err);
                setUrunler([]);
            }
        };
        verileriGetir();
    }, [seciliKategoriId, location.key]);

    const filtreliUrunler = useMemo(() => {
        if (!urunler || !Array.isArray(urunler)) return [];
        let sonuc = [...urunler];

        if (aramaMetni) {
            sonuc = sonuc.filter(u =>
                (u?.ad || u?.Ad || "").toLowerCase().includes(aramaMetni.toLowerCase())
            );
        }

        return sonuc.sort((a, b) => {
            // Stok değerlerini güvenli al (büyük/küçük harf duyarlılığı için)
            const stokA = a?.stok ?? a?.Stok ?? 0;
            const stokB = b?.stok ?? b?.Stok ?? 0;

            if (stokA > 0 && stokB === 0) return -1;
            if (stokA === 0 && stokB > 0) return 1;
            return 0;
        });
    }, [urunler, aramaMetni]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                            <Package className="text-blue-600" size={28} /> Ürün Yönetimi
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {urunler === null ? "Hesaplanıyor..." : `Toplam ${filtreliUrunler.length} ürün listeleniyor`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/urun-ekle")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm"
                    >
                        + Yeni Ürün Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-2 flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-900/40 p-3 rounded-2xl border dark:border-gray-800">
                        <Layers size={18} className="text-gray-400 mx-2" />
                        <button
                            onClick={() => setSeciliKategoriId(null)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wider transition-all ${seciliKategoriId == null ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border dark:border-gray-700'}`}
                        >
                            HEPSİ
                        </button>
                        {kategoriler.map(k => (
                            <button
                                key={k.id || k.ID}
                                onClick={() => setSeciliKategoriId(k.id || k.ID)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wider transition-all ${seciliKategoriId === (k.id || k.ID) ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border dark:border-gray-700'}`}
                            >
                                {(k.ad || k.Ad).toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Ürün adı ile ara..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                            onChange={(e) => setAramaMetni(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl overflow-hidden border dark:border-gray-700">
                    {urunler === null ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                            <span className="text-gray-400 text-sm font-medium animate-pulse">Katalog hazırlanıyor...</span>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="hidden md:grid grid-cols-12 bg-gray-50/80 dark:bg-gray-900/40 text-gray-400 text-[10px] uppercase tracking-[0.2em] px-8 py-5 font-black border-b dark:border-gray-700">
                                <div className="col-span-5">Ürün Detayı</div>
                                <div className="col-span-2">Kategori</div>
                                <div className="col-span-2 text-center">Stok</div>
                                <div className="col-span-1 text-right">Fiyat</div>
                                <div className="col-span-2 text-center">İşlemler</div>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filtreliUrunler.length > 0 ? (
                                    filtreliUrunler.map((u) => {
                                        // RESİM URL DÜZELTME MANTIĞI:
                                        let resimUrl = null;
                                        if (u.galeri && u.galeri.length > 0) {
                                            // URL zaten slash ile başlıyorsa çift slash olmasın diye kontrol ekliyoruz
                                            const path = u.galeri[0];
                                            const cleanPath = path.startsWith('/') ? path : `/${path}`;
                                            resimUrl = `${IMG_URL}${cleanPath}`;
                                        }

                                        return (
                                            <div key={u.id || u.ID} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 md:px-8 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all group ${u.stok === 0 ? 'opacity-70 grayscale-[0.5]' : ''}`}>

                                                <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
                                                        {resimUrl ? (
                                                            <img
                                                                src={resimUrl}
                                                                alt=""
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://via.placeholder.com/150?text=Resim+Yok";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <ImageIcon size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-gray-800 dark:text-white text-sm leading-tight">{u.ad || u.Ad}</span>
                                                        <span className="text-[10px] text-gray-400 mt-1 md:hidden uppercase font-bold tracking-widest">{u.kategoriAd || u.KategoriAd || "Genel"}</span>
                                                    </div>
                                                </div>

                                                <div className="hidden md:block col-span-2">
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg text-[11px] font-bold">
                                                        {u.kategoriAd || u.KategoriAd || "Genel"}
                                                    </span>
                                                </div>

                                                <div className="col-span-1 md:col-span-2 flex md:justify-center items-center gap-2">
                                                    <span className="text-[10px] text-gray-400 md:hidden font-bold uppercase">Stok:</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${u.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {u.stok > 0 ? `${u.stok} ADET` : 'TÜKENDİ'}
                                                    </span>
                                                </div>

                                                <div className="col-span-1 md:col-span-1 flex md:justify-end items-center gap-2">
                                                    <span className="text-[10px] text-gray-400 md:hidden font-bold uppercase">Fiyat:</span>
                                                    <span className="text-base font-black text-blue-600 dark:text-blue-400 tracking-tight">
                                                        {parseFloat(u.fiyat || u.Fiyat || 0).toFixed(2).replace('.', ',')} ₺
                                                    </span>
                                                </div>

                                                <div className="col-span-1 md:col-span-2 flex justify-end md:justify-center items-center gap-2 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 dark:border-gray-700">
                                                    <button
                                                        onClick={() => navigate(`/admin/urun-guncelle/${u.id || u.ID}`)}
                                                        className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                        title="Düzenle"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => urunArsivle(u.id || u.ID)}
                                                        className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                        title="Arşivle"
                                                    >
                                                        <Archive size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => urunSil(u.id || u.ID)}
                                                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-24 text-center">
                                        <Search size={48} className="mx-auto mb-4 text-gray-200 dark:text-gray-700" />
                                        <p className="text-gray-400 font-medium italic">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Urunler;