import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AdminLayout from './AdminLayout';
import { ChevronLeft, Save, Layers, AlertCircle } from 'lucide-react';

const KategoriEkle = () => {
    const navigate = useNavigate();
    const [ad, setAd] = useState('');
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ad.trim()) return;

        setYukleniyor(true);
        setHata(null);

        try {
            await api.post("/Kategoriler", { Ad: ad });

            alert("Kategori başarıyla eklendi!");
            navigate('/admin/kategoriler');
        } catch (error) {
            console.error("Kategori ekleme hatası:", error);
            setHata("Kategori eklenirken bir sorun oluştu. Bu isimde bir kategori zaten olabilir.");
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                {/* Geri Dön ve Başlık */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/admin/kategoriler')}
                        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <ChevronLeft size={24} /> <span className="ml-1 font-medium text-lg">Kategorilere Dön</span>
                    </button>
                    <h2 className="text-2xl font-bold dark:text-white">Yeni Kategori</h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border dark:border-gray-700 space-y-6">
                    <div>
                        <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            <Layers size={18} className="mr-2 text-blue-500" /> Kategori Adı
                        </label>
                        <input
                            type="text"
                            required
                            value={ad}
                            onChange={(e) => setAd(e.target.value)}
                            className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Örn: Elektronik, Hediyelik Eşya..."
                        />
                    </div>

                    {hata && (
                        <div className="flex items-center p-4 mb-4 text-red-800 rounded-2xl bg-red-50 dark:bg-gray-900 dark:text-red-400 border border-red-100 dark:border-red-900">
                            <AlertCircle size={20} className="mr-2" />
                            <span className="text-sm font-medium">{hata}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={yukleniyor || !ad.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:bg-gray-300 dark:disabled:bg-gray-700 flex items-center justify-center space-x-2 text-lg uppercase tracking-widest"
                    >
                        {yukleniyor ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Kategoriyi Kaydet</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default KategoriEkle;