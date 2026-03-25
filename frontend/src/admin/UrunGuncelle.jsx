import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import AdminLayout from './AdminLayout';
import { ChevronLeft, Save, Package, List, Image as ImageIcon, X, Plus, Star, Trash2, Info } from 'lucide-react';

const UrunGuncelle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [kategoriler, setKategoriler] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [ad, setAd] = useState('');
    const [fiyat, setFiyat] = useState('');
    const [stok, setStok] = useState('');
    const [kategoriId, setKategoriId] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [mevcutResimler, setMevcutResimler] = useState([]); 
    const [yeniDosyalar, setYeniDosyalar] = useState([]);

    useEffect(() => {
        const urunVerileriniGetir = async () => {
            try {

                const [katRes, urunRes] = await Promise.all([
                    api.get("/Kategoriler"),
                    api.get(`/Urunler/${id}`)
                ]);

                setKategoriler(katRes.data);

                const urun = urunRes.data;
                if (urun) {
                    setAd(urun.ad || urun.Ad || "");
                    setFiyat(urun.fiyat || urun.Fiyat || "");
                    setStok(urun.stok || urun.Stok || "");
                    setKategoriId(urun.kategoriId || urun.KategoriId || "");
                    setAciklama(urun.aciklama || urun.Aciklama || "");
                    setMevcutResimler(urun.resimler || []); 
                }
            } catch (err) {
                console.error("Veri çekme hatası:", err);
            } finally {
                setYukleniyor(false);
            }
        };

        urunVerileriniGetir();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dto = {
            Ad: ad,
            Fiyat: parseFloat(fiyat),
            Stok: parseInt(stok),
            Aciklama: aciklama,
            KategoriId: parseInt(kategoriId)
        };

        try {
            await api.put(`/Urunler/${id}`, dto);

            if (yeniDosyalar.length > 0) {
                for (const file of yeniDosyalar) {
                    const formData = new FormData();
                    formData.append('dosya', file);
                    await api.post(`/Urunler/${id}/resim-ekle`, formData);
                }
            }

            alert("Ürün başarıyla güncellendi!");
            navigate('/admin/urunler');
        } catch (err) {
            console.error("Güncelleme hatası:", err.response?.data);
            alert("Güncelleme başarısız!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resimSec = (e) => {
        const dosyalar = Array.from(e.target.files);
        if (mevcutResimler.length + yeniDosyalar.length + dosyalar.length > 5) {
            alert("Maksimum 5 fotoğraf olabilir!");
            return;
        }
        setYeniDosyalar([...yeniDosyalar, ...dosyalar]);
    };

    const onMakeCover = async (rId) => {
        try {
            await api.put(`/Urunler/resim-kapak-yap/${rId}`);
            window.location.reload();
        } catch (err) {console.error(err), alert("Hata oluştu."); }
    };

    const onDeleteDBResim = async (rId) => {
        if (!window.confirm("Bu resim veritabanından silinecek. Emin misiniz?")) return;
        try {
            await api.delete(`/Urunler/resim-sil/${rId}`);
            setMevcutResimler(prev => prev.filter(r => r.id !== rId));
        } catch (err) {console.error(err), alert("Silinemedi."); }
    };

    if (yukleniyor) return <AdminLayout><div className="p-20 text-center font-black animate-pulse uppercase text-blue-600">Veriler Senkronize Ediliyor...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto pb-20 px-4">
                {/* Header Bölümü */}
                <div className="flex items-center justify-between mb-10">
                    <button onClick={() => navigate('/admin/urunler')} className="flex items-center text-gray-400 hover:text-blue-600 transition-all font-bold group">
                        <ChevronLeft size={28} className="group-hover:-translate-x-2 transition-transform" />
                        <span className="text-xl ml-2 uppercase tracking-tighter">Geri Dön</span>
                    </button>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase italic tracking-tighter">
                        Ürün Düzenleme 
                    </h1>
                </div>

                <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* SOL TARAF: FORM BİLGİLERİ */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-2xl border dark:border-gray-700">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-2">Ürün Başlığı</label>
                                    <input type="text" required value={ad} onChange={e => setAd(e.target.value)}
                                        className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/20 dark:text-white font-bold text-lg" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-2">Kategori</label>
                                        <select value={kategoriId} onChange={e => setKategoriId(e.target.value)}
                                            className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/20 dark:text-white font-bold">
                                            {kategoriler.map(k => <option key={k.id || k.ID} value={k.id || k.ID}>{k.ad || k.Ad}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-2">Fiyat (₺)</label>
                                            <input type="number" value={fiyat} onChange={e => setFiyat(e.target.value)}
                                                className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/20 dark:text-white font-bold" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-2">Stok</label>
                                            <input type="number" value={stok} onChange={e => setStok(e.target.value)}
                                                className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/20 dark:text-white font-bold" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-2">Ürün Açıklaması</label>
                                    <textarea value={aciklama} onChange={e => setAciklama(e.target.value)}
                                        className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/20 dark:text-white font-bold h-60 resize-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SAĞ TARAF: GÖRSEL VE AKSİYON */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-2xl border dark:border-gray-700">
                            <h2 className="font-black uppercase tracking-widest text-xs text-blue-600 mb-6">Medya Galeri</h2>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Mevcut Resimler */}
                                {mevcutResimler.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-3xl overflow-hidden group border-2 border-transparent hover:border-blue-500 transition-all shadow-md">
                                        <img src={`https://localhost:7126${img.url}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                                            <button type="button" onClick={() => onMakeCover(img.id)} className="p-2 bg-amber-500 text-white rounded-xl"><Star size={16} fill={img.siraNo === 1 ? "white" : "none"} /></button>
                                            <button type="button" onClick={() => onDeleteDBResim(img.id)} className="p-2 bg-red-500 text-white rounded-xl"><Trash2 size={16} /></button>
                                        </div>
                                        {img.siraNo === 1 && <div className="absolute top-2 left-2 bg-amber-500 text-[8px] text-white px-2 py-1 rounded-lg font-black uppercase shadow-lg">Kapak</div>}
                                    </div>
                                ))}

                                {/* Yeni Eklenen Resim Önizlemesi */}
                                {yeniDosyalar.map((file, index) => (
                                    <div key={index} className="relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-blue-400 opacity-70 shadow-md">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setYeniDosyalar(yeniDosyalar.filter((_, i) => i !== index))} className="absolute top-2 right-2 p-1 bg-gray-800 text-white rounded-full"><X size={12} /></button>
                                    </div>
                                ))}

                                {/* Yeni Ekleme Kutusu */}
                                {mevcutResimler.length + yeniDosyalar.length < 5 && (
                                    <label className="aspect-square flex flex-col items-center justify-center border-4 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-900 transition-all group">
                                        <Plus size={32} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        <input type="file" multiple className="hidden" onChange={resimSec} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !ad.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-[40px] shadow-2xl shadow-blue-600/40 transition-all active:scale-95 flex items-center justify-center space-x-4 text-xl tracking-tighter uppercase italic disabled:bg-gray-300 dark:disabled:bg-gray-700"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save size={28} />
                                    <span>GÜNCELLEMEYİ KAYDET</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default UrunGuncelle;