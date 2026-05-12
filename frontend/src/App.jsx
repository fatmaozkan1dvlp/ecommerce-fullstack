import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
import AuthRoute from './components/AuthRoute';

import Login from './pages/Login';
import Home from './pages/Home';
import KullaniciGiris from './pages/KullaniciGiris';
import KullaniciKayit from './pages/KullaniciKayit';
import KategoriUrunleri from './pages/KategoriUrunleri';
import Profil from './pages/Profil';
import ProfilGuncelle from './pages/ProfilGuncelle';
import UrunDetay from './pages/UrunDetay';
import Favoriler from './pages/Favoriler';
import Sepet from './pages/Sepet';

function App() {
    return (
        <Router>
            {/* Toast bildirimleri için */}
            <Toaster position="top-right" />
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/kategori/:slug" element={<KategoriUrunleri />} />
                <Route path="/urun/:slug" element={<UrunDetay />} />
                <Route path="/giris" element={<KullaniciGiris />} />
                <Route path="/kayit" element={<KullaniciKayit />} />
                <Route path="/sepet" element={<Sepet />} />
                <Route path="/favoriler" element={<Favoriler />} />

                <Route path="/admin" element={<Login />} />

                <Route path="/profil" element={<AuthRoute><Profil /></AuthRoute>} />
                <Route path="/profil-guncelle" element={<AuthRoute><ProfilGuncelle /></AuthRoute>} />
                
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