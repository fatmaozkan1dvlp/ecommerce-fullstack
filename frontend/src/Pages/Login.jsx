import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Loader2, ChevronLeft } from 'lucide-react';
import api from "../api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [hata, setHata] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setHata("");
        setLoading(true);

        try {
            const response = await api.post("/Kullanicilar/login", {
                eMail: email,
                sifre: sifre
            });

            const userData = response.data;
            const userRole = userData?.rol || userData?.Rol;
            const token = userData?.token || userData?.Token;

            if (userRole !== "Admin") {
                setHata("Bu panele sadece admin kullanıcılar giriş yapabilir.");
                setLoading(false);
                return;
            }
            if (!token) {
                setHata("Sistemsel bir hata oluştu (Token alınamadı).");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", token);

            sessionStorage.setItem("adminUser", JSON.stringify(userData));
            navigate("/admin/dashboard");
        } catch (error) {
            console.error(error);
            const mesaj = error.response?.data || "Giriş bilgileri hatalı veya sunucu yanıt vermiyor.";
            setHata(mesaj);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-12">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors font-bold text-[10px] md:text-xs uppercase tracking-widest"
            >
                <ChevronLeft size={18} />
                Siteye Dön
            </button>

            <div className="w-full max-w-[450px]">

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-sm border border-gray-100 mb-6">
                        <ShieldCheck size={32} className="text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">
                        ADMIN<span className="text-indigo-600">.</span>PANEL
                    </h1>
                    <p className="text-gray-400 text-[11px] uppercase tracking-[0.25em] font-medium">
                        Yönetim Sistemi Erişimi
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-gray-50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Yönetici E-Posta
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                    placeholder="örnek@gmail.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Güvenlik Şifresi
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={sifre}
                                    onChange={(e) => setSifre(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {hata && (
                            <div className="p-4 bg-red-50 text-red-600 text-[13px] font-bold rounded-xl text-center animate-shake">
                                {hata}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-200/40 disabled:opacity-70 mt-4"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Sisteme Giriş Yap"
                            )}
                        </button>
                    </form>
                </div>

                
            </div>
        </div>
    );
};

export default Login;