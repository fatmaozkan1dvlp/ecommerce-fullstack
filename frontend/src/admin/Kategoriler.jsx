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
                {/* Üst Başlık ve Ekleme Butonu */}
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

                {/* Tablo Alanı */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    <div className="overflow-x-auto">
                        {kategoriler === null ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                <span className="text-gray-400 text-sm italic">Kategoriler listeleniyor...</span>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-900/20 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700">
                                        <th className="px-8 py-5 font-bold">Kategori Adı</th>
                                        <th className="px-8 py-5 font-bold text-center">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {kategoriler.length > 0 ? (
                                        kategoriler.map((k) => (
                                            <tr key={k.id || k.ID} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                                <td className="px-8 py-5">
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
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <div className="flex justify-center space-x-2">
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
                                                                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all shadow-sm"
                                                                    title="Düzenle"
                                                                >
                                                                    <Edit size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={() => window.handleKategoriArsivle(k.id || k.ID)}
                                                                    className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl transition-all shadow-sm"
                                                                    title="Arşive Gönder"
                                                                >
                                                                    <Archive size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={() => window.handleKategoriSil(k.id || k.ID)}
                                                                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all shadow-sm"
                                                                    title="Kategoriyi Sil"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="px-8 py-20 text-center text-gray-400">
                                                <Search size={40} className="mx-auto mb-3 opacity-20" />
                                                <p className="italic">Kategori bulunamadı.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Kategoriler;