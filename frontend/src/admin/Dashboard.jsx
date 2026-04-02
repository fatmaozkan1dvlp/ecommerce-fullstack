import { useEffect, useState } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { ShoppingCart, DollarSign, Package, Clock, ChevronRight } from 'lucide-react';

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
        { id: 1, baslik: 'Toplam Kazanç', deger: `₺${ozet?.toplamKazanc?.toLocaleString('tr-TR') || 0}`, ikon: <DollarSign size={20} />, renk: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { id: 2, baslik: 'Toplam Sipariş', deger: ozet?.toplamSiparis?.toString() || '0', ikon: <ShoppingCart size={20} />, renk: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 3, baslik: 'Aktif Ürünler', deger: ozet?.aktifUrunSayisi?.toString() || '0', ikon: <Package size={20} />, renk: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    ];

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 pb-10">
                <h2 className="text-xl md:text-2xl font-black dark:text-white uppercase tracking-tight">Genel Bakış</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {istatistikler.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-[10px] md:text-xs text-gray-400 font-black uppercase tracking-widest mb-1">{item.baslik}</p>
                                    <h3 className="text-xl md:text-2xl font-black dark:text-white truncate">
                                        {ozet === null ? (
                                            <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                                        ) : item.deger}
                                    </h3>
                                </div>
                                <div className={`${item.renk} ${item.bg} p-3 md:p-4 rounded-2xl flex-shrink-0`}>
                                    {item.ikon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border dark:border-gray-700 overflow-hidden">
                    <div className="p-5 md:p-6 border-b dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-sm md:text-lg font-black dark:text-white flex items-center uppercase tracking-tight">
                            <Clock size={20} className="mr-2 text-blue-500" /> Son Siparişler
                        </h3>
                        <span className="text-[9px] md:text-xs text-gray-400 font-bold uppercase tracking-widest hidden xs:block">Son 5 İşlem</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/40 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-4 md:px-8 py-4">Müşteri</th>
                                    <th className="px-4 md:px-8 py-4 hidden sm:table-cell">Tarih</th>
                                    <th className="px-4 md:px-8 py-4">Durum</th>
                                    <th className="px-4 md:px-8 py-4 text-right">Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {ozet === null ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center animate-pulse text-gray-400 font-bold uppercase text-xs">Veriler yükleniyor...</td></tr>
                                ) : ozet.sonBesSiparis.length > 0 ? (
                                    ozet.sonBesSiparis.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group">
                                            <td className="px-4 md:px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-[10px] flex-shrink-0 border dark:border-blue-800">
                                                        {s.musteriAdi.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-xs md:text-sm dark:text-gray-200 truncate">{s.musteriAdi}</span>
                                                        <span className="text-[9px] text-gray-400 sm:hidden">{new Date(s.siparisTarihi).toLocaleDateString('tr-TR')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 text-xs md:text-sm text-gray-500 font-medium hidden sm:table-cell">
                                                {new Date(s.siparisTarihi).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-4 md:px-8 py-4">
                                                <span className={`inline-block px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-tighter ${s.durum === 'Tamamlandı' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                                                        s.durum === 'İptal Edildi' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                                                            'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                                                    }`}>
                                                    {s.durum}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 text-right font-black text-xs md:text-sm dark:text-white">
                                                ₺{s.toplamTutar.toLocaleString('tr-TR')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic opacity-50">Henüz sipariş bulunmuyor</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;