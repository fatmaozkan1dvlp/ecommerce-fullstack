using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Helpers;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace ECommerce.API.Services.Concrete
{
    public class UrunlerService : IUrunlerService
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;

        public UrunlerService(AppDbContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        
        private async Task<string> SlugUretAsync(string ad, int? mevcutId = null)
        {
            var baseSlug = SlugHelper.Slugify(ad);
            var slug = baseSlug;
            int sayac = 1;

            while (await _context.Urunler.AnyAsync(u =>
                u.Slug == slug && (mevcutId == null || u.ID != mevcutId)))
            {
                slug = $"{baseSlug}-{sayac++}";
            }

            return slug;
        }

        public async Task<List<UrunlerDto>> GetUrunlerAsync()
        {
            return await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .Where(u => !u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    Slug = u.Slug,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    KategoriSlug = u.Kategori != null ? u.Kategori.Slug : null,
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();
        }

        public async Task<Urun> PostUrunAsync(UrunEkleDto dto)
        {
            var urun = new Urun
            {
                Ad = dto.Ad,
                Fiyat = Math.Round(dto.Fiyat, 2),
                Stok = dto.Stok,
                Aciklama = dto.Aciklama,
                KategoriId = dto.KategoriId,
                OlusturmaTarihi = DateTime.Now,
                SilindiMi = false
            };

           urun.Slug = await SlugUretAsync(dto.Ad);

            _context.Urunler.Add(urun);
            await _context.SaveChangesAsync();
            return urun;
        }

        
        public async Task<object?> GetUrunBySlugAsync(string slug)
        {
            var urun = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .FirstOrDefaultAsync(u => u.Slug == slug && !u.SilindiMi);

            if (urun == null) return null;

            return new
            {
                id = urun.ID,
                ad = urun.Ad,
                slug = urun.Slug,
                fiyat = urun.Fiyat,
                stok = urun.Stok,
                kategoriId = urun.KategoriId,
                kategoriAd = urun.Kategori?.Ad,
                kategoriSlug = urun.Kategori?.Slug,
                aciklama = urun.Aciklama,
                resimler = urun.Resimler.OrderBy(r => r.SiraNo)
                    .Select(r => new { id = r.ID, url = r.Url, siraNo = r.SiraNo })
            };
        }

        public async Task<object?> GetUrunByIdAsync(int id)
        {
            var urun = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .FirstOrDefaultAsync(u => u.ID == id && !u.SilindiMi);

            if (urun == null) return null;

            return new
            {
                id = urun.ID,
                ad = urun.Ad,
                slug = urun.Slug,
                fiyat = urun.Fiyat,
                stok = urun.Stok,
                kategoriId = urun.KategoriId,
                kategoriAd = urun.Kategori?.Ad,
                kategoriSlug = urun.Kategori?.Slug,
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

            if (!string.IsNullOrWhiteSpace(dto.Ad) && dto.Ad != "string" && dto.Ad != mevcutUrun.Ad)
            {
                mevcutUrun.Ad = dto.Ad;
                mevcutUrun.Slug = await SlugUretAsync(dto.Ad, id);
            }

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

        public async Task<(bool BasariliMi, string Mesaj, object? Data)> GetUrunlerByKategoriAsync(int kategoriId)
        {
            var kategoriVarMi = await _context.Kategoriler
                .AnyAsync(k => k.ID == kategoriId && !k.SilindiMi);

            if (!kategoriVarMi)
                return (false, "Kategori bulunamadı.", null);

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
                    Slug = u.Slug,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    KategoriSlug = u.Kategori != null ? u.Kategori.Slug : null,
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            if (urunler.Count == 0)
                return (true, "Bu kategoriye ait henüz bir ürün eklenmemiş.", new List<UrunlerDto>());

            return (true, "Başarılı", urunler);
        }


        public async Task<(bool BasariliMi, string Mesaj, object? Data)> GetUrunlerByKategoriSlugAsync(string slug)
        {
            var kategori = await _context.Kategoriler
                .FirstOrDefaultAsync(k => k.Slug == slug && !k.SilindiMi);

            if (kategori == null)
                return (false, "Kategori bulunamadı.", null);

            return await GetUrunlerByKategoriAsync(kategori.ID);
        }

        public async Task<(bool BasariliMi, string Mesaj, object? Data)> UrunAraAsync(string kelime)
        {
            if (string.IsNullOrWhiteSpace(kelime) || kelime.Length < 2)
                return (false, "Arama için en az 2 karakter giriniz.", null);

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
                    Slug = u.Slug,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    KategoriSlug = u.Kategori != null ? u.Kategori.Slug : null,
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            if (urunler.Count == 0)
                return (false, $"'{kelime}' için ürün bulunamadı.", null);

            return (true, "Başarılı", urunler);
        }

        public async Task<(bool BasariliMi, string Mesaj)> UrunArsivleAsync(int id)
        {
            var urun = await _context.Urunler.FindAsync(id);
            if (urun == null) return (false, "Ürün bulunamadı.");

            urun.SilindiMi = true;
            await _context.SaveChangesAsync();

            var aktifUrunVarMi = await _context.Urunler
                .AnyAsync(u => u.KategoriId == urun.KategoriId && !u.SilindiMi);

            if (!aktifUrunVarMi)
            {
                var kategori = await _context.Kategoriler.FindAsync(urun.KategoriId);
                if (kategori != null) { kategori.SilindiMi = true; await _context.SaveChangesAsync(); }
            }

            return (true, "Ürün arşivlendi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> UrunKaliciSilAsync(int id)
        {
            var urun = await _context.Urunler.FindAsync(id);
            if (urun == null) return (false, "Ürün bulunamadı.");

            var siparisVarMi = await _context.SiparisDetaylari.AnyAsync(s => s.UrunId == id);
            if (siparisVarMi) return (false, "Sipariş geçmişi olduğu için silinemez. Arşivleyebilirsiniz.");

            _context.Urunler.Remove(urun);
            await _context.SaveChangesAsync();
            return (true, "Ürün silindi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> UrunArsivdenCikarAsync(int id)
        {
            var urun = await _context.Urunler.FindAsync(id);
            if (urun == null) return (false, "Ürün bulunamadı.");

            urun.SilindiMi = false;

            var kategori = await _context.Kategoriler.FindAsync(urun.KategoriId);
            if (kategori != null && kategori.SilindiMi) kategori.SilindiMi = false;

            await _context.SaveChangesAsync();
            return (true, "Ürün aktif edildi.");
        }

        public async Task<List<UrunlerDto>> GetArsivdekiUrunlerAsync()
        {
            return await _context.Urunler
                .Include(u => u.Kategori)
                .Where(u => u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    Slug = u.Slug,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                })
                .ToListAsync();
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

            // Cloudinary
            using var stream = dosya.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(dosya.FileName, stream),
                Folder = "ecommerce/urunler",
                Transformation = new Transformation()
                    .Width(1280).Height(1280)
                    .Crop("limit")
                    .Quality("auto")
                    .FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                return (false, $"Resim yüklenemedi: {uploadResult.Error.Message}", null);

            var yeniResim = new UrunResim
            {
                UrunId = id,
                Url = uploadResult.SecureUrl.ToString(), 
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

            if (resim.Url.Contains("cloudinary.com"))
            {
                var uri = new Uri(resim.Url);
                var segments = uri.AbsolutePath.Split('/');
                var publicIdWithExt = string.Join("/", segments.Skip(
                    Array.IndexOf(segments, "ecommerce")));
                var publicId = Path.GetFileNameWithoutExtension(publicIdWithExt);
                var fullPublicId = $"ecommerce/urunler/{publicId}";

                await _cloudinary.DestroyAsync(new DeletionParams(fullPublicId));
            }

            _context.UrunResimleri.Remove(resim);
            await _context.SaveChangesAsync();

            return (true, "Resim silindi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> ResimKapakYapAsync(int resimId)
        {
            var secilenResim = await _context.UrunResimleri.FindAsync(resimId);
            if (secilenResim == null) return (false, "Resim bulunamadı.");

            var tumResimler = await _context.UrunResimleri
                .Where(r => r.UrunId == secilenResim.UrunId)
                .OrderBy(r => r.SiraNo)
                .ToListAsync();

            int sira = 2;
            foreach (var r in tumResimler)
                r.SiraNo = r.ID == resimId ? 1 : sira++;

            await _context.SaveChangesAsync();
            return (true, "Kapak resmi güncellendi.");
        }
    }
}