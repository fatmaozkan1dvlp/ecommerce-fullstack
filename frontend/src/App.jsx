import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './admin/Dashboard'; 
import Urunler from './admin/Urunler';
import Kategoriler from './admin/Kategoriler';
import Musteriler from './admin/Musteriler';
import UrunEkle from "./admin/UrunEkle";
import KategoriEkle from './admin/KategoriEkle';
import Arsivlenenler from './admin/Arsivlenenler';
import UrunGuncelle from './admin/UrunGuncelle';
import Siparisler from './admin/Siparisler';
import Ayarlar from './admin/Ayarlar';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Home from './pages/Home';



////deneme olsun diye yaptık sonrasında anasayfa oluşturulacak
//const AnaSayfa = () => (
//    <div className="p-10 text-center">
//        <h1 className="text-4xl font-bold">Hoş Geldiniz! </h1>
//        <p className="mt-4">Burası müşterilerin göreceği vitrin sayfası.</p>
//        <Link to="/admin-login" className="text-blue-500 underline mt-10 inline-block">
//            Admin Paneline Git
//        </Link>
//    </div>
//);

function App() {
    return (
        <Router>
            <Routes>
 
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Login />} />

                <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/urunler" element={<AdminRoute><Urunler /></AdminRoute>} />
                <Route path="/admin/kategoriler" element={<AdminRoute><Kategoriler /></AdminRoute>} />
                <Route path="/admin/arsivlenenler" element={<AdminRoute><Arsivlenenler /></AdminRoute>} />
                <Route path="/admin/musteriler" element={<AdminRoute><Musteriler /></AdminRoute>} />
                <Route path="/admin/urun-ekle" element={<AdminRoute><UrunEkle /></AdminRoute>} />
                <Route path="/admin/kategori-ekle" element={<AdminRoute><KategoriEkle /></AdminRoute>} />
                <Route path="/admin/urun-guncelle/:id" element={<AdminRoute><UrunGuncelle /></AdminRoute>} />
                <Route path="/admin/siparisler/:durum" element={<AdminRoute><Siparisler /></AdminRoute>} />
                <Route path="/admin/ayarlar" element={<AdminRoute><Ayarlar /></AdminRoute>} />
                
            </Routes>
        </Router>
    );
}

export default App;