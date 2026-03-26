import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, UserCheck, UserPlus, DollarSign, ShoppingBag } from 'lucide-react';

const Musteriler = () => {
    const [tumKullanicilar, setTumKullanicilar] = useState(null);
    const [gorunurAdet] = useState(10);

    useEffect(() => {
        const verileriGetir = async () => {
            try {
                const response = await api.get("/Kullanicilar");
                const veri = Array.isArray(response.data) ? response.data : [];
                const sirali = veri.sort((a, b) =>
                    new Date(b.olusturmaT || 0) - new Date(a.olusturmaT || 0)
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
        if (!tumKullanicilar || tumKullanicilar.length === 0) {
            return { toplamMusteri: 0, yeniKayit: 0};
        }

        const simdi = new Date();
        const birAyOnce = new Date();
        birAyOnce.setMonth(simdi.getMonth() - 1);

        const toplamMusteri = tumKullanicilar.length;
        const yeniKayit = tumKullanicilar.filter(k => new Date(k.olusturmaT) >= birAyOnce).length;

        return {
            toplamMusteri,
            yeniKayit,
            
        };
    }, [tumKullanicilar]);

    const gorunurListe = tumKullanicilar ? tumKullanicilar.slice(0, gorunurAdet) : [];

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* İstatistik Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Toplam Müşteri</p>
                                <h3 className="text-2xl font-black">{istatistikler.toplamMusteri}</h3>
                            </div>
                            <UserCheck className="text-blue-500" size={24} />
                        </div>
                    </div>

                   

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Yeni Kayıt (30 Gün)</p>
                                <h3 className="text-2xl font-black text-orange-500">{istatistikler.yeniKayit}</h3>
                            </div>
                            <UserPlus className="text-orange-500" size={24} />
                        </div>
                    </div>

                   
                </div>

                {/* Tablo */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    <div className="overflow-x-auto p-4">
                        {tumKullanicilar === null ? (
                            <div className="text-center py-10">Veriler yükleniyor...</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-xs uppercase border-b dark:border-gray-700">
                                        <th className="px-4 py-4">Müşteri</th>
                                        <th className="px-4 py-4 text-center">Sipariş</th>
                                        <th className="px-4 py-4 text-center">Toplam Harcama</th>
                                        <th className="px-4 py-4 text-center">Kayıt Tarihi</th>
                                        {/*<th className="px-4 py-4 text-center">İşlem</th>*/}
                                    </tr>
                                </thead>
                                <tbody>
                                    {gorunurListe.map(k => (
                                        <tr key={k.id || k.ID} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 dark:text-gray-200">{k.adSoyad}</span>
                                                    <span className="text-xs text-gray-400">{k.eMail}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                                    {k.siparisSayisi || 0} Adet
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center font-black text-green-600">
                                                {(k.toplamHarcama || 0).toLocaleString('tr-TR')} ₺
                                            </td>
                                            <td className="px-4 py-4 text-center text-xs text-gray-500">
                                                {k.olusturmaT ? new Date(k.olusturmaT).toLocaleDateString('tr-TR') : '-'}
                                            </td>
                                            {/*<td className="px-4 py-4 text-center">*/}
                                            {/*    <button className="p-2 text-gray-300 hover:text-red-600 transition-all">*/}
                                            {/*        <Trash2 size={18} />*/}
                                            {/*    </button>*/}
                                            {/*</td>*/}
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