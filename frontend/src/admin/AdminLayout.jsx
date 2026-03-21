import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, LayoutDashboard, ShoppingBag, Package, Settings, Layers, Users, Clock, Truck, CheckCircle, ChevronDown, XCircle, Boxes, Archive } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [orderOpen, setOrderOpen] = useState(false);
    const location = useLocation();
    const isActive = (path) => location.pathname === path;


    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

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

                
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                    {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                </button>
            </nav>

            <aside className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-64px)] transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="/admin" className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                <LayoutDashboard size={20} className={isActive('/admin') ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} />
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

                                <ChevronDown
                                    size={18}
                                    className={`transition-transform ${orderOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {orderOpen && (
                                <ul className="mt-1 space-y-1 pl-8">

                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Clock size={18} className="text-gray-500" />
                                            <span className="ml-3">Aktif Siparişler</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Boxes size={18} className="text-gray-500" />
                                            <span className="ml-3">Hazırlanan Siparişler</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Truck size={18} className="text-gray-500" />
                                            <span className="ml-3">Kargolanan Siparişler</span>
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <CheckCircle size={18} className="text-gray-500" />
                                            <span className="ml-3">Tamamlanan Siparişler</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <XCircle size={18} className="text-gray-500" /> 
                                            <span className="ml-3">İptal Edilenler</span>
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <Link
                                to="/admin/musteriler"
                                className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin/musteriler') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <Users size={20} className={isActive('/admin/musteriler') ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} />
                                <span className="ml-3">Müşteriler</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/arsivlenenler"    
                                className={`flex items-center p-2 rounded-lg group transition-colors ${isActive('/admin/arsivlenenler') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <Archive size={18} className="text-gray-500" />
                                <span className="ml-3">Arşivlenenler</span>
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <Settings size={20} className="text-gray-500" />
                                <span className="ml-3">Raporlar</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            <main className={`pt-20 transition-all duration-300 p-6 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;