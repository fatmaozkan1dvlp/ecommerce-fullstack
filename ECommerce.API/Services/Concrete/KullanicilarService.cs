using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Concrete
{
    public class KullanicilarService : IKullanicilarService
    {
        private readonly AppDbContext _context;

        public KullanicilarService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MusteriListeDto>> GetMusterilerAsync()
        {
            var musteriler = await _context.Kullanicilar
                .Where(u => !u.SilindiMi && u.Rol == "Musteri")
                .Select(u => new MusteriListeDto
                {
                    ID = u.ID,
                    AdSoyad = u.AdSoyad,
                    EMail = u.EMail,
                    OlusturmaT = u.OlusturmaT,
                    SiparisSayisi = _context.Siparisler.Count(s => s.KullaniciId == u.ID),
                    ToplamHarcama = _context.Siparisler
                        .Where(s => s.KullaniciId == u.ID)
                        .Sum(s => (decimal?)s.ToplamTutar) ?? 0
                })
                .OrderByDescending(u => u.OlusturmaT)
                .ToListAsync();

            return musteriler;
        }

        public async Task<(bool BasariliMi, string Mesaj)> RegisterAsync(KullaniciRegisterDto dto)
        {
            bool emailVarMi = await _context.Kullanicilar
                .AnyAsync(u => u.EMail == dto.EMail);

            if (emailVarMi)
                return (false, "Bu email zaten kayıtlı.");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre);

            var yeniKullanici = new Kullanici
            {
                AdSoyad = dto.AdSoyad,
                EMail = dto.EMail,
                SifreHash = passwordHash,
                Rol = "Musteri",
                OlusturmaT = DateTime.Now,
                SilindiMi = false
            };

            _context.Kullanicilar.Add(yeniKullanici);
            await _context.SaveChangesAsync();

            return (true, "Kullanıcı başarıyla oluşturuldu.");
        }

        public async Task<(bool BasariliMi, string Mesaj, object? Data)> LoginAsync(KullaniciLoginDto dto)
        {
            var kullanici = await _context.Kullanicilar
                .FirstOrDefaultAsync(u => u.EMail == dto.EMail && !u.SilindiMi);

            if (kullanici == null)
                return (false, "Kullanıcı bulunamadı.", null);

            bool sifreDogruMu = BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.SifreHash);

            if (!sifreDogruMu)
                return (false, "Hatalı şifre.", null);

            var sonuc = new
            {
                Message = "Giriş başarılı!",
                AdSoyad = kullanici.AdSoyad,
                Rol = kullanici.Rol,
                EMail = kullanici.EMail,
                Id = kullanici.ID
            };

            return (true, "Giriş başarılı!", sonuc);
        }

        public async Task<(bool BasariliMi, string Mesaj)> ProfilGuncelleAsync(int id, KullaniciGuncelleDto dto)
        {
            var kullanici = await _context.Kullanicilar.FindAsync(id);

            if (kullanici == null)
                return (false, "Kullanıcı bulunamadı.");

            bool emailKullanimda = await _context.Kullanicilar
                .AnyAsync(u => u.EMail == dto.EMail && u.ID != id);

            if (emailKullanimda)
                return (false, "Bu email zaten başka bir kullanıcı tarafından kullanılıyor.");

            if (!string.IsNullOrWhiteSpace(dto.AdSoyad) && dto.AdSoyad != "string")
                kullanici.AdSoyad = dto.AdSoyad;

            if (!string.IsNullOrWhiteSpace(dto.EMail) && dto.EMail != "string")
                kullanici.EMail = dto.EMail;

            if (!string.IsNullOrWhiteSpace(dto.Sifre) && dto.Sifre != "string")
                kullanici.SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre);

            await _context.SaveChangesAsync();

            return (true, "Bilgileriniz güncellendi.");
        }
    }
}