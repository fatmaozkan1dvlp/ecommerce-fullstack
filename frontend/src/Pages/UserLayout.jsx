import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Sun, Moon, Search, Menu, X, Heart } from 'lucide-react';

const UserLayout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    // Karanlık Mod Mantığı (Sadece burada çalışacak şekilde)
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-gray-950 transition-colors duration-500">

            {/* ÜST NAVBAR - CAM EFEKTİ (Glassmorphism) */}
            <nav className="fixed top-0 w-full z-[100] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 group">
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                                DECO<span className="text-amber-600">.</span>STUDIO
                            </span>
                        </Link>

                        {/* Masaüstü Menü (Soft Tonlar) */}
                        <div className="hidden md:flex items-center space-x-8">
                            {['Anasayfa', 'Yeni Gelenler', 'Koleksiyonlar', 'Hakkımızda'].map((item) => (
                                <Link key={item} to="#" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </div>

                        {/* Sağ İkonlar (Mod, Sepet, Giriş) */}
                        <div className="flex items-center space-x-2 sm:space-x-4">

                            {/* KARANLIK MOD BUTONU (İstediğin Mantık) */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-amber-400 transition-all duration-300"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 transition-colors">
                                <Search size={20} />
                            </button>

                            {/* Sepet (Badge'li) */}
                            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 transition-colors group">
                                <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
                                <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
                            </button>

                            <Link to="#" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-lg shadow-gray-200 dark:shadow-none active:scale-95">
                                <User size={18} />
                                Giriş Yap
                            </Link>

                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 dark:text-white">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ANA İÇERİK ALANI */}
            <main className="pt-20">
                {children}
            </main>

            {/* FOOTER (Minimalist) */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">© 2026 DecoStudio. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;