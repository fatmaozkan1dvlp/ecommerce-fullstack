//MÜŞTERİLERİN KAÇ SİPARİŞ VERDİKLERİ TOPLAM TUTARLARI DA GÖZÜKECEK ONU YAP!!





import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, UserCheck, UserPlus } from 'lucide-react';

const Musteriler = () => {
    const [tumKullanicilar, setTumKullanicilar] = useState(null);
    const [gorunurAdet] = useState(10);

    useEffect(() => {
        const verileriGetir = async () => {
            try {
                const response = await api.get("/Kullanicilar");
                const sirali = response.data.sort((a, b) =>
                    new Date(b.olusturmaT) - new Date(a.olusturmaT)
                );
                setTumKullanicilar(sirali);
            } catch (error) {
                console.error("Müşteri veri hatası:", error);
                setTumKullanicilar([]);
            }
        };

        verileriGetir();
    }, []);

    const istatistikler = useMemo(() => {
        if (!tumKullanicilar) return { toplam: null, sonAy: null };
        const toplam = tumKullanicilar.length;
        const birAyOnce = new Date();
        birAyOnce.setMonth(birAyOnce.getMonth() - 1);
        const sonAy = tumKullanicilar.filter(k => new Date(k.olusturmaT) >= birAyOnce).length;
        return { toplam, sonAy };
    }, [tumKullanicilar]);

    const gorunurListe = tumKullanicilar ? tumKullanicilar.slice(0, gorunurAdet) : [];
    return (
        <AdminLayout>
            <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Toplam Kayıt</p>
                            <h3 className="text-3xl font-black">
                                {istatistikler.toplam === null ? (
                                    <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                                ) : istatistikler.toplam}
                            </h3>
                        </div>
                        <UserCheck size={32} className="text-blue-500" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Yeni Kayıtlar</p>
                            <h3 className="text-3xl font-black text-green-600">
                                {istatistikler.sonAy === null ? (
                                    <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                                ) : istatistikler.sonAy}
                            </h3>
                        </div>
                        <UserPlus size={32} className="text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    <div className="overflow-x-auto p-4">
                        {tumKullanicilar === null ? (
                            <div className="text-center py-10 animate-pulse">Yükleniyor...</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-xs uppercase border-b dark:border-gray-700">
                                        <th className="px-4 py-4">Müşteri</th>
                                        <th className="px-4 py-4">E-Posta</th>
                                        <th className="px-4 py-4 text-center">Tarih</th>
                                        <th className="px-4 py-4 text-center">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gorunurListe.map(k => (
                                        <tr key={k.id || k.iD} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                                            <td className="px-4 py-4 font-bold">{k.adSoyad}</td>
                                            <td className="px-4 py-4 text-sm">{k.eMail}</td>
                                            <td className="px-4 py-4 text-center text-xs">{new Date(k.olusturmaT).toLocaleDateString('tr-TR')}</td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex justify-center space-x-2">  
                                                    <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all shadow-sm">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Musteriler;