using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Concrete
{
    public class SepetService : ISepetService
    {
        private readonly AppDbContext _context;

        public SepetService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SepetListeDto>> GetUserCartAsync(int kullaniciId)
        {
            return await _context.Sepetler
                .Include(x => x.Urun)
                    .ThenInclude(u => u.Resimler)
                .Where(x => x.KullaniciId == kullaniciId && !x.Urun.SilindiMi)
                .Select(s => new SepetListeDto
                {
                    Id = s.Id,
                    UrunId = s.UrunId,
                    UrunAd = s.Urun.Ad,
                    Fiyat = s.Urun.Fiyat,
                    Gorsel = s.Urun.Resimler
                        .OrderBy(r => r.SiraNo)
                        .Select(r => r.Url)
                        .FirstOrDefault() ?? "varsayilan.jpg",
                    Adet = s.Adet,
                    Stok = s.Urun.Stok
                })
                .ToListAsync();
        }

        public async Task<(bool BasariliMi, string Mesaj)> AddToCartAsync(int kullaniciId, SepetEkleDto dto)
        {
            if (dto.Adet < 1)
                return (false, "Adet en az 1 olmalıdır.");

            var urun = await _context.Urunler
                .FirstOrDefaultAsync(u => u.ID == dto.UrunId && !u.SilindiMi);

            if (urun == null)
                return (false, "Ürün bulunamadı.");

            if (urun.Stok == 0)
                return (false, "Ürün stokta yok.");

            var mevcut = await _context.Sepetler
                .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.UrunId == dto.UrunId);

            int toplamAdet = dto.Adet + (mevcut?.Adet ?? 0);

            if (toplamAdet > urun.Stok)
                return (false, $"Stok yetersiz. Mevcut stok: {urun.Stok}");

            if (mevcut != null)
                mevcut.Adet += dto.Adet;
            else
                await _context.Sepetler.AddAsync(new Sepet
                {
                    KullaniciId = kullaniciId,
                    UrunId = dto.UrunId,
                    Adet = dto.Adet
                });

            await _context.SaveChangesAsync();
            return (true, "Ürün sepete eklendi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> RemoveFromCartAsync(int sepetId, int kullaniciId)
        {
            var sepetUrun = await _context.Sepetler
                .FirstOrDefaultAsync(s => s.Id == sepetId && s.KullaniciId == kullaniciId); 

            if (sepetUrun == null)
                return (false, "Sepet kaydı bulunamadı.");

            _context.Sepetler.Remove(sepetUrun);
            await _context.SaveChangesAsync();
            return (true, "Ürün sepetten çıkarıldı.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> UpdateQuantityAsync(int sepetId, int kullaniciId, int yeniAdet)
        {
            if (yeniAdet < 1)
                return (false, "Adet en az 1 olmalıdır.");

            var sepetUrun = await _context.Sepetler
                .FirstOrDefaultAsync(s => s.Id == sepetId && s.KullaniciId == kullaniciId); 

            if (sepetUrun == null)
                return (false, "Sepet kaydı bulunamadı.");

            var urun = await _context.Urunler.FindAsync(sepetUrun.UrunId);

            if (urun == null)
                return (false, "Ürün bulunamadı.");

            if (yeniAdet > urun.Stok)
                return (false, $"Stok yetersiz. Mevcut stok: {urun.Stok}");

            sepetUrun.Adet = yeniAdet;
            await _context.SaveChangesAsync();
            return (true, "Adet güncellendi.");
        }

        public async Task<SepetToplamDto> GetCartSummaryAsync(int kullaniciId)
        {
            var sepet = await _context.Sepetler
                .Include(x => x.Urun)
                .Where(x => x.KullaniciId == kullaniciId && !x.Urun.SilindiMi)
                .ToListAsync();

            var liste = sepet.Select(s => new SepetListeDto
            {
                Id = s.Id,
                UrunId = s.UrunId,
                UrunAd = s.Urun.Ad,
                Fiyat = s.Urun.Fiyat,
                Adet = s.Adet
            }).ToList();

            return new SepetToplamDto
            {
                Urunler = liste,
                ToplamFiyat = liste.Sum(x => x.Fiyat * x.Adet)
            };
        }
    }
}