import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async'
import api from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, Edit, Layers, Plus, Search, Archive, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Kategoriler = () => {
    const [kategoriler, setKategoriler] = useState([]);
    const [duzenlemeId, setDuzenlemeId] = useState(null);
    const [yeniAd, setYeniAd] = useState("");
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const fetchVeriler = async () => {
            try {
                if (mounted) {
                    setLoading(true);
                }
                const response = await api.get("/Kategoriler");
                if (!mounted) return;
                setKategoriler(response.data || []);
            } catch (error) {
                console.error(error);
                if (mounted) setKategoriler([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchVeriler();

        return () => {
            mounted = false;
        };
    }, [location.key, refresh]);

    const kategoriSil = async (id) => {
        if (!window.confirm("Bu kategoriyi kalıcı olarak silmek istediğinize emin misiniz?")) return;
        try {
            const response = await api.delete(`/Kategoriler/kalici-sil/${id}`);
            toast.success(response.data.Message || "Kategori silindi.");
            setRefresh(prev => prev + 1);
        } catch (error) {
            toast.error(error.response?.data?.Message || "Silme işlemi başarısız.");
        }
    };

    const kategoriArsivle = async (id) => {
        if (!window.confirm("Bu kategori ve içindeki tüm aktif ürünler arşive gönderilecek. Onaylıyor musunuz?")) return;
        try {
            await api.put(`/Kategoriler/arsivle/${id}`);
            toast.success("Kategori ve bağlı ürünler arşivlendi.");
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error(error);
            toast.error("Arşivleme işlemi başarısız.");
        }
    };

    const kategoriGuncelle = async (id) => {
        if (!yeniAd.trim()) {
            toast.error("Kategori adı boş olamaz!");
            return;
        }
        try {
            const response = await api.put(`/Kategoriler/${id}`, { ad: yeniAd });
            toast.success(response.data.Message || "Kategori güncellendi.");
            setDuzenlemeId(null);
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error(error);
            toast.error("Güncelleme sırasında bir hata oluştu.");
        }
    };

    return (
        <AdminLayout>
            <Helmet><title>Kategoriler | Admin Panel</title></Helmet>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <Layers className="mr-2 text-blue-600" size={28} /> Kategori Yönetimi
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {loading ? "Yükleniyor..." : `Toplam ${kategoriler.length} kategori`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/kategori-ekle")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center"
                    >
                        <Plus size={20} className="mr-2" /> Yeni Kategori Ekle
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="hidden md:grid grid-cols-2 bg-gray-50/50 dark:bg-gray-900/20 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700 px-8 py-5">
                                <div className="font-bold">Kategori Adı</div>
                                <div className="font-bold text-center">İşlemler</div>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {kategoriler.length > 0 ? (
                                    kategoriler.map((k) => (
                                        <div
                                            key={k.id || k.ID}
                                            className="grid grid-cols-1 md:grid-cols-2 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors px-6 py-4 md:px-8 md:py-5 items-center gap-4"
                                        >
                                            <div>
                                                {duzenlemeId === (k.id || k.ID) ? (
                                                    <input
                                                        type="text"
                                                        className="w-full max-w-sm p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                                        value={yeniAd}
                                                        onChange={(e) => setYeniAd(e.target.value)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="font-bold text-gray-800 dark:text-white text-sm tracking-wide">
                                                        {(k.ad || k.Ad || "").toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex md:justify-center gap-2">
                                                {duzenlemeId === (k.id || k.ID) ? (
                                                    <>
                                                        <button
                                                            onClick={() => kategoriGuncelle(k.id || k.ID)}
                                                            className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md"
                                                        >
                                                            <Check size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDuzenlemeId(null)}
                                                            className="p-2.5 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => { setDuzenlemeId(k.id || k.ID); setYeniAd(k.ad || k.Ad); }}
                                                            className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                            title="Düzenle"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => kategoriArsivle(k.id || k.ID)}
                                                            className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                                                            title="Arşivle"
                                                        >
                                                            <Archive size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => kategoriSil(k.id || k.ID)}
                                                            className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                                            title="Sil"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-8 py-20 text-center text-gray-400">
                                        <Search size={40} className="mx-auto mb-3 opacity-20" />
                                        <p className="italic">Kategori bulunamadı.</p>
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

export default Kategoriler;
