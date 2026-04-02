import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api from '../api';
import AdminLayout from './AdminLayout';
import { ArchiveRestore, Package, Search, Image as ImageIcon, ChevronLeft, Layers, Info } from 'lucide-react';

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
        verileriGetir();
    }, [location.key, refresh]);

    const handleUrunGeriYukle = async (id) => {
        try {
            await api.put(`/Urunler/arsivden-cikar/${id}`);
            setRefresh(prev => prev + 1);
        } catch (error) { console.error(error); }
    };

    const handleKategoriGeriYukle = async (id) => {
        try {
            await api.put(`/Kategoriler/arsivden-cikar/${id}`);
            setRefresh(prev => prev + 1);
        } catch (error) { console.error(error); }
    };

    const filtrelenmisListe = useMemo(() => {
        const liste = aktifTab === "urunler" ? urunler : kategoriler;
        if (!liste) return [];
        return liste.filter(item =>
            (item.ad || item.Ad || "").toLowerCase().includes(aramaMetni.toLowerCase())
        );
    }, [aktifTab, urunler, kategoriler, aramaMetni]);

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 pb-20 md:pb-10 max-w-full">
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-[2rem] shadow-sm border dark:border-gray-700">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 md:space-x-4">
                                <button onClick={() => navigate("/admin/urunler")} className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all active:scale-90">
                                    <ChevronLeft size={20} className="text-gray-500 md:size-[24px]" />
                                </button>
                                <div>
                                    <h2 className="text-lg md:text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Genel Arşiv</h2>
                                    <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mt-0.5">Silinen kayıtlar</p>
                                </div>
                            </div>

                            <div className="hidden lg:block relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Ara..."
                                    className="pl-12 pr-6 py-3 rounded-2xl border-none bg-gray-100 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                                    value={aramaMetni}
                                    onChange={(e) => setAramaMetni(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t dark:border-gray-700 pt-4 md:pt-0 md:border-none">
                            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl w-full sm:w-fit">
                                <button
                                    onClick={() => { setAktifTab("urunler"); setAramaMetni(""); }}
                                    className={`flex-1 sm:flex-none flex items-center justify-center px-4 md:px-8 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${aktifTab === "urunler" ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600' : 'text-gray-500'}`}
                                >
                                    <Package size={16} className="mr-2" /> Ürünler
                                </button>
                                <button
                                    onClick={() => { setAktifTab("kategoriler"); setAramaMetni(""); }}
                                    className={`flex-1 sm:flex-none flex items-center justify-center px-4 md:px-8 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${aktifTab === "kategoriler" ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600' : 'text-gray-500'}`}
                                >
                                    <Layers size={16} className="mr-2" /> Kategoriler
                                </button>
                            </div>

                            <div className="relative w-full lg:hidden">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Hızlı ara..."
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-none bg-gray-100 dark:bg-gray-900 dark:text-white outline-none text-sm"
                                    value={aramaMetni}
                                    onChange={(e) => setAramaMetni(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start md:items-center p-3 md:p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-blue-700 dark:text-blue-400 text-[10px] md:text-xs font-medium">
                    <Info size={16} className="mr-2 flex-shrink-0 mt-0.5 md:mt-0" />
                    <span>Ürünleri geri yüklediğinizde, bağlı kategorileri de otomatik olarak yayına alınır.</span>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-[2rem] md:rounded-[2.5rem] border dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700">
                            <tr>
                                <th className="px-4 md:px-8 py-5 font-bold">Detaylar</th>
                                <th className="px-4 md:px-8 py-5 font-bold text-right w-[100px] md:w-[160px]">Eylem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {(aktifTab === "urunler" ? urunler : kategoriler) === null ? (
                                <tr><td colSpan="2" className="py-20 text-center animate-pulse text-gray-400 font-bold text-xs">Yükleniyor...</td></tr>
                            ) : filtrelenmisListe.length > 0 ? (
                                filtrelenmisListe.map((item) => (
                                    <tr key={item.id || item.ID} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group">
                                        <td className="px-4 md:px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                {aktifTab === "urunler" && (
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden border dark:border-gray-600 flex-shrink-0">
                                                        {item.galeri?.[0] ?
                                                            <img src={`https://localhost:7126${item.galeri[0]}`} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                            : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-gray-400" /></div>
                                                        }
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <span className="font-black text-[11px] md:text-sm text-gray-600 dark:text-gray-300 uppercase tracking-tight block truncate">
                                                        {item.ad || item.Ad}
                                                    </span>
                                                    {aktifTab === "urunler" && (
                                                        <p className="text-[9px] md:text-[10px] text-blue-500 font-bold mt-0.5 uppercase tracking-widest truncate">
                                                            {item.kategoriAd || "Kategorisiz"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 text-right">
                                            <button
                                                onClick={() => aktifTab === "urunler" ? handleUrunGeriYukle(item.id || item.ID) : handleKategoriGeriYukle(item.id || item.ID)}
                                                className="inline-flex items-center justify-center p-2.5 md:px-5 md:py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl md:rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                                            >
                                                <ArchiveRestore size={16} />
                                                <span className="hidden md:inline ml-2 font-black text-[10px] uppercase tracking-widest">Geri Yükle</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="py-24 text-center">
                                        <div className="flex flex-col items-center opacity-20">
                                            <ArchiveRestore size={48} className="text-gray-400 mb-4" />
                                            <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-500">Arşiv Temiz</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Arsivlenenler;