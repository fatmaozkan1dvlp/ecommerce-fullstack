import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import AdminLayout from './AdminLayout';
import { ChevronLeft, Save, Package, List, Image as ImageIcon, X, Plus, Star, Trash2, Info, AlertCircle } from 'lucide-react';

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
    const [kapakResimId, setKapakResimId] = useState(null); 

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
                    const kapak = (urun.resimler || []).find(r => r.siraNo === 1);
                    if (kapak) setKapakResimId(kapak.id);
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

            const orijinalKapak = mevcutResimler.find(r => r.siraNo === 1);
            if (kapakResimId && (!orijinalKapak || orijinalKapak.id !== kapakResimId)) {
                await api.put(`/Urunler/resim-kapak-yap/${kapakResimId}`);
            }

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

    const onMakeCoverLocal = (rId) => {
        setKapakResimId(rId);
    };

    const onDeleteDBResim = async (rId) => {
        if (!window.confirm("Bu resim veritabanından silinecek. Emin misiniz?")) return;
        try {
            await api.delete(`/Urunler/resim-sil/${rId}`);
            setMevcutResimler(prev => prev.filter(r => r.id !== rId));
            if (kapakResimId === rId) setKapakResimId(null);
        } catch (err) { console.error(err); alert("Silinemedi."); }
    };

    if (yukleniyor) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <div className="text-sm font-black uppercase tracking-widest text-blue-600 animate-pulse">Senkronize Ediliyor...</div>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto pb-20 px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/urunler')} className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-500 rounded-2xl hover:text-blue-600 transition-all">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight uppercase italic">Ürünü Düzenle</h2>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Kaydet butonuna basana kadar değişiklikler uygulanmaz.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-sm border dark:border-gray-700">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Ürün Başlığı</label>
                                    <input type="text" required value={ad} onChange={e => setAd(e.target.value)}
                                        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-bold" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Kategori</label>
                                        <select value={kategoriId} onChange={e => setKategoriId(e.target.value)}
                                            className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-bold cursor-pointer">
                                            {kategoriler.map(k => <option key={k.id || k.ID} value={k.id || k.ID}>{k.ad || k.Ad}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Fiyat (₺)</label>
                                            <input type="number" value={fiyat} onChange={e => setFiyat(e.target.value)}
                                                className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-black text-blue-600" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Stok</label>
                                            <input type="number" value={stok} onChange={e => setStok(e.target.value)}
                                                className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-black" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Açıklama</label>
                                    <textarea value={aciklama} onChange={e => setAciklama(e.target.value)}
                                        className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-medium h-48 resize-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[40px] shadow-sm border dark:border-gray-700">
                            <label className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">
                                <ImageIcon size={14} className="mr-2" /> Galeri (Kapak Seçin)
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                {mevcutResimler.map((img) => (
                                    <div key={img.id} className={`relative aspect-square rounded-2xl overflow-hidden group border-2 transition-all ${kapakResimId === img.id ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-transparent'}`}>
                                        <img src={`https://localhost:7126${img.url}`} className="w-full h-full object-cover" />

                                        <div className="absolute inset-0 bg-black/40 md:opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                            <button type="button" onClick={() => onMakeCoverLocal(img.id)} className={`p-2 rounded-xl transition-all ${kapakResimId === img.id ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}>
                                                <Star size={16} fill={kapakResimId === img.id ? "white" : "none"} />
                                            </button>
                                            <button type="button" onClick={() => onDeleteDBResim(img.id)} className="p-2 bg-red-500 text-white rounded-xl">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        {kapakResimId === img.id && (
                                            <div className="absolute top-2 left-2 bg-amber-500 text-[8px] text-white px-2 py-0.5 rounded-md font-black uppercase">Kapak</div>
                                        )}
                                    </div>
                                ))}

                                {yeniDosyalar.map((file, index) => (
                                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-blue-400/50 shadow-sm">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" />
                                        <button type="button" onClick={() => setYeniDosyalar(yeniDosyalar.filter((_, i) => i !== index))} className="absolute top-1 right-1 p-1 bg-gray-800 text-white rounded-full"><X size={10} /></button>
                                        <div className="absolute bottom-1 left-1 bg-blue-500 text-[7px] text-white px-1.5 py-0.5 rounded font-black uppercase">Yeni</div>
                                    </div>
                                ))}

                                {mevcutResimler.length + yeniDosyalar.length < 5 && (
                                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all group">
                                        <Plus size={24} className="text-gray-300 group-hover:text-blue-500" />
                                        <input type="file" multiple className="hidden" onChange={resimSec} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !ad.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[35px] shadow-xl shadow-blue-600/30 transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-sm uppercase tracking-widest italic disabled:bg-gray-200 dark:disabled:bg-gray-800"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                            ) : (
                                <>
                                    <Save size={20} />
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