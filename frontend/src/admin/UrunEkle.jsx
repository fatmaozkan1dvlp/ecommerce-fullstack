import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ChevronLeft, Save, Package, DollarSign, List, Hash, Image, X, Plus, AlertCircle } from 'lucide-react';

const UrunEkle = () => {
    const navigate = useNavigate();
    const [kategoriler, setKategoriler] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(false);


    const [ad, setAd] = useState('');
    const [fiyat, setFiyat] = useState('');
    const [stok, setStok] = useState('');
    const [kategoriId, setKategoriId] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [secilenResimler, setSecilenResimler] = useState([]);

    const API_URL = "https://localhost:7126/api";

    useEffect(() => {
        axios.get(`${API_URL}/Kategoriler`)
            .then(res => setKategoriler(res.data))
            .catch(err => console.error("Kategoriler yüklenemedi:", err));
    }, []);

    const resimSec = (e) => {
        const dosyalar = Array.from(e.target.files);
        if (secilenResimler.length + dosyalar.length > 5) {
            alert("Maksimum 5 fotoğraf ekleyebilirsiniz!");
            return;
        }
        setSecilenResimler([...secilenResimler, ...dosyalar]);
    };

    const resimKaldir = (index) => {
        setSecilenResimler(secilenResimler.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (Number(fiyat) <= 0 || Number(stok) <= 0) {
            alert("Fiyat ve Stok değerleri 0'dan büyük olmalıdır!");
            return;
        }
        if (secilenResimler.length === 0) {
            alert("Lütfen en az 1 ürün fotoğrafı ekleyin!");
            return;
        }

        setYukleniyor(true);

        const urunVerisi = {
            ad: ad,
            fiyat: parseInt(fiyat), 
            stok: parseInt(stok),
            kategoriId: parseInt(kategoriId),
            aciklama: aciklama
        };

        try {
            const urunRes = await axios.post(`${API_URL}/Urunler`, urunVerisi);
            const yeniUrunId = urunRes.data.id || urunRes.data.ID;

            if (yeniUrunId) {
                for (const dosya of secilenResimler) {
                    const formData = new FormData();
                    formData.append('dosya', dosya);

                    await axios.post(`${API_URL}/Urunler/${yeniUrunId}/resim-ekle`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
                alert("Ürün ve tüm fotoğraflar başarıyla kaydedildi!");
                navigate('/admin/urunler');
            }
        } catch (error) {
            console.error("Detaylı Hata:", error.response?.data || error.message);
            alert("Bir hata oluştu! Lütfen veritabanı bağlantısını ve backend loglarını kontrol edin.");
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto pb-10">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/admin/urunler')} className="flex items-center text-gray-500 hover:text-blue-600 transition-all">
                        <ChevronLeft size={24} /> <span className="ml-1 font-medium text-lg">Vazgeç ve Dön</span>
                    </button>
                    <h2 className="text-2xl font-bold dark:text-white">Yeni Ürün Tanımla</h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100 dark:border-gray-700">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                <Package size={18} className="mr-2 text-blue-500" /> Ürün Adı
                            </label>
                            <input type="text" required value={ad} onChange={(e) => setAd(e.target.value)}
                                className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ürün başlığını girin..." />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                <List size={18} className="mr-2 text-blue-500" /> Kategori
                            </label>
                            <select required value={kategoriId} onChange={(e) => setKategoriId(e.target.value)}
                                className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Kategori Seçiniz</option>
                                {kategoriler.map(k => <option key={k.id || k.ID} value={k.id || k.ID}>{k.ad || k.Ad}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Fiyat (₺)</label>
                                <input type="number" required value={fiyat} min="1"
                                    onChange={(e) => setFiyat(e.target.value.replace(/^0+/, ''))} 
                                    className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Min 1" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Stok Adedi</label>
                                <input type="number" required value={stok} min="1"
                                    onChange={(e) => setStok(e.target.value.replace(/^0+/, ''))}
                                    className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Min 1" />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Ürün Açıklaması</label>
                            <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)}
                                className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white h-32 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ürün detaylarını buraya yazın..."></textarea>
                        </div>
                    </div>

                    <div className="pt-8 border-t dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                                <Image size={18} className="mr-2 text-blue-500" /> Ürün Fotoğrafları
                            </label>
                            <span className={`text-xs font-medium ${secilenResimler.length < 1 ? 'text-red-500' : 'text-gray-400'}`}>
                                {secilenResimler.length} / 5 Fotoğraf
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {secilenResimler.length < 5 && (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-32 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group">
                                    <Plus size={28} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={resimSec} />
                                </label>
                            )}

                            {secilenResimler.map((file, index) => (
                                <div key={index} className="relative h-32 group animate-in fade-in zoom-in duration-300">
                                    <img src={URL.createObjectURL(file)} alt="önizleme" className="w-full h-full object-cover rounded-2xl border-2 border-transparent group-hover:border-blue-500 transition-all" />
                                    <button type="button" onClick={() => resimKaldir(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:bg-red-600 hover:scale-110 transition-all">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {secilenResimler.length === 0 && (
                            <p className="flex items-center text-xs text-amber-600 mt-2"><AlertCircle size={14} className="mr-1" /> En az bir fotoğraf eklemek zorunludur.</p>
                        )}
                    </div>

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
                                <span>Ürünü Kaydet</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default UrunEkle;