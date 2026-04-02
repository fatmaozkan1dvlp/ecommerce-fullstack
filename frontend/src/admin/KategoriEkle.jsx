import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AdminLayout from './AdminLayout';
import { ChevronLeft, Save, Layers, AlertCircle, Sparkles } from 'lucide-react';

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
            <div className="max-w-2xl mx-auto pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <button
                            onClick={() => navigate('/admin/kategoriler')}
                            className="p-2 md:p-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 rounded-2xl transition-all shadow-sm border dark:border-gray-700 active:scale-90"
                        >
                            <ChevronLeft size={20} className="md:size-[24px]" />
                        </button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight leading-none">Yeni Kategori</h2>
                            <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Sisteme yeni grup ekle</p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 space-y-8"
                >
                    <div className="space-y-4">
                        <label className="flex items-center text-xs md:text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] ml-1">
                            <Layers size={16} className="mr-2 text-blue-500" /> Kategori İsmi
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                value={ad}
                                onChange={(e) => setAd(e.target.value)}
                                className="w-full p-4 md:p-5 rounded-2xl border-2 border-gray-50 dark:border-gray-900 bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-sm md:text-base font-bold shadow-inner"
                                placeholder="Örn: 3D Modeller, Hediyelik..."
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-blue-500 transition-colors">
                                <Sparkles size={18} />
                            </div>
                        </div>
                    </div>

                    {hata && (
                        <div className="flex items-start p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 animate-shake">
                            <AlertCircle size={18} className="mr-3 mt-0.5 shrink-0" />
                            <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider leading-relaxed">{hata}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={yukleniyor || !ad.trim()}
                        className="w-full relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-black py-4 md:py-5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.97] disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 flex items-center justify-center space-x-3 text-sm md:text-lg uppercase tracking-[0.15em]"
                    >
                        {yukleniyor ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                <span className="text-xs">İşleniyor...</span>
                            </div>
                        ) : (
                            <>
                                <Save size={20} className="md:size-[22px]" />
                                <span>Kategoriyi Oluştur</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-[9px] md:text-xs text-gray-400 font-bold uppercase tracking-widest opacity-60">
                    Oluşturulan kategoriler hemen ürün ekleme sayfasında görünecektir.
                </p>
            </div>
        </AdminLayout>
    );
};

export default KategoriEkle;