import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './admin/Dashboard'; 
import Urunler from './admin/Urunler';
import Kategoriler from './admin/Kategoriler';
import Musteriler from './admin/Musteriler';
import UrunEkle from "./admin/UrunEkle";
import KategoriEkle from './admin/KategoriEkle';
import Arsivlenenler from './admin/Arsivlenenler';

//deneme olsun diye yaptık sonrasında anasayfa oluşturulacak
const AnaSayfa = () => (
    <div className="p-10 text-center">
        <h1 className="text-4xl font-bold">Hoş Geldiniz! 🚀</h1>
        <p className="mt-4">Burası müşterilerin göreceği vitrin sayfası.</p>
        <Link to="/admin" className="text-blue-500 underline mt-10 inline-block">
            Admin Paneline Git
        </Link>
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AnaSayfa />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/urunler" element={<Urunler />} />
                <Route path="/admin/kategoriler" element={<Kategoriler />} />
                <Route path="/admin/arsivlenenler" element={<Arsivlenenler />} />
                <Route path="/admin/musteriler" element={<Musteriler />} />
                <Route path="/admin/urun-ekle" element={<UrunEkle />} />
                <Route path="/admin/kategori-ekle" element={<KategoriEkle />} />
            </Routes>
        </Router>
    );
}

export default App;