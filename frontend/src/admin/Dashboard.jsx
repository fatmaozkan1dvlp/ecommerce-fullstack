import { useEffect, useState } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { ShoppingCart, Users, DollarSign, Package, Clock } from 'lucide-react';

const Dashboard = () => {
    const [ozet, setOzet] = useState(null);

    useEffect(() => {

        const veriGetir = async () => {
            try {
                const res = await api.get("/Siparisler/dashboard-ozet"); 
                setOzet(res.data);
            } catch (err) {
                console.error("Dashboard özeti çekilirken hata:", err);
                setOzet({ toplamKazanc: 0, toplamSiparis: 0, aktifUrunSayisi: 0, sonBesSiparis: [] });
            }
        };

        veriGetir();
    }, []);

    const istatistikler = [
        { id: 1, baslik: 'Toplam Kazanç', deger: `₺${ozet?.toplamKazanc?.toLocaleString('tr-TR') || 0}`, ikon: <DollarSign />, renk: 'text-green-600' },
        { id: 2, baslik: 'Toplam Sipariş', deger: ozet?.toplamSiparis?.toString() || '0', ikon: <ShoppingCart />, renk: 'text-blue-600' },
        { id: 3, baslik: 'Aktif Ürünler', deger: ozet?.aktifUrunSayisi?.toString() || '0', ikon: <Package />, renk: 'text-orange-600' },
        { id: 4, baslik: 'Bekleyen Görev', deger: '3', ikon: <Clock />, renk: 'text-purple-600' },
    ];

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Genel Bakış</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {istatistikler.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">{item.baslik}</p>
                                <h3 className="text-2xl font-black mt-1 dark:text-white">
                                    {ozet === null ? (
                                        <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                                    ) : item.deger}
                                </h3>
                            </div>
                            <div className={`${item.renk} p-3 bg-gray-50 dark:bg-gray-700 rounded-xl`}>
                                {item.ikon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700">
                    <h3 className="text-lg font-bold dark:text-white flex items-center">
                        <Clock size={20} className="mr-2 text-blue-500" /> Son Siparişler
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-400 text-[10px] uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Müşteri</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4">Sipariş Durumu</th>
                                <th className="px-6 py-4 ">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {ozet === null ? (
                                <tr><td colSpan="3" className="px-6 py-10 text-center animate-pulse text-gray-400">Veriler yükleniyor...</td></tr>
                            ) : ozet.sonBesSiparis.length > 0 ? (
                                ozet.sonBesSiparis.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
                                        <td className="px-6 py-4 font-medium dark:text-gray-200"> Müşteri Kaydı</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(s.siparisTarihi).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-4 text-right font-bold text-blue-600">₺{s.toplamTutar}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">Henüz sipariş bulunmuyor.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;