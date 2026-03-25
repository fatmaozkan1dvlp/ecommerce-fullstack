import { useEffect, useState, useMemo} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api from '../api'; 
import AdminLayout from './AdminLayout';
import { Trash2, Edit, Package, Layers, Image as ImageIcon, Search, Archive } from 'lucide-react';

const Urunler = () => {

    const [urunler, setUrunler] = useState(null);
    const [kategoriler, setKategoriler] = useState([]);
    const [seciliKategori, setSeciliKategori] = useState("Hepsi");
    const [aramaMetni, setAramaMetni] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    



    const urunSil = async (id) => {

        try {

            await api.delete(`/Urunler/kalici-sil/${id}`);

            const onay = window.confirm("Bu ürün kalıcı olarak silinecek. Emin misiniz?");
            if (!onay) return;

            setUrunler(prev =>
                prev.filter(u => Number(u.id || u.ID) !== Number(id))
            );

        } catch (error) {

            if (error.response && error.response.status === 400) {

                const onay = window.confirm("Bu ürün geçmiş siparişlerde bulunduğu için silinemez. Arşivlensin mi?");
                if (!onay) return;

                try {

                    await api.put(`/Urunler/arsivle/${id}`);

                    setUrunler(prev =>
                        prev.filter(u => Number(u.id || u.ID) !== Number(id))
                    );

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

                const [urunRes, katRes] = await Promise.all([
                    api.get("/Urunler"),
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
    }, [location.key]);

    
    const filtreliUrunler = useMemo(() => {
        if (!urunler) return [];

        let sonuc = [...urunler];

        if (seciliKategori !== "Hepsi") {
            sonuc = sonuc.filter(u => u.kategoriAd === seciliKategori);
        }

        if (aramaMetni) {
            sonuc = sonuc.filter(u =>
                u.ad && u.ad.toLowerCase().includes(aramaMetni.toLowerCase())
            );
        }

        return sonuc.sort((a, b) => {
            if (a.stok > 0 && b.stok === 0) return -1;
            if (a.stok === 0 && b.stok > 0) return 1;
            return 0;
        });
    }, [seciliKategori, urunler, aramaMetni]);

    return (
        <AdminLayout>
            <div className="space-y-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <Package className="mr-2 text-blue-600" size={28} /> Ürün Yönetimi
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {urunler === null ? (
                                <span className="inline-block h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></span>
                            ) : (
                                `Toplam ${filtreliUrunler.length} ürün listeleniyor`
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/urun-ekle")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
                    >
                        + Yeni Ürün Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border dark:border-gray-800">
                    <div className="flex flex-wrap gap-2 items-center">
                        <Layers size={18} className="text-gray-400 mr-2" />
                        <button
                            onClick={() => setSeciliKategori("Hepsi")}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${seciliKategori === "Hepsi" ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                        >
                            TÜMÜNÜ GÖSTER
                        </button>
                        {kategoriler.map(k => (
                            <button
                                key={k.id || k.ID}
                                onClick={() => setSeciliKategori(k.ad)}
                                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${seciliKategori === (k.ad || k.Ad) ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                            >
                                {(k.ad || k.Ad).toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Ürün adı ile ara..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            onChange={(e) => setAramaMetni(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    <div className="overflow-x-auto">
                        {urunler === null ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                <span className="text-gray-400 text-sm italic">Ürünler yükleniyor...</span>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-400 text-[10px] uppercase tracking-widest">
                                        <th className="px-6 py-4 font-semibold">Görsel & Ürün</th>
                                        <th className="px-6 py-4 font-semibold">Kategori</th>
                                        <th className="px-6 py-4 font-semibold text-center">Stok</th>
                                        <th className="px-6 py-4 font-semibold text-right">Fiyat</th>
                                        <th className="px-6 py-4 font-semibold text-center">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filtreliUrunler.map((u) => (
                                        <tr key={u.id || u.ID} className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group ${u.stok === 0 ? 'opacity-60 bg-gray-50/50 dark:bg-gray-900/20' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden border dark:border-gray-600">
                                                        {u.galeri && u.galeri.length > 0 ? (
                                                            <img
                                                                src={`https://localhost:7126${u.galeri[0]}`}
                                                                alt=""
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Resim+Yok"; }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <ImageIcon size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="font-bold text-gray-800 dark:text-white text-sm truncate max-w-[200px]">
                                                        {u.ad || u.Ad}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm dark:text-gray-300 font-medium">
                                                {u.kategoriAd || "Genel"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${u.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 italic'}`}>
                                                    {u.stok > 0 ? `${u.stok} ADET` : 'TÜKENDİ'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                                    {u.fiyat?.toLocaleString('tr-TR')} ₺
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button onClick={() => navigate(`/admin/urun-guncelle/${ u.id || u.ID }`)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all shadow-sm">
                                                        <Edit size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => urunArsivle(u.id || u.ID)}
                                                        className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl transition-all shadow-sm"
                                                        title="Arşive Gönder"
                                                    >
                                                        <Archive size={20} />
                                                    </button>
                                                    <button onClick={() => urunSil(u.id || u.ID)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all shadow-sm">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Urunler;