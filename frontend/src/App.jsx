import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Dashboard from './Admin/Dashboard';
import Urunler from './Admin/Urunler';
import Kategoriler from './Admin/Kategoriler';
import Musteriler from './Admin/Musteriler';
import UrunEkle from "./Admin/UrunEkle";
import KategoriEkle from './Admin/KategoriEkle';
import Arsivlenenler from './Admin/Arsivlenenler';
import UrunGuncelle from './Admin/UrunGuncelle';
import Siparisler from './Admin/Siparisler';
import Ayarlar from './Admin/Ayarlar';

import AdminRoute from './Components/AdminRoute';
import AuthRoute from './Components/AuthRoute';

import Login from './Pages/Login';
import Home from './Pages/Home';
import KullaniciGiris from './Pages/KullaniciGiris';
import KullaniciKayit from './Pages/KullaniciKayit';
import KategoriUrunleri from './Pages/KategoriUrunleri';
import Profil from './Pages/Profil';
import ProfilGuncelle from './Pages/ProfilGuncelle';
import UrunDetay from './Pages/UrunDetay';
import Favoriler from './Pages/Favoriler';
import Sepet from './Pages/Sepet';

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