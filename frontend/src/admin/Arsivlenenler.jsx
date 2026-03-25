import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, ArchiveRestore, Package, Search, Image as ImageIcon, ChevronLeft, Layers, Info } from 'lucide-react';

const Arsivlenenler = () => {
    const [urunler, setUrunler] = useState(null);
    const [kategoriler, setKategoriler] = useState(null);
    const [aktifTab, setAktifTab] = useState("urunler"); 
    const [aramaMetni, setAramaMetni] = useState("");
    const [refresh, setRefresh] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verileriGetir = async () => {
            try {
                setUrunler(null);
                setKategoriler(null);
                const [urunRes, katRes] = await Promise.all([
                    api.get("/Urunler/arsivdekiler"),
                    api.get("/Kategoriler/arsivlenenler")
                ]);
                setUrunler(urunRes.data);
                setKategoriler(katRes.data);
            } catch (err) {
                console.error("Arşiv verisi çekme hatası:", err);
                setUrunler([]);
                setKategoriler([]);
            }
        };

        window.handleUrunGeriYukle = async (id) => {
            try {
                await api.put(`/Urunler/arsivden-cikar/${id}`);
                setRefresh(prev => prev + 1);
                alert("Ürün ve bağlı kategorisi aktif edildi!");
            } catch (error) { console.error(error); }
        };

        window.handleKategoriGeriYukle = async (id) => {
            try {
                await api.put(`/Kategoriler/arsivden-cikar/${id}`);
                setRefresh(prev => prev + 1);
                alert("Kategori tekrar yayına alındı!");
            } catch (error) { console.error(error); }
        };

        verileriGetir();
    }, [location.key, refresh]);

    const filtrelenmisListe = useMemo(() => {
        const liste = aktifTab === "urunler" ? urunler : kategoriler;
        if (!liste) return [];
        return liste.filter(item =>
            (item.ad || item.Ad || "").toLowerCase().includes(aramaMetni.toLowerCase())
        );
    }, [aktifTab, urunler, kategoriler, aramaMetni]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* ÜST PANEL */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate("/admin/urunler")} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all">
                                <ChevronLeft size={24} className="text-gray-500" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Genel Arşiv</h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Silinen kayıtları buradan yönetin</p>
                            </div>
                        </div>

                        {/* TAB SEÇİCİ */}
                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl w-fit">
                            <button
                                onClick={() => { setAktifTab("urunler"); setAramaMetni(""); }}
                                className={`flex items-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${aktifTab === "urunler" ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600' : 'text-gray-500'}`}
                            >
                                <Package size={18} className="mr-2" /> Ürünler
                            </button>
                            <button
                                onClick={() => { setAktifTab("kategoriler"); setAramaMetni(""); }}
                                className={`flex items-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${aktifTab === "kategoriler" ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600' : 'text-gray-500'}`}
                            >
                                <Layers size={18} className="mr-2" /> Kategoriler
                            </button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`${aktifTab === "urunler" ? "Ürün" : "Kategori"} ara...`}
                                className="pl-12 pr-6 py-3 rounded-2xl border-none bg-gray-100 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 transition-all"
                                value={aramaMetni}
                                onChange={(e) => setAramaMetni(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ARŞİV BİLGİ NOTU */}
                <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-amber-700 dark:text-amber-400 text-xs font-medium">
                    <Info size={16} className="mr-2 flex-shrink-0" />
                    <span>Arşivdeki ürünleri geri yüklediğinizde, bağlı oldukları kategori de otomatik olarak aktif edilir.</span>
                </div>

                {/* TABLO */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl overflow-hidden border dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-8 py-5 font-bold">{aktifTab === "urunler" ? "Ürün Detayı" : "Kategori Adı"}</th>
                                    <th className="px-8 py-5 font-bold text-center">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {((aktifTab === "urunler" ? urunler : kategoriler) === null) ? (
                                    <tr><td colSpan="2" className="py-24 text-center animate-pulse text-gray-400 font-bold uppercase tracking-tighter">Veriler Yükleniyor...</td></tr>
                                ) : filtrelenmisListe.length > 0 ? (
                                    filtrelenmisListe.map((item) => (
                                        <tr key={item.id || item.ID} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    {aktifTab === "urunler" && (
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden border dark:border-gray-600 shadow-inner">
                                                            {item.galeri?.[0] ? <img src={`https://localhost:7126${item.galeri[0]}`} alt="" className="w-full h-full object-cover grayscale opacity-60" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-gray-400" /></div>}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-black text-sm text-gray-600 dark:text-gray-300 uppercase tracking-tight">{item.ad || item.Ad}</span>
                                                        {aktifTab === "urunler" && <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-widest">{item.kategoriAd || "Kategorisiz"}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex justify-center space-x-3">
                                                    <button
                                                        onClick={() => aktifTab === "urunler" ? window.handleUrunGeriYukle(item.id || item.ID) : window.handleKategoriGeriYukle(item.id || item.ID)}
                                                        className="flex items-center space-x-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95"
                                                    >
                                                        <ArchiveRestore size={16} />
                                                        <span>Geri Yükle</span>
                                                    </button>
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="py-32 text-center">
                                            <div className="flex flex-col items-center opacity-20">
                                                <ArchiveRestore size={64} className="text-gray-400 mb-4" />
                                                <p className="text-sm font-black uppercase tracking-widest">Arşiv Temiz</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Arsivlenenler;