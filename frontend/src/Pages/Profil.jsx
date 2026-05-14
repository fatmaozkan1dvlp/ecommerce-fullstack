import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'
import {
    User, Package, LogOut, MapPin,
    ChevronRight, X, Loader2, ArrowLeft,
    CheckCircle2, Clock, Truck, XCircle, AlertTriangle
} from 'lucide-react';
import api, { getImageUrl} from "../api";
import toast from 'react-hot-toast';
import UserLayout from './UserLayout';


const getDurumStyle = (durum) => {
    switch (durum) {
        case "Alındı": return "bg-yellow-50 text-yellow-600 border-yellow-100";
        case "Hazırlanıyor": return "bg-blue-50 text-blue-600 border-blue-100";
        case "Kargoya Verildi": return "bg-purple-50 text-purple-600 border-purple-100";
        case "Teslim Edildi":
        case "Tamamlandı": return "bg-green-50 text-green-600 border-green-100";
        case "İptal Edildi": return "bg-red-50 text-red-600 border-red-100";
        default: return "bg-gray-50 text-gray-400 border-gray-100";
    }
};

const getDurumIcon = (durum) => {
    switch (durum) {
        case "Alındı": return <Clock size={12} />;
        case "Hazırlanıyor": return <Package size={12} />;
        case "Kargoya Verildi": return <Truck size={12} />;
        case "Teslim Edildi":
        case "Tamamlandı": return <CheckCircle2 size={12} />;
        case "İptal Edildi": return <XCircle size={12} />;
        default: return null;
    }
};

