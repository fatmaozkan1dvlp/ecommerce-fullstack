import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, ChevronLeft, Phone } from 'lucide-react';
import api from "../api";

const KullaniciKayit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        adSoyad: '',
        eMail: '',
        telefon: '',
        sifre: '',
        sifreTekrar: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "telefon") {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 11) {
                setFormData({ ...formData, [name]: onlyNums });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.eMail)) {
            setError("Lütfen geçerli bir e-posta adresi giriniz (örn: isim@gmail.com).");
            return;
        }
        if(formData.sifre.length < 6) {
            setError("Şifreniz güvenlik için en az 6 karakter olmalıdır.");
            return;
        }

        if (formData.telefon.length !== 11) {
            setError("Telefon numarası tam 11 hane olmalıdır.");
            return;
        }

        if(formData.telefon )
        if (formData.sifre !== formData.sifreTekrar) {
            setError("Şifreler birbiriyle eşleşmiyor.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                adSoyad: formData.adSoyad,
                eMail: formData.eMail,
                telefon: formData.telefon,
                sifre: formData.sifre 
            };

            await api.post("/Kullanicilar/register", payload);
            alert( "Kaydınız Başarıyla Gerçekleştirildi!");
            navigate('/giris');
        } catch (err) {
            const mesaj = err.response?.data?.message || err.response?.data?.mesaj || err.response?.data || "Kayıt sırasında bir hata oluştu.";
            setError(mesaj);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-6 py-12 relative">

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-colors font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]"
            >
                <ChevronLeft size={18} />
                Anasayfaya Dön
            </button>

            <div className="max-w-[550px] w-full z-10">

                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
                        DECO<span className="text-amber-600">.</span>STUDIO
                    </h1>
                    <p className="text-gray-400 text-[11px] uppercase tracking-[0.3em] font-medium">Hızlı Üyelik Formu</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-100/50 border border-gray-50">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center md:text-left">Aramıza Katılın.</h2>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Ad Soyad</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="adSoyad"
                                        type="text"
                                        required
                                        value={formData.adSoyad}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                        placeholder="Ad Soyad"
                                    />
                                </div>
                            </div>
                            
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-Posta</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="eMail"
                                    type="email"
                                    required
                                    value={formData.eMail}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                    placeholder="ornek@mail.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Telefon</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    name="telefon"
                                    type="tel"
                                    required
                                    value={formData.telefon}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                    placeholder="05xx xxx xx xx"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="sifre"
                                        type="password"
                                        required
                                        value={formData.sifre}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Onay</label>
                                <input
                                    name="sifreTekrar"
                                    type="password"
                                    required
                                    value={formData.sifreTekrar}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm placeholder:text-gray-300"
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
                                    Kayıt Ol <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-[13px] text-gray-400 font-medium">
                    Zaten bir hesabınız var mı?{" "}
                    <Link to="/giris" className="text-gray-950 font-black border-b-2 border-amber-600 pb-0.5 hover:text-amber-600 transition-colors ml-1">
                        GİRİŞ YAPIN
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default KullaniciKayit;