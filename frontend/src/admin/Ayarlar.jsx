import { useState, useEffect } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { User, ShieldCheck, RefreshCcw } from 'lucide-react';

const Ayarlar = () => {
    // 1. Veriyi çekme mantığını daha güvenli hale getirdik
    const getAdminData = () => {
        const adminJson = sessionStorage.getItem("adminUser");
        return adminJson ? JSON.parse(adminJson) : null;
    };

    const [admin, setAdmin] = useState(getAdminData() || {});
    const [loading, setLoading] = useState(false);

    // 2. Form state'i
    const [formData, setFormData] = useState({
        adSoyad: admin?.adSoyad || "",
        eMail: admin?.eMail || "",
        sifre: ""
    });

    // Sayfa içindeki admin state'i değiştikçe formu da güncelle (Sync)
    useEffect(() => {
        const currentAdmin = getAdminData();
        if (currentAdmin) {
            setAdmin(currentAdmin);
            setFormData(prev => ({
                ...prev,
                adSoyad: currentAdmin.adSoyad,
                eMail: currentAdmin.eMail
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Backend'den gelen input name'leri (AdSoyad, EMail) 
        // state'teki (adSoyad, eMail) ile eşleştiriyoruz
        const stateName = name.charAt(0).toLowerCase() + name.slice(1);

        setFormData((prev) => ({
            ...prev,
            [stateName]: value
        }));
    };

    const handleGuncelle = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const userId = admin.id || admin.Id; // İki ihtimali de kontrol et

            if (!userId) {
                alert("Kullanıcı ID bulunamadı!");
                return;
            }

            const guncellenecekVeri = {
                adSoyad: formData.adSoyad,
                eMail: formData.eMail,
                sifre: formData.sifre.trim() === "" ? null : formData.sifre
            };

            // API İsteği
            await api.put(`/Kullanicilar/profil-guncelle/${userId}`, guncellenecekVeri);

            // 3. Mevcut admin objesini bozmadan güncelle
            const updatedAdmin = {
                ...admin,
                adSoyad: guncellenecekVeri.adSoyad,
                eMail: guncellenecekVeri.eMail
            };

            // Hem state'i hem storage'ı güncelle (Anlık yansıma sağlar)
            setAdmin(updatedAdmin);
            sessionStorage.setItem("adminUser", JSON.stringify(updatedAdmin));

            // Şifre alanını temizle
            setFormData(prev => ({ ...prev, sifre: "" }));

            alert("Bilgileriniz başarıyla güncellendi! ✅");

            // Opsiyonel: Sayfayı yenilemeden verilerin her yerde güncellenmesi için 
            // window.dispatchEvent(new Event("storage")); // Eğer başka bileşenler de dinliyorsa

        } catch (err) {
            console.error("Güncelleme Hatası:", err);
            const mesaj = err.response?.data?.message || "Güncelleme başarısız!";
            alert(mesaj);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="text-2xl font-black mb-8 dark:text-white uppercase tracking-tight flex items-center gap-2 italic">
                        <RefreshCcw className={`text-blue-500 ${loading ? 'animate-spin' : ''}`} /> Profil Ayarları
                    </h2>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border dark:border-gray-700">
                        <form onSubmit={handleGuncelle} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2 tracking-widest">Ad Soyad</label>
                                <input
                                    type="text"
                                    name="AdSoyad" // handleChange içindeki stateName ile eşleşir
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-bold"
                                    value={formData.adSoyad}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2 tracking-widest">E-Posta</label>
                                <input
                                    type="email"
                                    name="EMail"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-bold text-blue-600"
                                    value={formData.eMail}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2 tracking-widest">Yeni Şifre (Güvenlik)</label>
                                <input
                                    type="password"
                                    name="Sifre"
                                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:text-white font-bold"
                                    value={formData.sifre}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 uppercase tracking-widest text-sm italic"
                            >
                                {loading ? "İşleniyor..." : "DEĞİŞİKLİKLERİ UYGULA"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sağ Taraf: Mevcut Kart Görünümü */}
                <div className="w-full lg:w-80">
                    <h2 className="text-2xl font-black mb-8 dark:text-white uppercase tracking-tight italic">Kimlik</h2>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

                        <div className="relative z-10 space-y-5">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner">
                                <User size={28} />
                            </div>

                            <div>
                                <p className="text-blue-200 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Yetkili Personel</p>
                                <h3 className="text-xl font-black truncate tracking-tight uppercase">
                                    {admin.adSoyad || "Yükleniyor..."}
                                </h3>
                            </div>

                            <div>
                                <p className="text-blue-200 text-[9px] font-black uppercase tracking-[0.2em] mb-1">İletişim Kanalı</p>
                                <p className="text-sm font-bold opacity-90 truncate italic underline decoration-blue-400">
                                    {admin.eMail || "mail@admin.com"}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-white/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-green-400" />
                                    <span className="text-[10px] font-black uppercase italic tracking-widest text-green-400">AKTİF</span>
                                </div>
                                <span className="text-[10px] font-black bg-black/20 px-3 py-1 rounded-lg">
                                    {admin.rol || "ADMIN"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Ayarlar;