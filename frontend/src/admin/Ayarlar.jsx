import { useState } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { User, ShieldCheck, RefreshCcw } from 'lucide-react';

const Ayarlar = () => {
    // 1. Kullanıcıyı al ve konsola yazdır (Sorunu anlamak için F12 Console'a bak!)
    const userJson = localStorage.getItem("user");
    const initialUser = userJson ? JSON.parse(userJson) : {};
    console.log("LocalStorage Verisi:", initialUser);

    // 2. State'leri her türlü harf ihtimaline karşı sağlama alıyoruz
    const [formData, setFormData] = useState({
        adSoyad: initialUser.AdSoyad || initialUser.adSoyad || initialUser.name || '',
        // Burası kritik: EMail, eMail veya email... Hangisi varsa onu alacak
        eMail: initialUser.EMail || initialUser.eMail || initialUser.email || '',
        sifre: ''
    });

    const [displayUser, setDisplayUser] = useState(initialUser);

    const handleGuncelle = async (e) => {
        e.preventDefault();
        try {
            const userId = displayUser.ID || displayUser.Id || displayUser.id;

            const guncellenecekVeri = {
                adSoyad: formData.adSoyad,
                eMail: formData.eMail, // Senin DTO'daki property ismiyle aynı olmalı
                sifre: formData.sifre === "" ? null : formData.sifre
            };

            await api.put(`/Kullanicilar/profil-guncelle/${userId}`, guncellenecekVeri);

            // Başarılı olursa hem ekranı hem hafızayı tazele
            const updated = { ...displayUser, ...guncellenecekVeri };
            localStorage.setItem("user", JSON.stringify(updated));
            setDisplayUser(updated);
            setFormData(prev => ({ ...prev, sifre: '' }));

            alert("Bilgileriniz başarıyla güncellendi! ✅");
        } catch (err) {
            console.error("Hata detayı:", err.response?.data);
            alert("Güncelleme başarısız!");
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* SOL FORM */}
                <div className="flex-1">
                    <h2 className="text-2xl font-black mb-8 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <RefreshCcw className="text-blue-500" /> Profilini Düzenle
                    </h2>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border dark:border-gray-700">
                        <form onSubmit={handleGuncelle} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-2">Ad Soyad</label>
                                <input
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    value={formData.adSoyad}
                                    onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-2">E-Posta</label>
                                <input
                                    type="email"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    value={formData.eMail}
                                    onChange={(e) => setFormData({ ...formData, eMail: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-2">Yeni Şifre (İsteğe Bağlı)</label>
                                <input
                                    type="password"
                                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    value={formData.sifre}
                                    onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                GÜNCELLEMELERİ KAYDET
                            </button>
                        </form>
                    </div>
                </div>

                {/* SAĞ KART */}
                <div className="w-full lg:w-80">
                    <h2 className="text-2xl font-black mb-8 dark:text-white uppercase tracking-tight">Mevcut Profil</h2>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <User size={32} />
                            </div>
                            <div>
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-70">Yönetici Adı</p>
                                <h3 className="text-xl font-black truncate">
                                    {displayUser.AdSoyad || displayUser.adSoyad || displayUser.name}
                                </h3>
                            </div>
                            <div>
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-70">E-Posta Adresi</p>
                                <p className="text-sm font-medium opacity-90 truncate italic">
                                    {displayUser.EMail || displayUser.eMail || displayUser.email}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-green-400" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Yetki: {displayUser.Rol || displayUser.rol}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Ayarlar;