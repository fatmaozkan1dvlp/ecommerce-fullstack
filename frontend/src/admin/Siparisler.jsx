import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import AdminLayout from './AdminLayout';
import { Package, Eye } from 'lucide-react';

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
            console.error(err),
            alert("Detaylar yüklenemedi");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/Siparisler/duruma-gore?durum=${durum}`);
            setSiparisler(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [durum]);

    const durumGuncelle = async (id, yeniDurum) => {
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
            case "Alındı":
                return "bg-yellow-100 text-yellow-700";
            case "Hazırlanıyor":
                return "bg-blue-100 text-blue-700";
            case "Kargoya Verildi":
                return "bg-purple-100 text-purple-700";
            case "Tamamlandı":
                return "bg-green-100 text-green-700";
            case "İptal Edildi":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl">
                    <div className="flex items-center gap-3">
                        <Package className="text-blue-600" />
                        <h1 className="text-2xl font-bold">
                            {durum} Siparişler
                        </h1>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">

                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4 text-left">Sipariş No</th>
                                <th className="p-4 text-left">Tarih</th>
                                <th className="p-4 text-right">Tutar</th>
                                <th className="p-4 text-center">Durum</th>
                                <th className="p-4 text-center">İşlem</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-10">
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : siparisler.length > 0 ? (
                                siparisler.map((s) => (
                                    <tr key={s.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition">

                                        <td className="p-4 font-bold text-blue-600">
                                            #{s.id}
                                        </td>

                                        <td className="p-4">
                                            {new Date(s.siparisTarihi).toLocaleString('tr-TR')}
                                        </td>

                                        <td className="p-4 text-right font-bold">
                                            {s.toplamTutar} ₺
                                        </td>

                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDurumStyle(s.durum)}`}>
                                                {s.durum}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center flex justify-center gap-2">

                                            {/* DETAY */}
                                            <button
                                                onClick={() => detayGetir(s.id)}
                                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {/* DURUM DEĞİŞTİR */}
                                            <select
                                                onChange={(e) => durumGuncelle(s.id, e.target.value)}
                                                className="border rounded-lg px-2 py-1 text-xs"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Durum</option>
                                                <option value="Alındı">Alındı</option>
                                                <option value="Hazırlanıyor">Hazırlanıyor</option>
                                                <option value="Kargoya Verildi">Kargoya Verildi</option>
                                                <option value="Tamamlandı">Tamamlandı</option>
                                                <option value="İptal Edildi">İptal Et</option>
                                            </select>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-10 text-gray-400">
                                        Sipariş yok
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && selectedSiparis && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl border dark:border-gray-700 overflow-hidden">

                        {/* Üst Başlık */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Sipariş #{selectedSiparis.id}</h2>
                                <p className="text-gray-400 text-sm">{new Date(selectedSiparis.siparisTarihi).toLocaleString('tr-TR')}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider ${getDurumStyle(selectedSiparis.durum)}`}>
                                {selectedSiparis.durum}
                            </span>
                        </div>

                        {/* Müşteri Bilgi Kartı */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-5 mb-6 grid grid-cols-2 gap-4 border dark:border-gray-700">
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

                        {/* Ürün Listesi */}
                        <div className="max-h-72 overflow-y-auto space-y-3 mb-6">
                            {selectedSiparis.detaylar && selectedSiparis.detaylar.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        {/* Ürün Resmi */}
                                        <img
                                            src={`https://localhost:7126${item.urunResimUrl}`} 
                                            alt={item.urunAdi}
                                            className="w-12 h-12 rounded-lg object-cover border"
                                        />
                                        <div>
                                            <p className="font-bold text-sm">{item.urunAdi}</p>
                                            <p className="text-xs text-gray-500">{item.adet} adet x {item.birimFiyat} ₺</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-blue-600">{item.adet * item.birimFiyat} ₺</p>
                                </div>
                            ))}
                        </div>

                        {/* Toplam Tutar Alanı */}
                        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-gray-400 font-bold text-lg">Genel Toplam</span>
                            <span className="text-3xl font-black text-green-600 tracking-tighter">
                                {selectedSiparis.toplamTutar} ₺
                            </span>
                        </div>

                        {/* Kapat Butonu */}
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