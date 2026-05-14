import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async'
import { Loader2, Plus, Minus, Trash2, ShoppingCart, LogIn, MapPin, Phone, CheckCircle2, X } from "lucide-react";
import api, { getImageUrl, isAuthenticated } from "../api";
import UserLayout from "./UserLayout";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sepet = () => {
    const [sepet, setSepet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [siparisModal, setSiparisModal] = useState(false);
    const [siparisLoading, setSiparisLoading] = useState(false);
    const [siparisBasarili, setSiparisBasarili] = useState(false);
    const [siparisNo, setSiparisNo] = useState(null);
    const [adresForm, setAdresForm] = useState({
        tamAdres: "",
        sehir: "",
        telefon: ""
    });
    const navigate = useNavigate();
    const girisYapildi = isAuthenticated();

    const fetchSepet = async () => {
        try {
            const res = await api.get("/Sepet");
            setSepet(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const profilBilgileriniGetir = async () => {
        try {
            const res = await api.get("/Kullanicilar/profil");
            const d = res.data;
            setAdresForm({
                tamAdres: d.tamAdres || "",
                sehir: d.sehir || "",
                telefon: d.telefon || ""
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!girisYapildi) { setLoading(false); return; }
        fetchSepet();
    }, [girisYapildi]);

    const sil = async (id) => {
        try {
            await api.delete(`/Sepet/sil/${id}`);
            setSepet(prev => prev.filter(item => item.id !== id));
            toast.success("Ürün sepetten çıkarıldı.");
        } catch (err) {
            console.error(err);
            toast.error("Silme işlemi başarısız.");
        }
    };

    const adetGuncelle = async (item, yeniAdet) => {
        if (yeniAdet < 1) return;
        if (yeniAdet > item.stok) {
            toast.error(`Maksimum ${item.stok} adet alabilirsiniz.`);
            return;
        }
        try {
            await api.put(`/Sepet/guncelle/${item.id}`, yeniAdet);
            setSepet(prev => prev.map(s => s.id === item.id ? { ...s, adet: yeniAdet } : s));
        } catch (err) {
            console.error(err);
            toast.error("Güncelleme başarısız.");
        }
    };

    const odemeModalAc = async () => {
        await profilBilgileriniGetir();
        setSiparisModal(true);
    };

    const siparisVer = async (e) => {
        e.preventDefault();

        if (!adresForm.tamAdres.trim()) {
            toast.error("Adres boş olamaz.");
            return;
        }
        if (!adresForm.telefon.trim() || adresForm.telefon.length !== 11) {
            toast.error("Geçerli bir telefon numarası girin (11 hane).");
            return;
        }

        setSiparisLoading(true);

        try {
            const payload = {
                tamAdres: adresForm.tamAdres,
                sehir: adresForm.sehir,
                telefon: adresForm.telefon,
                sepet: sepet.map(item => ({
                    urunId: item.urunId,
                    adet: item.adet
                }))
            };

            const res = await api.post("/Siparisler/olustur", payload);
            setSiparisNo(res.data.siparisId || res.data.SiparisId);
            setSiparisBasarili(true);
            setSepet([]);
        } catch (err) {
            const mesaj = err.response?.data?.message
                || err.response?.data?.Message
                || "Sipariş oluşturulamadı.";
            toast.error(mesaj);
        } finally {
            setSiparisLoading(false);
        }
    };

    const toplamFiyat = sepet.reduce((acc, item) => acc + item.fiyat * item.adet, 0);

    if (loading) return (
        <UserLayout>
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-600" size={40} />
            </div>
        </UserLayout>
    );

    return (
        <UserLayout>
            <Helmet>
                <title>Sepetim | DECO.STUDIO</title>
            </Helmet>
            <div className="max-w-6xl mx-auto px-4 py-10 min-h-[70vh]">

                {!girisYapildi ? (
                    <div className="flex flex-col items-center justify-center text-center py-24 space-y-6">
                        <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center">
                            <ShoppingCart size={40} className="text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Sepetinizi Görüntüleyin</h2>
                        <p className="text-gray-400 max-w-sm text-sm font-medium">
                            Sepetinizi görmek ve alışveriş yapabilmek için giriş yapmanız gerekiyor.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/giris" className="flex items-center gap-2 px-8 py-3.5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all shadow-lg">
                                <LogIn size={16} /> Giriş Yap
                            </Link>
                            <Link to="/kayit" className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:border-amber-600 hover:text-amber-600 transition-all">
                                Kayıt Ol
                            </Link>
                        </div>
                        <Link to="/" className="text-[11px] text-gray-400 hover:text-amber-600 font-bold uppercase tracking-widest transition-colors">
                            Alışverişe Devam Et →
                        </Link>
                    </div>

                ) : sepet.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-24 space-y-6">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                            <ShoppingCart size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Sepetiniz Boş</h2>
                        <p className="text-gray-400 max-w-sm text-sm font-medium">
                            Henüz sepete ürün eklemediniz.
                        </p>
                        <Link to="/" className="px-8 py-3.5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all shadow-lg">
                            Alışverişe Başla
                        </Link>
                    </div>

                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-6">
                                Sepetim <span className="text-gray-300 font-light">({sepet.length})</span>
                            </h1>

                            {sepet.map(item => (
                                <div key={item.id} className="flex gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <img
                                        src={getImageUrl(item.gorsel) ?? "https://via.placeholder.com/150?text=Resim+Yok"}
                                        className="w-24 h-24 object-cover rounded-2xl border border-gray-100 flex-shrink-0"
                                        alt={item.urunAd}
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Resim+Yok"; }}
                                    />
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <h3 className="font-black text-gray-900 text-sm md:text-base truncate">{item.urunAd}</h3>
                                            <p className="text-amber-600 font-bold text-sm mt-1">
                                                ₺{parseFloat(item.fiyat).toFixed(2).replace('.', ',')}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-xl">
                                                <button
                                                    disabled={item.adet <= 1}
                                                    onClick={() => adetGuncelle(item, item.adet - 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition disabled:opacity-30"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-black text-sm w-8 text-center">{item.adet}</span>
                                                <button
                                                    disabled={item.adet >= item.stok}
                                                    onClick={() => adetGuncelle(item, item.adet + 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition disabled:opacity-30"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <span className="font-black text-gray-900 text-base">
                                                ₺{(item.fiyat * item.adet).toLocaleString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => sil(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 self-start mt-1">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 h-fit sticky top-24 space-y-4">
                            <h2 className="text-base font-black uppercase tracking-tight text-gray-900">Sipariş Özeti</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Ürün Sayısı</span>
                                    <span className="font-bold text-gray-900">{sepet.reduce((acc, i) => acc + i.adet, 0)} adet</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Ara Toplam</span>
                                    <span className="font-bold text-gray-900">₺{toplamFiyat.toLocaleString('tr-TR')}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Kargo</span>
                                    <span className="font-bold text-green-600">Ücretsiz</span>
                                </div>
                            </div>
                            <div className="border-t border-dashed border-gray-100 pt-4 flex justify-between items-center">
                                <span className="font-black text-gray-900 uppercase tracking-tight text-sm">Toplam</span>
                                <span className="font-black text-2xl text-gray-950 tracking-tighter">
                                    ₺{toplamFiyat.toLocaleString('tr-TR')}
                                </span>
                            </div>
                            <button
                                onClick={odemeModalAc}
                                className="w-full bg-gray-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all shadow-lg"
                            >
                                Ödemeye Geç →
                            </button>
                            <Link to="/" className="block text-center text-[11px] text-gray-400 hover:text-amber-600 font-bold uppercase tracking-widest transition-colors">
                                ← Alışverişe Devam Et
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {siparisModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20 overflow-hidden">

                        {siparisBasarili ? (
                            <div className="p-10 flex flex-col items-center text-center space-y-5">
                                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Siparişiniz Alındı!</h2>
                                <p className="text-gray-400 text-sm font-medium">
                                    Sipariş numaranız: <span className="font-black text-gray-900">#{siparisNo}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Siparişinizi profilinizden takip edebilirsiniz.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                                    <button
                                        onClick={() => {
                                            setSiparisModal(false);
                                            setSiparisBasarili(false);
                                            navigate("/profil");
                                        }}
                                        className="flex-1 py-3.5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all"
                                    >
                                        Siparişlerimi Gör
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSiparisModal(false);
                                            setSiparisBasarili(false);
                                            navigate("/");
                                        }}
                                        className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:border-amber-600 hover:text-amber-600 transition-all"
                                    >
                                        Ana Sayfa
                                    </button>
                                </div>
                            </div>
                        ) : (
                            
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Teslimat Bilgileri</h2>
                                        <p className="text-gray-400 text-xs mt-1 font-medium">Siparişinizin gönderileceği adres</p>
                                    </div>
                                    <button
                                        onClick={() => setSiparisModal(false)}
                                        className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sipariş Özeti</p>
                                    {sepet.map(item => (
                                        <div key={item.id} className="flex justify-between text-xs font-medium text-gray-600">
                                            <span className="truncate max-w-[200px]">{item.urunAd} x{item.adet}</span>
                                            <span className="font-bold text-gray-900 ml-2">₺{(item.fiyat * item.adet).toLocaleString('tr-TR')}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-black text-sm">
                                        <span>Toplam</span>
                                        <span className="text-amber-600">₺{toplamFiyat.toLocaleString('tr-TR')}</span>
                                    </div>
                                </div>

                                <form onSubmit={siparisVer} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                            Telefon
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="tel"
                                                required
                                                maxLength={11}
                                                value={adresForm.telefon}
                                                onChange={(e) => setAdresForm(prev => ({
                                                    ...prev,
                                                    telefon: e.target.value.replace(/\D/g, "")
                                                }))}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 text-sm font-bold"
                                                placeholder="05xxxxxxxxx"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                            Şehir
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                value={adresForm.sehir}
                                                onChange={(e) => setAdresForm(prev => ({ ...prev, sehir: e.target.value }))}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 text-sm font-bold"
                                                placeholder="İstanbul"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                            Tam Adres
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={adresForm.tamAdres}
                                            onChange={(e) => setAdresForm(prev => ({ ...prev, tamAdres: e.target.value }))}
                                            className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 text-sm font-bold resize-none"
                                            placeholder="Mahalle, sokak, bina no, daire..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={siparisLoading}
                                        className="w-full bg-gray-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {siparisLoading
                                            ? <Loader2 className="animate-spin" size={18} />
                                            : "Siparişi Onayla →"
                                        }
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default Sepet;