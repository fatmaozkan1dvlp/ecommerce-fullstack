import { useState, useEffect } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu, X, LayoutDashboard, ShoppingBag, Package, Settings, Layers, Users,
    Clock, Truck, CheckCircle, ChevronDown, XCircle, Boxes, Archive, LogOut, AlertTriangle
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const [orderOpen, setOrderOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        if (window.innerWidth < 1024) {
            const id = requestAnimationFrame(() => setIsSidebarOpen(false));
            return () => cancelAnimationFrame(id);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        sessionStorage.removeItem("adminUser");
        navigate("/admin");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-[35] bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16 flex items-center px-4 justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span className="ml-4 text-xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-300 group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Çıkış Yap</span>
                    </button>
                </div>
            </nav>

            <aside className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-16px)] transition-transform duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full px-3 py-4 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="/admin/dashboard" className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <LayoutDashboard size={20} className={isActive('/admin/dashboard') ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} />
                                <span className="ml-3">Genel Bakış</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/urunler" className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin/urunler') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <ShoppingBag size={20} className={isActive('/admin/urunler') ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} />
                                <span className="ml-3">Ürünler</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/kategoriler" className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin/kategoriler') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <Layers size={20} className={isActive('/admin/kategoriler') ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} />
                                <span className="ml-3">Kategoriler</span>
                            </Link>
                        </li>

                        <li>
                            <button
                                onClick={() => setOrderOpen(!orderOpen)}
                                className="flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <div className="flex items-center">
                                    <Package size={20} className="text-gray-500" />
                                    <span className="ml-3">Siparişler</span>
                                </div>
                                <ChevronDown size={18} className={`transition-transform ${orderOpen ? "rotate-180" : ""}`} />
                            </button>

                            {orderOpen && (
                                <ul className="mt-1 space-y-1 pl-8">
                                    {[
                                        { to: "/admin/siparisler/Hepsi", label: "Tüm Siparişler", icon: LayoutDashboard },
                                        { to: "/admin/siparisler/Alındı", label: "Aktif Siparişler", icon: Clock },
                                        { to: "/admin/siparisler/Hazırlanıyor", label: "Hazırlanan Siparişler", icon: Boxes },
                                        { to: "/admin/siparisler/Kargoya Verildi", label: "Kargolanan Siparişler", icon: Truck },
                                        { to: "/admin/siparisler/Tamamlandı", label: "Tamamlanan Siparişler", icon: CheckCircle },
                                        { to: "/admin/siparisler/İptal Edildi", label: "İptal Edilenler", icon: XCircle },
                                    ].map((item, idx) => (
                                        <li key={idx}>
                                            <Link to={item.to} className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                                <item.icon size={18} className="text-gray-500" />
                                                <span className="ml-3 text-sm">{item.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link to="/admin/musteriler" className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin/musteriler') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <Users size={20} className={isActive('/admin/musteriler') ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} />
                                <span className="ml-3">Müşteriler</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/arsivlenenler" className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin/arsivlenenler') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <Archive size={18} className="text-gray-500" />
                                <span className="ml-3">Arşivlenenler</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/ayarlar" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <span className="flex items-center">
                                    <Settings size={20} className="text-gray-500" />
                                    <span className="ml-3">Ayarlar</span>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            <main className={`pt-20 transition-all duration-300 p-6 
                ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                {children}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-3xl text-red-600">
                                <AlertTriangle size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-center text-gray-800 dark:text-white mb-2">Emin misiniz?</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-8 font-medium">Oturumunuz kapatılacaktır.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-6 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Vazgeç</button>
                            <button onClick={handleLogout} className="flex-1 py-3 px-6 rounded-2xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all">Evet, Çık</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
