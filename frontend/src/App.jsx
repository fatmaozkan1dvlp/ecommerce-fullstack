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
import KullaniciGiris from './pages/KullaniciGiris';
import KullaniciKayit from './pages/KullaniciKayit';
import KategoriUrunleri from './pages/KategoriUrunleri';
import Profil from './pages/Profil';
import ProfilGuncelle from './pages/ProfilGuncelle';


function App() {
    return (
        
        <Router>
            <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/kategori/:id" element={<KategoriUrunleri />} />
                
                <Route path="/admin" element={<Login />} />
                <Route path="/giris" element={<KullaniciGiris />} />
                <Route path="/kayit" element={<KullaniciKayit />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/profil-guncelle" element={<ProfilGuncelle />} />


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