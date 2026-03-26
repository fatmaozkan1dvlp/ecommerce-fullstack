using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Concrete
{
    public class UrunlerService : IUrunlerService
    {
        private readonly AppDbContext _context;

        public UrunlerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UrunlerDto>> GetUrunlerAsync()
        {
            var urunler = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .Where(u => !u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            return urunler;
        }

        public async Task<Urun> PostUrunAsync(Urun urun)
        {
            urun.Kategori = null;
            urun.OlusturmaTarihi = DateTime.Now;
            urun.SilindiMi = false;

            _context.Urunler.Add(urun);
            await _context.SaveChangesAsync();

            return urun;
        }

        public async Task<object?> GetUrunByIdAsync(int id)
        {
            var urun = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .FirstOrDefaultAsync(u => u.ID == id);

            if (urun == null) return null;

            return new
            {
                id = urun.ID,
                ad = urun.Ad,
                fiyat = urun.Fiyat,
                stok = urun.Stok,
                kategoriId = urun.KategoriId,
                aciklama = urun.Aciklama,
                resimler = urun.Resimler.OrderBy(r => r.SiraNo)
                    .Select(r => new { id = r.ID, url = r.Url, siraNo = r.SiraNo })
            };
        }

        public async Task<(bool BasariliMi, string Mesaj, object? Data)> UrunGuncelleAsync(int id, UrunGuncelleDto dto)
        {
            var mevcutUrun = await _context.Urunler.FindAsync(id);

            if (mevcutUrun == null)
                return (false, "Ürün bulunamadı.", null);

            if (!string.IsNullOrWhiteSpace(dto.Ad) && dto.Ad != "string")
                mevcutUrun.Ad = dto.Ad;

            if (!string.IsNullOrWhiteSpace(dto.Aciklama) && dto.Aciklama != "string")
                mevcutUrun.Aciklama = dto.Aciklama;

            if (dto.Fiyat > 0)
                mevcutUrun.Fiyat = dto.Fiyat;

            if (dto.Stok >= 0)
                mevcutUrun.Stok = dto.Stok;

            if (dto.KategoriId > 0)
                mevcutUrun.KategoriId = dto.KategoriId;

            await _context.SaveChangesAsync();

            return (true, "Ürün güncellendi.", mevcutUrun);
        }

        public async Task<(bool BasariliMi, string Mesaj)> UrunArsivleAsync(int id)
        {
            var urun = await _context.Urunler.FindAsync(id);

            if (urun == null)
                return (false, "Ürün bulunamadı.");

            urun.SilindiMi = true;
            await _context.SaveChangesAsync();

            var aktifUrunVarMi = await _context.Urunler
                .AnyAsync(u => u.KategoriId == urun.KategoriId && !u.SilindiMi);

            if (!aktifUrunVarMi)
            {
                var kategori = await _context.Kategoriler.FindAsync(urun.KategoriId);
                if (kategori != null)
                {
                    kategori.SilindiMi = true;
                    await _context.SaveChangesAsync();
                }
            }

            return (true, "Ürün ve gerekliyse kategorisi arşivlendi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> UrunKaliciSilAsync(int id)
        {
            var urun = await _context.Urunler.FindAsync(id);

            if (urun == null)
                return (false, "Ürün bulunamadı.");

            var siparisVarMi = await _context.SiparisDetaylari
                .AnyAsync(s => s.UrunId == id);

            if (siparisVarMi)
                return (false, "Bu ürün geçmiş siparişlerde bulunduğu için kalıcı olarak silinemez. Ancak arşivleyebilirsiniz.");

            _context.Urunler.Remove(urun);
            await _context.SaveChangesAsync();

            return (true, "Ürün (siparişi olmadığı için) başarıyla silindi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> UrunArsivdenCikarAsync(int id)
        {
            var urun = await _context.Urunler.FindAsync(id);

            if (urun == null)
                return (false, "Ürün bulunamadı.");

            urun.SilindiMi = false;

            var kategori = await _context.Kategoriler.FindAsync(urun.KategoriId);
            if (kategori != null && kategori.SilindiMi)
                kategori.SilindiMi = false;

            await _context.SaveChangesAsync();

            return (true, "Ürün ve kategorisi aktif edildi.");
        }

        public async Task<List<UrunlerDto>> GetArsivdekiUrunlerAsync()
        {
            var urunler = await _context.Urunler
                .Include(u => u.Kategori)
                .Where(u => u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                })
                .ToListAsync();

            return urunler;
        }

        public async Task<(bool BasariliMi, string Mesaj, object? Data)> ResimEkleAsync(int id, IFormFile dosya)
        {
            var urun = await _context.Urunler
                .Include(u => u.Resimler)
                .FirstOrDefaultAsync(u => u.ID == id);

            if (urun == null)
                return (false, "Ürün bulunamadı.", null);

            if (dosya == null || dosya.Length == 0)
                return (false, "Geçerli bir resim dosyası seçmelisiniz.", null);

            var klasorYolu = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            if (!Directory.Exists(klasorYolu))
                Directory.CreateDirectory(klasorYolu);

            var dosyaAdi = Guid.NewGuid().ToString() + Path.GetExtension(dosya.FileName);
            var tamYol = Path.Combine(klasorYolu, dosyaAdi);

            using (var stream = new FileStream(tamYol, FileMode.Create))
            {
                await dosya.CopyToAsync(stream);
            }

            var yeniResim = new UrunResim
            {
                UrunId = id,
                Url = "/images/" + dosyaAdi,
                SiraNo = urun.Resimler.Count + 1
            };

            _context.UrunResimleri.Add(yeniResim);
            await _context.SaveChangesAsync();

            return (true, "Resim başarıyla eklendi.", new { url = yeniResim.Url });
        }

        public async Task<(bool BasariliMi, string Mesaj)> ResimSilAsync(int resimId)
        {
            var resim = await _context.UrunResimleri.FindAsync(resimId);

            if (resim == null)
                return (false, "Resim bulunamadı.");

            _context.UrunResimleri.Remove(resim);
            await _context.SaveChangesAsync();

            return (true, "Resim silindi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> ResimKapakYapAsync(int resimId)
        {
            var secilenResim = await _context.UrunResimleri.FindAsync(resimId);

            if (secilenResim == null)
                return (false, "Resim bulunamadı.");

            var tumResimler = await _context.UrunResimleri
                .Where(r => r.UrunId == secilenResim.UrunId)
                .ToListAsync();

            foreach (var r in tumResimler)
                r.SiraNo = 2;

            secilenResim.SiraNo = 1;

            await _context.SaveChangesAsync();

            return (true, "Kapak resmi güncellendi.");
        }

        public async Task<(bool BasariliMi, string Mesaj, object? Data)> GetUrunlerByKategoriAsync(int kategoriId)
        {
            var kategoriVarMi = await _context.Kategoriler
                .AnyAsync(k => k.ID == kategoriId && !k.SilindiMi);

            if (!kategoriVarMi)
                return (false, "kategori sistemde bulunamadı.", null);

            var urunler = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .Where(u => u.KategoriId == kategoriId && !u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            if (urunler.Count == 0)
                return (true, "Bu kategoriye ait henüz bir ürün eklenmemiş.", new List<UrunlerDto>());

            return (true, "Başarılı", urunler);
        }

        public async Task<(bool BasariliMi, string Mesaj, object? Data)> UrunAraAsync(string kelime)
        {
            if (string.IsNullOrWhiteSpace(kelime) || kelime.Length < 2)
                return (false, "Arama yapmak için en az 2 karakter girmelisiniz.", null);

            var urunler = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .Where(u => u.Ad.ToLower().Contains(kelime.ToLower()) && !u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            if (urunler.Count == 0)
                return (false, $"'{kelime}' aramasına uygun bir ürün bulunamadı.", null);

            return (true, "Başarılı", urunler);
        }
    }
}
