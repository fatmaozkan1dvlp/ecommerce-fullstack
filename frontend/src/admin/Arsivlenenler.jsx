import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, ArchiveRestore, Package, Search, Image as ImageIcon, ChevronLeft } from 'lucide-react';

const Arsivlenenler = () => {
    const [urunler, setUrunler] = useState(null);
    const [aramaMetni, setAramaMetni] = useState("");
    const [refresh, setRefresh] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verileriGetir = async () => {
            try {
                setUrunler(null);
                const res = await api.get("/Urunler/arsivdekiler");
                setUrunler(res.data);
            } catch (err) {
                console.error("Arşiv verisi çekme hatası:", err);
                setUrunler([]);
            }
        };

        window.handleArsivdenCikar = async (id) => {
            try {
                await api.put(`/Urunler/arsivden-cikar/${id}`);
                setRefresh(prev => prev + 1);
                alert("Ürün tekrar satışa çıkarıldı!");
            } catch (error) { console.error(error); }
        };


        verileriGetir();
    }, [location.key, refresh]);

    const filtreliUrunler = useMemo(() => {
        if (!urunler) return [];
        if (!aramaMetni) return urunler;
        return urunler.filter(u =>
            (u.ad || u.Ad || "").toLowerCase().includes(aramaMetni.toLowerCase())
        );
    }, [urunler, aramaMetni]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate("/admin/urunler")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ChevronLeft size={24} className="text-gray-500" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                                <Package className="mr-2 text-amber-600" size={28} /> Ürün Arşivi
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {urunler === null ? "Yükleniyor..." : `Toplam ${filtreliUrunler.length} arşivlenmiş ürün`}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Arşivde ara..."
                            className="pl-10 pr-4 py-2 rounded-xl border dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            onChange={(e) => setAramaMetni(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Ürün Bilgisi</th>
                                    <th className="px-6 py-4 text-center">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {urunler === null ? (
                                    <tr><td colSpan="2" className="py-20 text-center animate-pulse text-gray-400 font-medium">Arşiv Yükleniyor...</td></tr>
                                ) : filtreliUrunler.length > 0 ? (
                                    filtreliUrunler.map((u) => (
                                        <tr key={u.id || u.ID} className="hover:bg-amber-50/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden border dark:border-gray-600">
                                                        {u.galeri?.[0] ? <img src={`https://localhost:7126${u.galeri[0]}`} alt="" className="w-full h-full object-cover grayscale" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} /></div>}
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-500">{u.ad || u.Ad}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-3">
                                                    <button
                                                        onClick={() => window.handleArsivdenCikar(u.id || u.ID)}
                                                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-bold text-xs"
                                                    >
                                                        <ArchiveRestore size={16} />
                                                        <span>GERİ YÜKLE</span>
                                                    </button>
                                                  
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                            <tr>
                                                <td colSpan="2" className="py-20 text-center text-gray-400 italic font-medium">Arşivde ürün bulunamadı.</td>
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