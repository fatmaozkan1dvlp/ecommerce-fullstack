import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { getTokenPayload } from '../api';
import { ShoppingBag, User, Search, X, ArrowRight, Instagram, Twitter, Facebook, LogOut, Heart } from 'lucide-react';

function UserLayout({ children }) {
    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("search") || "";

    const getUser = () => {
        const payload = getTokenPayload();
        if (!payload) return null;
        return {
            adSoyad: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "",
            rol: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || ""
        };
    };

    const [user, setUser] = useState(() => {
        const u = getUser();
        if (!u || u.rol === "Admin") return null;
        return u;
    });

    useEffect(() => {
        const getKategoriler = async () => {
            try {
                const res = await api.get('/Kategoriler');
                setCategories(res.data);
            } catch (error) {
                console.error("Kategoriler çekilemedi:", error);
            }
        };
        getKategoriler();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        if (val) {
            navigate(`?search=${val}`);
        } else {
            navigate(location.pathname); 
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">
            <nav className="fixed top-0 w-full z-[100] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 h-20 flex justify-between items-center">

                    <div className="flex items-center gap-4 md:gap-8">
                        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-2 md:gap-3 group outline-none">
                            <div className="flex flex-col gap-1.5">
                                <span className="w-5 h-[1.5px] bg-gray-900 dark:bg-white transition-all group-hover:w-8"></span>
                                <span className="w-8 h-[1.5px] bg-gray-900 dark:bg-white transition-all group-hover:w-5"></span>
                            </div>
                            <span className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                Menü
                            </span>
                        </button>
                        <Link to="/" className="text-lg md:text-xl font-black tracking-tighter hover:opacity-70 transition-opacity">
                            DECO<span className="text-amber-600">.</span>STUDIO
                        </Link>
                    </div>

                    <div className={`flex-1 max-w-md mx-8 transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible hidden md:block md:opacity-100 md:visible'}`}>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Ürün veya kategori ara..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-full py-2.5 pl-12 pr-4 text-xs font-bold tracking-wide focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-5">
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors md:hidden">
                            {isSearchOpen ? <X size={20} /> : <Search size={18} />}
                        </button>
                        <Link to="/favoriler" className="relative group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            <Heart size={22} className="text-gray-700 dark:text-gray-200" />
                        </Link>
                        <Link to="/sepet" className="relative group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            <ShoppingBag size={22} className="text-gray-700 dark:text-gray-200 group-hover:scale-110 transition-transform duration-200" />
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 md:gap-3 ml-1">
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-amber-600">Hoş Geldin</span>
                                    <span className="text-[10px] md:text-[12px] font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[80px] md:max-w-none">
                                        {user.adSoyad}
                                    </span>
                                </div>
                                <div className="relative group" onMouseEnter={() => setIsUserDropdownOpen(true)} onMouseLeave={() => setIsUserDropdownOpen(false)}>
                                    <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-all border border-gray-100 dark:border-gray-700">
                                        <User size={18} />
                                    </button>
                                    <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 transition-all z-[110] ${isUserDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                        <Link to="/profil" className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black tracking-widest text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors uppercase">
                                            <User size={16} className="text-amber-600" /> PROFİLİM
                                        </Link>
                                        <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1 mx-2" />
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                                            <LogOut size={16} /> ÇIKIŞ YAP
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/giris" className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest px-4 md:px-6 py-2 md:py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-amber-600 transition-all ml-1">
                                Giriş
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
                <aside className={`absolute top-0 left-0 h-full w-[80%] sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-500 ease-out rounded-r-[2rem] md:rounded-r-none ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 md:p-8 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-10 md:mb-16">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Kategoriler</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:rotate-90 transition-transform bg-gray-50 dark:bg-gray-800 rounded-full text-gray-500">
                                <X size={20} strokeWidth={2} />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
                            {categories.map((cat, i) => (
                                <Link key={i} to={`/kategori/${cat.slug || cat.id || cat.ID}`} onClick={() => setIsMenuOpen(false)} className="group flex items-center p-4 rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all border border-transparent hover:border-amber-100">
                                    <div className="flex-1">
                                        <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-amber-600 transition-colors">{cat.ad || cat.Ad}</h4>
                                        <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider">Koleksiyonu İncele</p>
                                    </div>
                                    <ArrowRight size={16} className="text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>
            </div>

            <main className="pt-20 min-h-[calc(100vh-300px)]">{children}</main>

            <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 md:pt-20 pb-10">

                <div className="max-w-[1600px] mx-auto px-6 md:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 text-center">

                        <div className="flex flex-col items-center">

                            <Link to="/" className="text-2xl font-black tracking-tighter mb-6">

                                DECO<span className="text-amber-600">.</span>STUDIO

                            </Link>

                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">

                                Yaşam alanlarınıza minimalist dokunuşlar ve modern zanaat katıyoruz.

                            </p>

                        </div>

                        <div className="flex flex-col items-center">

                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-6">İletişim</h4>

                            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">

                                <li>Nilüfer, Bursa</li>

                                <li>

                                    <a href="mailto:hello@decostudio.com" className="text-gray-900 dark:text-white font-bold hover:text-amber-600 transition-colors border-b border-gray-200 pb-1">

                                        hello@decostudio.com

                                    </a>

                                </li>

                            </ul>

                        </div>

                        <div className="flex flex-col items-center">

                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-6">Sosyal Medya</h4>

                            <div className="flex gap-4 mb-6">

                                {[Instagram, Twitter, Facebook].map((Icon, i) => (

                                    <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all">

                                        <Icon size={16} />

                                    </a>

                                ))}

                            </div>

                        </div>

                    </div>

                    <div className="pt-10 border-t border-gray-100 dark:border-gray-900 text-center">

                        <p className="text-gray-400 text-[9px] md:text-[11px] font-medium uppercase tracking-widest mb-4">

                            © 2026 DECO.STUDIO — TÜM HAKLARI SAKLIDIR.

                        </p>

                        <div className="flex justify-center gap-4 md:gap-6">

                            <Link to="#" className="text-[10px] md:text-[11px] font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest">Gizlilik</Link>

                            <Link to="#" className="text-[10px] md:text-[11px] font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest">KVKK</Link>

                        </div>

                    </div>

                </div>

            </footer>
        </div>
    );
}

export default UserLayout;