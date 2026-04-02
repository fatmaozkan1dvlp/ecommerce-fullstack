import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { Trash2, UserCheck, UserPlus, DollarSign, ShoppingBag, Search } from 'lucide-react';

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
            return { toplamMusteri: 0, yeniKayit: 0 };
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border dark:border-gray-700">
                    <div className="w-full">
                        {tumKullanicilar === null ? (
                            <div className="text-center py-20 text-gray-400 italic">Veriler yükleniyor...</div>
                        ) : (
                            <div className="w-full">
                                <div className="hidden md:grid grid-cols-4 bg-gray-50/50 dark:bg-gray-900/20 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700 px-8 py-5 font-bold">
                                    <div>Müşteri</div>
                                    <div className="text-center">Sipariş</div>
                                    <div className="text-center">Toplam Harcama</div>
                                    <div className="text-center">Kayıt Tarihi</div>
                                </div>

                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {gorunurListe.length > 0 ? (
                                        gorunurListe.map(k => (
                                            <div key={k.id || k.ID} className="grid grid-cols-1 md:grid-cols-4 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors px-6 py-4 md:px-8 md:py-5 items-center gap-4">

                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Müşteri</span>
                                                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{k.adSoyad}</span>
                                                    <span className="text-xs text-gray-400">{k.eMail}</span>
                                                </div>

                                                <div className="flex flex-col md:items-center">
                                                    <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Sipariş</span>
                                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 w-fit">
                                                        {k.siparisSayisi || 0} Adet
                                                    </span>
                                                </div>

                                                <div className="flex flex-col md:items-center">
                                                    <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Toplam Harcama</span>
                                                    <span className="font-black text-green-600 text-sm">
                                                        {(k.toplamHarcama || 0).toLocaleString('tr-TR')} ₺
                                                    </span>
                                                </div>

                                                <div className="flex flex-col md:items-center">
                                                    <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Kayıt Tarihi</span>
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {k.olusturmaT ? new Date(k.olusturmaT).toLocaleDateString('tr-TR') : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-8 py-20 text-center text-gray-400">
                                            <Search size={40} className="mx-auto mb-3 opacity-20" />
                                            <p className="italic">Müşteri bulunamadı.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Musteriler;