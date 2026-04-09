import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import UserLayout from './UserLayout';

const ProfilGuncelle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        adSoyad: "",
        eMail: "",
        telefon: "",
        sehir: "",
        tamAdres: "",
        sifre: ""
    });

    const kullaniciId = JSON.parse(localStorage.getItem("user"))?.id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/Kullanicilar/profil/${kullaniciId}`);
                const d = response.data;
                setFormData({
                    adSoyad: d.adSoyad,
                    eMail: d.eMail,
                    telefon: d.telefon || "",
                    sehir: d.sehir || "",
                    tamAdres: d.tamAdres || "",
                    sifre: ""
                });
            } catch (err) {
                console.error("Bilgiler getirilemedi", err);
            } finally {
                setFetching(false);
            }
        };
        fetchUserData();
    }, [kullaniciId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        const updateData = { ...formData };

        if (!updateData.sifre || updateData.sifre.trim() === "") {
            delete updateData.sifre;
        }


        try {
            await api.put(`/Kullanicilar/profil-guncelle/${kullaniciId}`, updateData);
            setMessage({ type: "success", text: "Bilgileriniz başarıyla güncellendi!" });

            const currentUser = JSON.parse(localStorage.getItem("user"));
            localStorage.setItem("user", JSON.stringify({ ...currentUser, adSoyad: formData.adSoyad }));

            setTimeout(() => navigate("/profil"), 2000);
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.mesaj || "Güncelleme sırasında bir hata oluştu." });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
            <Loader2 className="animate-spin text-amber-600" size={40} />
        </div>
    );

    return (
        <UserLayout>
            <div className="bg-[#F8F9FA] min-h-screen pt-10 pb-20 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Üst Navigasyon */}
                    <div className="flex mb-8">
                        <button
                            onClick={() => navigate("/profil")}
                            className="flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-amber-50 transition-all">
                                <ArrowLeft size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Geri Dön</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12">

                            {/* Sol Panel */}
                            <div className="lg:col-span-4 bg-gray-50/50 p-10 border-r border-gray-100 flex flex-col">
                                <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-200">
                                    <ShieldCheck size={28} />
                                </div>
                                
                                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider leading-relaxed mb-auto">
                                    Profil bilgilerini ve şifreni buradan güncelleyebilirsin.
                                </p>

                            </div>

                            {/* Sağ Form Alanı */}
                            <div className="lg:col-span-8 p-8 md:p-12">
                                {message.text && (
                                    <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border transition-all ${message.type === "success" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                                        }`}>
                                        {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Inputlar */}
                                        <InputBox label="Ad Soyad" icon={<User size={18} />}>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-gray-300"
                                                value={formData.adSoyad}
                                                onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
                                                required
                                            />
                                        </InputBox>

                                        <InputBox label="E-Posta" icon={<Mail size={18} />}>
                                            <input
                                                type="email"
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-gray-300"
                                                value={formData.eMail}
                                                onChange={(e) => setFormData({ ...formData, eMail: e.target.value })}
                                                required
                                            />
                                        </InputBox>

                                        <InputBox label="Telefon" icon={<Phone size={18} />}>
                                            <input
                                                type="text"
                                                maxLength={11} 
                                                placeholder="05xxxxxxxxx"
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-gray-300"
                                                value={formData.telefon}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    setFormData({ ...formData, telefon: value });
                                                }}
                                            />
                                        </InputBox>

                                        <InputBox label="Şehir" icon={<MapPin size={18} />}>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-gray-300"
                                                value={formData.sehir}
                                                onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
                                            />
                                        </InputBox>
                                    </div>

                                    {/* Adres */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tam Adres</label>
                                        <textarea
                                            rows="3"
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all resize-none placeholder:text-gray-300"
                                            value={formData.tamAdres}
                                            onChange={(e) => setFormData({ ...formData, tamAdres: e.target.value })}
                                            placeholder="Adres detaylarını buraya girin..."
                                        />
                                    </div>

                                    {/* Şifre Değiştirme */}
                                    <div className="pt-4 mt-2">
                                        <InputBox label="Şifreyi Güncelle (Opsiyonel)" icon={<Lock size={18} />} highlight>
                                            <input
                                                type="password"
                                                className="w-full bg-amber-50/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-amber-900/30"
                                                value={formData.sifre}
                                                onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
                                                placeholder="Yeni şifre"
                                            />
                                        </InputBox>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 bg-gray-950 hover:bg-amber-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-gray-100"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Değişiklikleri Kaydet
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

// Alt bileşen: Tailwind sınıflarıyla sarmalanmış input grubu
const InputBox = ({ label, icon, children, highlight }) => (
    <div className="space-y-2 relative">
        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${highlight ? 'text-amber-600' : 'text-gray-400'}`}>
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {icon}
            </div>
            {children}
        </div>
    </div>
);

export default ProfilGuncelle;