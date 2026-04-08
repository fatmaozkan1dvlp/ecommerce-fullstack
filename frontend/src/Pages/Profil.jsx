import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Yorum satırından çıkardık
import {
    User, Package, Heart, LogOut, MapPin,
    Bell, ChevronRight, X, Loader2,ArrowLeft
} from 'lucide-react';
import api from "../api";
import UserLayout from './UserLayout';

const Profil = () => {
    const navigate = useNavigate(); // Hook'u aktif ettik
    const [profilData, setProfilData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("siparisler");
    const [selectedSiparis, setSelectedSiparis] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const kullaniciId = JSON.parse(localStorage.getItem("user"))?.id;

    const fetchProfilData = async () => {
        try {
            const response = await api.get(`/Kullanicilar/profil/${kullaniciId}`);
            setProfilData(response.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (kullaniciId) fetchProfilData(); }, [kullaniciId]);

    // Çıkış Fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const detayGetir = async (id) => {
        try {
            const res = await api.get(`/Siparisler/${id}`);
            setSelectedSiparis(res.data);
            setIsModalOpen(true);
        } catch (err) { alert("Sipariş detayları yüklenemedi."); }
    };

    const siparisIptalEt = async (id) => {
        if (!window.confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) return;
        try {
            await api.put("/Siparisler/durum-guncelle", {
                siparisId: id,
                yeniDurum: "İptal Edildi"
            });
            alert("Sipariş iptal edildi.");
            setIsModalOpen(false);
            fetchProfilData();
        } catch (err) { alert("Hata: " + (err.response?.data || "İptal edilemedi")); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]"><Loader2 className="animate-spin text-amber-600" size={40} /></div>;

    return (
        <UserLayout>
            <div className="bg-[#F8F9FA] min-h-screen pt-10 pb-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                    {/* --- SOL MENÜ --- */}
                    <aside className="w-full lg:w-80 space-y-4">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={() => navigate("/")}
                                    className="flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-amber-50 transition-all">
                                        <ArrowLeft size={16} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500"></span>
                                </button>
                                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-black text-xl">
                                    {profilData?.adSoyad?.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 leading-tight">{profilData?.adSoyad}</h2>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Müşteri Profili</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 ml-2">Siparişlerim</p>

                                <MenuBtn active={activeTab === "siparisler"} onClick={() => setActiveTab("siparisler")} icon={<Package size={18} />} label="Tüm Siparişlerim" />
                                <MenuBtn active={activeTab === "favoriler"} onClick={() => setActiveTab("favoriler")} icon={<Heart size={18} />} label="Favorilerim" />

                                <div className="pt-6"></div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 ml-2">Hesabım & Yardım</p>

                                {/* BURASI DÜZELDİ: navigate fonksiyonunu onClick'e verdik */}
                                <MenuBtn
                                    onClick={() => navigate('/profil-guncelle')}
                                    icon={<User size={18} />}
                                    label="Kullanıcı Bilgilerim"
                                />

                                {/*<MenuBtn icon={<MapPin size={18} />} label="Adreslerim" />*/}
                                {/*<MenuBtn icon={<Bell size={18} />} label="Bildirimler" />*/}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-4 mt-8 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"
                                >
                                    <LogOut size={18} /> Çıkış Yap
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* --- SAĞ İÇERİK --- */}
                    <main className="flex-1">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[600px]">
                            <header className="flex justify-between items-center mb-8">
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                                    {activeTab === "siparisler" ? "Siparişlerim" : "Favorilerim"}
                                </h1>
                            </header>

                            {activeTab === "siparisler" ? (
                                <div className="space-y-4">
                                    {activeTab === "siparisler" ? (
                                        <div className="space-y-4">
                                            {profilData?.sonSiparisler?.length > 0 ? (
                                                profilData.sonSiparisler
                                                    .slice() // Orijinal veriyi bozmamak için kopyasını alıyoruz
                                                    .sort((a, b) => {
                                                        // 1. Durum Kontrolü (İptal edilenleri sona at)
                                                        if (a.durum === "İptal Edildi" && b.durum !== "İptal Edildi") return 1;
                                                        if (a.durum !== "İptal Edildi" && b.durum === "İptal Edildi") return -1;

                                                        // 2. Tarih Kontrolü (En yeni tarih en üstte)
                                                        return new Date(b.tarih) - new Date(a.tarih);
                                                    })
                                                    .map(s => (
                                                        <div key={s.siparisId} className="group border border-gray-50 rounded-[2rem] p-6 hover:border-amber-100 hover:shadow-md hover:shadow-amber-500/5 transition-all">
                                                            <div className="flex flex-wrap justify-between items-center gap-4">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                                                        <Package size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-black text-gray-900 text-base">#{s.siparisId}</span>
                                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${getDurumStyle(s.durum)}`}>
                                                                                {s.durum}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-400 font-medium mt-1">{new Date(s.tarih).toLocaleDateString('tr-TR')}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-right mr-2">
                                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tutar</p>
                                                                        <p className="font-black text-lg text-gray-900">₺{s.tutar?.toLocaleString('tr-TR')}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => detayGetir(s.siparisId)}
                                                                        className="h-12 px-6 bg-gray-950 text-white rounded-2xl font-bold text-xs hover:bg-amber-600 transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
                                                                    >
                                                                        Detay <ChevronRight size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="text-sm italic text-gray-400 text-center py-10">Henüz bir siparişiniz bulunmuyor.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-gray-400 text-center py-10">Henüz bir siparişiniz bulunmuyor.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                    <Heart size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                    <p className="text-sm italic font-medium text-gray-400">Henüz favori ürününüz bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* --- DETAY MODALI --- */}
            {isModalOpen && selectedSiparis && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase text-gray-950">Sipariş Detayı</h2>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Sipariş No: #{selectedSiparis.id}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 mb-8">
                            {selectedSiparis.detaylar?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <img src={`https://localhost:7126${item.urunResimUrl}`} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-white" alt="" />
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{item.urunAdi}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{item.adet} Adet x ₺{item.birimFiyat}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900">₺{item.araToplam}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-between items-end gap-6 pt-6 border-t-2 border-dashed border-gray-100">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sipariş Durumu</p>
                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDurumStyle(selectedSiparis.durum)}`}>
                                    {selectedSiparis.durum}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Toplam Tutar</p>
                                <p className="text-4xl font-black text-amber-600 tracking-tighter">₺{selectedSiparis.toplamTutar?.toLocaleString('tr-TR')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                            {(selectedSiparis.durum === "Alındı" || selectedSiparis.durum === "Hazırlanıyor") && (
                                <button
                                    onClick={() => siparisIptalEt(selectedSiparis.id)}
                                    className="py-4 px-6 bg-red-50 text-red-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-100 transition-all border border-red-100"
                                >
                                    Siparişi İptal Et
                                </button>
                            )}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className={`py-4 px-6 bg-gray-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl shadow-gray-200 ${!(selectedSiparis.durum === "Alındı" || selectedSiparis.durum === "Hazırlanıyor") ? "col-span-2" : ""}`}
                            >
                                Pencereyi Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

// Alt Bileşen
const MenuBtn = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${active ? "bg-amber-50 text-amber-600 shadow-sm shadow-amber-500/10" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
    >
        {icon} {label}
    </button>
);

const getDurumStyle = (durum) => {
    switch (durum) {
        case "Alındı": return "bg-yellow-50 text-yellow-600 border-yellow-100";
        case "Hazırlanıyor": return "bg-blue-50 text-blue-600 border-blue-100";
        case "Kargoya Verildi": return "bg-purple-50 text-purple-600 border-purple-100";
        case "Tamamlandı": return "bg-green-50 text-green-600 border-green-100";
        case "İptal Edildi": return "bg-red-50 text-red-600 border-red-100";
        default: return "bg-gray-50 text-gray-400 border-gray-100";
    }
};

export default Profil;