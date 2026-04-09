import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from "../api";

const KullaniciGiris = () => {
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { mergeGuestCartToUser } = useCart();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post("/Kullanicilar/login", {
                eMail: email,
                sifre: sifre
            });

            const userData = response.data;
            const userRole = userData?.rol || userData?.Rol;
            const token = userData?.token || userData?.Token;

            if (userRole === "Admin") {
                setError("Bu giriş ekranı sadece müşteriler içindir.");
                setLoading(false);
                return;
            }
            

            if ((userData?.message === "Giriş başarılı!" || userRole === "Musteri") && token) {
                localStorage.setItem("token",token);
                localStorage.setItem("user", JSON.stringify(userData));
                mergeGuestCartToUser();
                navigate("/");
            } else {
                setError(userData?.message || userData?.mesaj || "Giriş başarısız.");
            }

        } catch (err) {
            const mesaj = err.response?.data?.message || err.response?.data?.mesaj || err.response?.data || "Bağlantı hatası.";
            setError(mesaj);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-colors font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]"
            >
                <ChevronLeft size={18} />
                Geri Dön
            </button>

            <div className="w-full max-w-[450px] z-10">
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
                        DECO<span className="text-amber-600">.</span>STUDIO
                    </h1>
                    <p className="text-gray-400 text-[11px] uppercase tracking-[0.3em] font-medium">
                        Özel Tasarım Dünyasına Giriş
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-100/50 border border-gray-50">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tekrar hoş geldiniz.</h2>
                        <p className="text-gray-400 text-xs mt-1">Lütfen hesabınıza giriş yapın.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                E-Posta Adresiniz
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                    placeholder="ornek@mail.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Güvenli Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={sifre}
                                    onChange={(e) => setSifre(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-[12px] font-bold rounded-xl text-center border border-red-100 animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-950 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 mt-2 disabled:opacity-70 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Hesabıma Gir <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-10 text-center text-[13px] text-gray-400 font-medium">
                    Bir hesabınız yok mu?{" "}
                    <button
                        onClick={() => navigate('/kayit')}
                        className="text-gray-950 font-black border-b-2 border-amber-600 pb-0.5 hover:text-amber-600 transition-colors ml-1"
                    >
                        KAYIT OLUN
                    </button>
                </p>
            </div>
        </div>
    );
};

export default KullaniciGiris;