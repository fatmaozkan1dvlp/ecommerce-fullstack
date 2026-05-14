import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'
import {
    User, Mail, Phone, MapPin, Lock, Save,
    ArrowLeft, Loader2, CheckCircle2, ShieldCheck, AlertCircle
} from 'lucide-react';
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/Kullanicilar/profil`);

                const d = response.data;

                setFormData({
                    adSoyad: d.adSoyad || "",
                    eMail: d.eMail || "",
                    telefon: d.telefon || "",
                    sehir: d.sehir || "",
                    tamAdres: d.tamAdres || "",
                    sifre: ""
                });

            } catch (err) {
                console.error("Profil bilgileri alınamadı", err);
            } finally {
                setFetching(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const updateData = {
            adSoyad: formData.adSoyad,
            telefon: formData.telefon,
            sehir: formData.sehir,
            tamAdres: formData.tamAdres
        };

        if (formData.sifre && formData.sifre.trim() !== "") {
            updateData.sifre = formData.sifre;
        }

        try {
            await api.put(`/Kullanicilar/profil`, updateData);

            setMessage({
                type: "success",
                text: "Bilgileriniz başarıyla güncellendi!"
            });

            

            setTimeout(() => navigate("/profil"), 1500);
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.mesaj || "Güncelleme başarısız."
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <Loader2 className="animate-spin text-amber-600" size={40} />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Profil Güncelle | DECO.STUDIO</title>
            </Helmet>
            <div className="bg-[#F8F9FA] min-h-screen pt-10 pb-20 px-4">
                <div className="max-w-5xl mx-auto">

                    <div className="flex mb-8">
                        <button
                            onClick={() => navigate("/profil")}
                            className="flex items-center gap-2 text-gray-400 hover:text-amber-600"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-[10px] font-black uppercase">Geri Dön</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12">


                            <div className="lg:col-span-4 bg-gray-50/50 p-10 border-r">
                                <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white mb-6">
                                    <ShieldCheck size={28} />
                                </div>

                                <p className="text-gray-400 text-[11px] font-bold uppercase">
                                    Profil bilgilerini güncelle
                                </p>
                            </div>

                            <div className="lg:col-span-8 p-8 md:p-12">

                                {message.text && (
                                    <div className={`mb-6 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold ${message.type === "success"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-red-50 text-red-600"
                                        }`}>
                                        {message.type === "success"
                                            ? <CheckCircle2 size={16} />
                                            : <AlertCircle size={16} />
                                        }
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">

                                    <div className="grid md:grid-cols-2 gap-5">

                                        <InputBox label="Ad Soyad" icon={<User size={18} />}>
                                            <input
                                                value={formData.adSoyad}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, adSoyad: e.target.value })
                                                }
                                                className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold"
                                                required
                                            />
                                        </InputBox>

                                        <InputBox label="E-Posta" icon={<Mail size={18} />}>
                                            <input
                                                type="email"
                                                value={formData.eMail}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, eMail: e.target.value })
                                                }
                                                className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold"
                                                required
                                            />
                                        </InputBox>

                                        <InputBox label="Telefon" icon={<Phone size={18} />}>
                                            <input
                                                value={formData.telefon}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        telefon: e.target.value.replace(/\D/g, "")
                                                    })
                                                }
                                                maxLength={11}
                                                className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold"
                                            />
                                        </InputBox>

                                        <InputBox label="Şehir" icon={<MapPin size={18} />}>
                                            <input
                                                value={formData.sehir}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, sehir: e.target.value })
                                                }
                                                className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold"
                                            />
                                        </InputBox>

                                    </div>

                                    <textarea
                                        rows="3"
                                        value={formData.tamAdres}
                                        onChange={(e) =>
                                            setFormData({ ...formData, tamAdres: e.target.value })
                                        }
                                        className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold"
                                        placeholder="Adres"
                                    />

                                    <InputBox label="Şifre (opsiyonel)" icon={<Lock size={18} />}>
                                        <input
                                            type="password"
                                            value={formData.sifre}
                                            onChange={(e) =>
                                                setFormData({ ...formData, sifre: e.target.value })
                                            }
                                            className="w-full bg-amber-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold"
                                        />
                                    </InputBox>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                        Kaydet
                                    </button>

                                </form>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

const InputBox = ({ label, icon, children }) => (
    <div>
        <label className="text-[10px] font-black uppercase text-gray-400">
            {label}
        </label>
        <div className="relative mt-2">
            <div className="absolute left-4 top-3 text-gray-400">
                {icon}
            </div>
            {children}
        </div>
    </div>
);

export default ProfilGuncelle;