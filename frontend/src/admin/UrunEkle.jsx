import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import AdminLayout from './AdminLayout';
import { ChevronLeft, Save, Package, List, Image as ImageIcon, X, Plus, AlertCircle, Info } from 'lucide-react';

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

    useEffect(() => {
        api.get(`/Kategoriler`)
            .then(res => setKategoriler(res.data))
            .catch(err => console.error("Kategoriler yüklenemedi:", err));
    }, []);

    const resimSec = async (e) => {
        const dosyalar = Array.from(e.target.files);

        if (secilenResimler.length + dosyalar.length > 5) {
            alert("Maksimum 5 fotoğraf ekleyebilirsiniz!");
            return;
        }

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: 'image/jpeg' 
        };

        try {
            const islenmisDosyalar = [];

            for (const dosya of dosyalar) {
                const compressedFile = await imageCompression(dosya, options);

                const yeniDosya = new File(
                    [compressedFile],
                    `${Date.now()}-${dosya.name.split('.')[0]}.jpg`,
                    { type: 'image/jpeg' }
                );

                islenmisDosyalar.push(yeniDosya);
            }

            setSecilenResimler([...secilenResimler, ...islenmisDosyalar]);
        } catch (error) {
            console.error("Resim işleme hatası:", error);
            alert("Bazı resimler işlenemedi!");
        }
    };

    const resimKaldir = (index) => {
        setSecilenResimler(secilenResimler.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urunVerisi = {
            ad: ad,
            fiyat: parseFloat(fiyat),
            stok: parseInt(stok),
            kategoriId: parseInt(kategoriId),
            aciklama: aciklama
        };
        if (Number(fiyat) <= 0 || Number(stok) <= 0) {
            alert("Fiyat ve Stok değerleri 0'dan büyük olmalıdır!");
            return;
        }
        if (secilenResimler.length === 0) {
            alert("Lütfen en az 1 ürün fotoğrafı ekleyin!");
            return;
        }

        setYukleniyor(true);

       

        try {
            const urunRes = await api.post(`/Urunler`, urunVerisi);
            const yeniUrunId = urunRes.data.id || urunRes.data.ID;

            if (yeniUrunId) {
                for (const dosya of secilenResimler) {
                    const formData = new FormData();
                    formData.append('dosya', dosya);

                    await api.post(`/Urunler/${yeniUrunId}/resim-ekle`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
                alert("Ürün ve tüm fotoğraflar başarıyla kaydedildi!");
                navigate('/admin/urunler');
            }
        } catch (error) {
            console.error("Detaylı Hata:", error.response?.data || error.message);
            alert("Bir hata oluştu! Lütfen backend bağlantısını kontrol edin.");
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/urunler')}
                            className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all group"
                        >
                            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">Yeni Ürün Ekle</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Envanter Yönetimi</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-800">
                        <Info size={16} />
                        <span className="text-xs font-bold">Zorunlu alanları doldurmayı unutmayın.</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-8">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b dark:border-gray-700">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <Package size={20} />
                                </div>
                                <h3 className="font-black text-gray-800 dark:text-white uppercase tracking-tighter text-sm">Temel Bilgiler</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Ürün İsmi</label>
                                    <input
                                        type="text" required value={ad} onChange={(e) => setAd(e.target.value)}
                                        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        placeholder="Ürün Adı Giriniz"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Detaylı Açıklama</label>
                                    <textarea
                                        value={aciklama} onChange={(e) => setAciklama(e.target.value)}
                                        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white h-44 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
                                        placeholder="Ürün özelliklerini, boyutlarını ve detaylarını buraya yazın..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Satış Fiyatı (₺)</label>
                                    <input
                                        type="number" required value={fiyat} min="1"
                                        onChange={(e) => setFiyat(e.target.value)}
                                        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-black text-blue-600"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Stok Miktarı</label>
                                    <input
                                        type="number" required value={stok} min="1"
                                        onChange={(e) => setStok(e.target.value.replace(/^0+/, ''))}
                                        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-black text-gray-700 dark:text-gray-200"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-6">
                            <label className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
                                <List size={14} className="mr-2" /> Kategori
                            </label>
                            <select
                                required value={kategoriId} onChange={(e) => setKategoriId(e.target.value)}
                                className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900/50 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 font-bold appearance-none cursor-pointer"
                            >
                                <option value="">Seçim Yapın</option>
                                {kategoriler.map(k => <option key={k.id || k.ID} value={k.id || k.ID}>{k.ad || k.Ad}</option>)}
                            </select>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    <ImageIcon size={14} className="mr-2" /> Ürün Görselleri
                                </label>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${secilenResimler.length < 1 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                    {secilenResimler.length} / 5
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {secilenResimler.map((file, index) => (
                                    <div key={index} className="relative aspect-square group animate-in fade-in zoom-in duration-300">
                                        <img src={URL.createObjectURL(file)} alt="önizleme" className="w-full h-full object-cover rounded-2xl border dark:border-gray-700 shadow-sm" />
                                        <button
                                            type="button"
                                            onClick={() => resimKaldir(index)}
                                            className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 text-red-500 rounded-xl p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {secilenResimler.length < 5 && (
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all group">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                            <Plus size={24} />
                                        </div>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={resimSec} />
                                    </label>
                                )}
                            </div>
                            {secilenResimler.length === 0 && (
                                <p className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 mt-4 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg leading-tight">
                                    <AlertCircle size={14} /> En az bir görsel eklenmelidir.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={yukleniyor || !ad.trim() || secilenResimler.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                        >
                            {yukleniyor ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Kaydet ve Yayınla</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default UrunEkle;