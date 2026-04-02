import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import AdminLayout from './AdminLayout';
import { Package, Eye, Search } from 'lucide-react';

const Siparisler = () => {
    const { durum } = useParams();
    const [siparisler, setSiparisler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSiparis, setSelectedSiparis] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const detayGetir = async (id) => {
        try {
            const res = await api.get(`/Siparisler/${id}`);
            setSelectedSiparis(res.data);
            setIsModalOpen(true);
            console.log("Gelen Veri:", res.data);
        } catch (err) {
            console.error(err);
            alert("Detaylar yüklenemedi");
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/Siparisler/duruma-gore?durum=${durum}`);
            setSiparisler(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    },[durum]);

    useEffect(() => {
        fetchData();
    },[fetchData]);

    const durumGuncelle = async (id, yeniDurum) => {
        const mevcutSiparis = siparisler.find(s => s.id === id);

        if (mevcutSiparis?.durum === "Tamamlandı" || mevcutSiparis?.durum === "İptal Edildi") {
            alert("Tamamlanmış veya iptal edilmiş bir siparişin durumu değiştirilemez.");
            return;
        }

        try {
            await api.put("/Siparisler/durum-guncelle", {
                siparisId: id,
                yeniDurum
            });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Durum güncellenemedi");
        }
    };

    const getDurumStyle = (durum) => {
        switch (durum) {
            case "Alındı": return "bg-yellow-100 text-yellow-700";
            case "Hazırlanıyor": return "bg-blue-100 text-blue-700";
            case "Kargoya Verildi": return "bg-purple-100 text-purple-700";
            case "Tamamlandı": return "bg-green-100 text-green-700";
            case "İptal Edildi": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Package className="text-blue-600" size={28} />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {durum} Siparişler
                        </h1>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border dark:border-gray-700">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            <span className="text-gray-400 text-sm italic">Siparişler yükleniyor...</span>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="hidden md:grid grid-cols-5 bg-gray-50/50 dark:bg-gray-900/20 text-gray-400 text-[10px] uppercase tracking-widest border-b dark:border-gray-700 px-8 py-5 font-bold">
                                <div>Sipariş No</div>
                                <div>Tarih</div>
                                <div className="text-right">Tutar</div>
                                <div className="text-center">Durum</div>
                                <div className="text-center">İşlem</div>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {siparisler.length > 0 ? (
                                    siparisler.map((s) => (
                                        <div key={s.id} className="grid grid-cols-1 md:grid-cols-5 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors px-6 py-4 md:px-8 md:py-5 items-center gap-4">

                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Sipariş No</span>
                                                <span className="font-bold text-blue-600">#{s.id}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Tarih</span>
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {new Date(s.siparisTarihi).toLocaleString('tr-TR')}
                                                </span>
                                            </div>

                                            <div className="flex flex-col md:text-right">
                                                <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Tutar</span>
                                                <span className="font-bold text-gray-800 dark:text-white text-base">
                                                    {s.toplamTutar.toLocaleString('tr-TR')} ₺
                                                </span>
                                            </div>

                                            <div className="flex flex-col md:items-center">
                                                <span className="text-[10px] uppercase text-gray-400 md:hidden mb-1 tracking-wider">Durum</span>
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight w-fit ${getDurumStyle(s.durum)}`}>
                                                    {s.durum}
                                                </span>
                                            </div>

                                            <div className="flex flex-col md:items-center">
                                                <span className="text-[10px] uppercase text-gray-400 md:hidden mb-2 tracking-wider">İşlemler</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => detayGetir(s.id)}
                                                        className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                        title="Detayları Gör"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    {s.durum !== "Tamamlandı" && s.durum !== "İptal Edildi" ? (
                                                        <select
                                                            onChange={(e) => durumGuncelle(s.id, e.target.value)}
                                                            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-2 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
                                                            value=""
                                                        >
                                                            <option value="" disabled>DURUM DEĞİŞTİR</option>
                                                            {s.durum !== "Alındı" && s.durum !== "Hazırlanıyor" && s.durum !== "Kargoya Verildi"&& <option value="Alındı">Alındı</option>}
                                                            {s.durum !== "Hazırlanıyor" && s.durum !== "Kargoya Verildi" &&<option value="Hazırlanıyor">Hazırlanıyor</option>}
                                                            {s.durum !== "Kargoya Verildi" && <option value="Kargoya Verildi">Kargoya Verildi</option>}
                                                            {s.durum!== "Tamamlandı" &&<option value="Tamamlandı">Tamamlandı ✅</option>}
                                                            {s.durum !== "İptal Edildi" && <option value="İptal Edildi">İptal Et ❌</option>}
                                                        </select>
                                                    ) : ("")}

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-8 py-20 text-center text-gray-400">
                                        <Search size={40} className="mx-auto mb-3 opacity-20" />
                                        <p className="italic">Sipariş bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && selectedSiparis && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl border dark:border-gray-700 overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Sipariş #{selectedSiparis.id}</h2>
                                <p className="text-gray-400 text-sm">{new Date(selectedSiparis.siparisTarihi).toLocaleString('tr-TR')}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider ${getDurumStyle(selectedSiparis.durum)}`}>
                                {selectedSiparis.durum}
                            </span>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border dark:border-gray-700">
                            <div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Müşteri</span>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{selectedSiparis.musteriAdi}</p>
                                <p className="text-sm text-gray-500">{selectedSiparis.telefon}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Teslimat Adresi</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{selectedSiparis.adres}</p>
                            </div>
                        </div>

                        <div className="max-h-72 overflow-y-auto space-y-3 mb-6 pr-2">
                            {selectedSiparis.detaylar && selectedSiparis.detaylar.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`https://localhost:7126${item.urunResimUrl}`}
                                            alt={item.urunAdi}
                                            className="w-12 h-12 rounded-lg object-cover border dark:border-gray-700"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-gray-800 dark:text-white">{item.urunAdi}</p>
                                            <p className="text-xs text-gray-500">{item.adet} adet x {item.birimFiyat} ₺</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-blue-600">{(item.adet * item.birimFiyat).toLocaleString('tr-TR')} ₺</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-gray-400 font-bold text-lg">Genel Toplam</span>
                            <span className="text-3xl font-black text-green-600 tracking-tighter">
                                {selectedSiparis.toplamTutar.toLocaleString('tr-TR')} ₺
                            </span>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                        >
                            ANLADIM
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Siparisler;