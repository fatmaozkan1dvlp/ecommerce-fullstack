import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, Edit, Layers, Plus, Search, Archive, Check, X } from 'lucide-react';

const Kategoriler = () => {
    const [kategoriler, setKategoriler] = useState(null);
    const [duzenlemeId, setDuzenlemeId] = useState(null);
    const [yeniAd, setYeniAd] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verileriGetir = async () => {
            try {
                setKategoriler(null);
                const response = await api.get("/Kategoriler");
                setKategoriler(response.data);
            } catch (error) {
                console.error("Kategori çekilirken hata oluştu:", error);
                setKategoriler([]);
            }
        };

        const kategoriSil = async (id) => {
            if (window.confirm("Bu kategoriyi kalıcı olarak silmek istediğinize emin misiniz?")) {
                try {
                    const response = await api.delete(`/Kategoriler/kalici-sil/${id}`);
                    alert(response.data.Message || "Kategori silindi.");
                    verileriGetir();
                } catch (error) {
                    const hataMesaji = error.response?.data?.Message || error.response?.data || "Silme işlemi başarısız.";
                    alert(hataMesaji);
                }
            }
        };

        const kategoriArsivle = async (id) => {
            const onay = window.confirm("Bu kategori ve içindeki tüm aktif ürünler arşive gönderilecek. Onaylıyor musunuz?");
            if (!onay) return;
            try {
                await api.put(`/Kategoriler/arsivle/${id}`);
                alert("Kategori ve bağlı ürünler arşivlendi.");
                verileriGetir();
            } catch (error) {
                console.error("Arşivleme hatası:", error);
                alert("Arşivleme işlemi başarısız.");
            }
        };

        const kategoriGuncelle = async (id) => {
            if (!yeniAd.trim()) return alert("Kategori adı boş olamaz!");
            try {
                const response = await api.put(`/Kategoriler/${id}`, { ad: yeniAd });
                alert(response.data.Message || "Kategori güncellendi.");
                setDuzenlemeId(null);
                verileriGetir();
            } catch (error) {
                console.error("Güncelleme hatası:", error);
                alert("Güncelleme sırasında bir hata oluştu.");
            }
        };

        window.handleKategoriSil = kategoriSil;
        window.handleKategoriArsivle = kategoriArsivle;
        window.handleKategoriGuncelle = kategoriGuncelle;

        verileriGetir();
    }, [location.key, yeniAd]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <Layers className="mr-2 text-blue-600" size={28} /> Kategori Yönetimi
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {kategoriler === null ? "Yükleniyor..." : `Toplam ${kategoriler.length} kategori tanımlı`}
                        </p>
                    </div>
                    <button onClick={() => navigate("/admin/kategori-ekle")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center">
                        <Plus size={20} className="mr-2" /> Yeni Kategori Ekle
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    {kategoriler === null ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            <span className="text-gray-400 text-sm italic">Kategoriler listeleniyor...</span>
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
                                        <div key={k.id || k.ID} className="grid grid-cols-1 md:grid-cols-2 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group px-6 py-4 md:px-8 md:py-5 items-center gap-4">

                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Kategori Adı</span>
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
                                                        {(k.ad || k.Ad).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-start md:items-center">
                                                <span className="text-[10px] uppercase text-gray-400 md:hidden mb-2 tracking-wider">İşlemler</span>
                                                <div className="flex space-x-2">
                                                    {duzenlemeId === (k.id || k.ID) ? (
                                                        <>
                                                            <button
                                                                onClick={() => window.handleKategoriGuncelle(k.id || k.ID)}
                                                                className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md"
                                                                title="Kaydet"
                                                            >
                                                                <Check size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => setDuzenlemeId(null)}
                                                                className="p-2.5 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all"
                                                                title="İptal"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setDuzenlemeId(k.id || k.ID);
                                                                    setYeniAd(k.ad || k.Ad);
                                                                }}
                                                                    className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                                title="Düzenle"
                                                            >
                                                                <Edit size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => window.handleKategoriArsivle(k.id || k.ID)}
                                                                    className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                                title="Arşive Gönder"
                                                            >
                                                                <Archive size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => window.handleKategoriSil(k.id || k.ID)}
                                                                    className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                                title="Kategoriyi Sil"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
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