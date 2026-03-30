import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

            if (userData.rol !== "Admin") {
                setHata("Bu panele sadece admin kullanıcılar giriş yapabilir.");
                setLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/admin/dashboard");
        } catch (error) {
            console.error(error);
            setHata(error.response?.data || "Giriş başarısız.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Admin Girişi
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Yönetim paneline erişmek için giriş yapın
                </p>

                {hata && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {hata}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-posta
                        </label>
                        <input
                            type="email"
                            placeholder="ornek@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Şifre
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={sifre}
                            onChange={(e) => setSifre(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;