const Profil = () => {
    const navigate = useNavigate();
    const [profilData, setProfilData] = useState(null);
    const [siparisler, setSiparisler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [siparisLoading, setSiparisLoading] = useState(false);
    const [selectedSiparis, setSelectedSiparis] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [iptalOnayModal, setIptalOnayModal] = useState(false);
    const [iptalEdilecekId, setIptalEdilecekId] = useState(null);

    const fetchProfilData = useCallback(async () => {
        try {
            const [profilRes, siparisRes] = await Promise.all([
                api.get("/Kullanicilar/profil"),
                api.get("/Siparisler/siparislerim")
            ]);
            setProfilData(profilRes.data);
      
            const sirali = [...siparisRes.data].sort((a, b) => {
                if (a.durum === "İptal Edildi" && b.durum !== "İptal Edildi") return 1;
                if (a.durum !== "İptal Edildi" && b.durum === "İptal Edildi") return -1;
                return new Date(b.siparisTarihi) - new Date(a.siparisTarihi);
            });
            setSiparisler(sirali);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) navigate("/giris");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfilData();
    }, [fetchProfilData]);

    const detayGetir = async (id) => {
        try {
            const res = await api.get(`/Siparisler/${id}`);
            setSelectedSiparis(res.data);
            setIsModalOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("Sipariş detayları yüklenemedi.");
        }
    };

    const iptalBaslat = (siparisId) => {
        setIptalEdilecekId(siparisId);
        setIptalOnayModal(true);
    };

    const siparisIptalEt = async () => {
        if (!iptalEdilecekId) return;
        setSiparisLoading(true);
        try {
            await api.put(`/Siparisler/${iptalEdilecekId}/iptal`);
            toast.success("Siparişiniz iptal edildi.");
            setIptalOnayModal(false);
            setIptalEdilecekId(null);
            setIsModalOpen(false);
            setSiparisler(prev => prev.map(s =>
                s.id === iptalEdilecekId
                    ? { ...s, durum: "İptal Edildi" }
                    : s
            ));
            if (selectedSiparis?.id === iptalEdilecekId) {
                setSelectedSiparis(prev => ({ ...prev, durum: "İptal Edildi" }));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "İptal işlemi başarısız.");
        } finally {
            setSiparisLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    if (loading) return (
        <UserLayout>
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-600" size={40} />
            </div>
        </UserLayout>
    );

    return (
        <UserLayout>
            <Helmet>
                <title>Profilim | DECO.STUDIO</title>
            </Helmet>
            <div className="bg-[#F8F9FA] min-h-screen pt-10 pb-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                    <aside className="w-full lg:w-72 space-y-4 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-all mb-6 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-all">
                                    <ArrowLeft size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Ana Sayfa</span>
                            </button>

                            <div className="flex items-center gap-4 mb-8 p-4 bg-amber-50 rounded-2xl">
                                <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                                    {profilData?.adSoyad?.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-black text-gray-900 leading-tight truncate">{profilData?.adSoyad}</h2>
                                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-0.5">Müşteri</p>
                                </div>
                            </div>

                            
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                                    <p className="text-xl font-black text-gray-900">{siparisler.filter(s => s.durum !== "İptal Edildi").length}</p>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Sipariş</p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                                    <p className="text-xl font-black text-gray-900">
                                        ₺{siparisler
                                            .filter(s => s.durum !== "İptal Edildi")
                                            .reduce((acc, s) => acc + (s.toplamTutar || 0), 0)
                                            .toLocaleString('tr-TR')}
                                    </p>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Harcama</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                <button
                                    onClick={() => navigate('/profil-guncelle')}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-bold text-sm"
                                >
                                    <User size={18} className="text-amber-600" />
                                    Bilgilerimi Güncelle
                                    <ChevronRight size={14} className="ml-auto text-gray-300" />
                                </button>
                                <button
                                    onClick={() => navigate('/favoriler')}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-bold text-sm"
                                >
                                    <MapPin size={18} className="text-amber-600" />
                                    Favorilerim
                                    <ChevronRight size={14} className="ml-auto text-gray-300" />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 mt-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"
                                >
                                    <LogOut size={18} /> Çıkış Yap
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                                    Siparişlerim
                                </h1>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl">
                                    {siparisler.length} Sipariş
                                </span>
                            </div>

                            {siparisler.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                                        <Package size={32} className="text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 font-bold text-sm">Henüz bir siparişiniz bulunmuyor.</p>
                                    <button
                                        onClick={() => navigate("/")}
                                        className="px-6 py-3 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-600 transition-all"
                                    >
                                        Alışverişe Başla
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {siparisler.map(s => (
                                        <div
                                            key={s.id || s.ID}
                                            className={`group border rounded-[1.5rem] p-5 transition-all hover:shadow-md ${s.durum === "İptal Edildi"
                                                ? "border-gray-100 opacity-60"
                                                : "border-gray-100 hover:border-amber-100"}`}
                                        >
                                            <div className="flex flex-wrap justify-between items-center gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${s.durum === "İptal Edildi" ? "bg-red-50" : "bg-amber-50 group-hover:bg-amber-100"} transition-colors`}>
                                                        <Package size={20} className={s.durum === "İptal Edildi" ? "text-red-400" : "text-amber-600"} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-black text-gray-900">#{s.id || s.ID}</span>
                                                            <span className={`flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${getDurumStyle(s.durum)}`}>
                                                                {getDurumIcon(s.durum)}
                                                                {s.durum}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 font-medium mt-1">
                                                            {new Date(s.siparisTarihi).toLocaleDateString('tr-TR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className="text-right">
                                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Tutar</p>
                                                        <p className="font-black text-lg text-gray-900">
                                                            ₺{(s.toplamTutar || 0).toLocaleString('tr-TR')}
                                                        </p>
                                                    </div>

                                                    {s.durum === "Alındı" && (
                                                        <button
                                                            onClick={() => iptalBaslat(s.id || s.ID)}
                                                            className="px-4 py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            İptal Et
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => detayGetir(s.id || s.ID)}
                                                        className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all"
                                                    >
                                                        Detay <ChevronRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {isModalOpen && selectedSiparis && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
                    <div className="bg-white rounded-[3rem] p-8 md:p-10 w-full max-w-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-950">Sipariş Detayı</h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                                    #{selectedSiparis.id} •{" "}
                                    {new Date(selectedSiparis.siparisTarihi).toLocaleDateString('tr-TR', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDurumStyle(selectedSiparis.durum)}`}>
                                {getDurumIcon(selectedSiparis.durum)}
                                {selectedSiparis.durum}
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Teslimat Adresi</p>
                            <p className="text-sm font-bold text-gray-700">{selectedSiparis.adres}</p>
                            <p className="text-sm text-gray-500 mt-1">{selectedSiparis.telefon}</p>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-6">
                            {selectedSiparis.detaylar?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        {item.urunResimUrl ? (
                                            <img
                                                src={getImageUrl(item.urunResimUrl)}
                                                className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                                                alt={item.urunAdi}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center">
                                                <Package size={20} className="text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{item.urunAdi}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">
                                                {item.adet} adet × ₺{item.birimFiyat}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900">
                                        ₺{(item.adet * item.birimFiyat).toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-5 border-t-2 border-dashed border-gray-100 mb-6">
                            <span className="text-gray-400 font-bold">Toplam Tutar</span>
                            <span className="text-3xl font-black text-amber-600 tracking-tighter">
                                ₺{selectedSiparis.toplamTutar?.toLocaleString('tr-TR')}
                            </span>
                        </div>

                        <div className="flex gap-3">
                            {selectedSiparis.durum === "Alındı" && (
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        iptalBaslat(selectedSiparis.id);
                                    }}
                                    className="flex-1 py-4 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Siparişi İptal Et
                                </button>
                            )}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 bg-gray-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {iptalOnayModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white/20">
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center">
                                <AlertTriangle size={28} className="text-red-500" />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-center text-gray-900 mb-2 uppercase tracking-tight">
                            Siparişi İptal Et
                        </h3>
                        <p className="text-gray-400 text-center text-sm mb-8 font-medium leading-relaxed">
                            Bu siparişi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setIptalOnayModal(false); setIptalEdilecekId(null); }}
                                className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all border border-gray-200"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={siparisIptalEt}
                                disabled={siparisLoading}
                                className="flex-1 py-3.5 rounded-2xl font-black bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {siparisLoading
                                    ? <Loader2 className="animate-spin" size={16} />
                                    : "Evet, İptal Et"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default Profil;