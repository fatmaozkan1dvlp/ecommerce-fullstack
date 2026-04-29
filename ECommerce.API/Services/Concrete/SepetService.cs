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
                .Where(x => x.KullaniciId == kullaniciId)
                .Select(s => new SepetListeDto
                {
                    Id = s.Id,
                    UrunId = s.UrunId,
                    UrunAd = s.Urun.Ad,
                    Fiyat = s.Urun.Fiyat,
                    Gorsel = s.Urun.Resimler.FirstOrDefault() != null
                     ? s.Urun.Resimler.FirstOrDefault().Url
                     : "varsayilan.jpg",
                    Adet = s.Adet,
                    Stok = s.Urun.Stok
                }).ToListAsync();
        }

        public async Task<bool> AddToCartAsync(SepetEkleDto dto)
        {
            var urun = await _context.Urunler.FindAsync(dto.UrunId);

            if (urun == null)
                return false;

            var mevcut = await _context.Sepetler
                .FirstOrDefaultAsync(x => x.KullaniciId == dto.KullaniciId && x.UrunId == dto.UrunId);

            int toplamAdet = dto.Adet;

            if (mevcut != null)
                toplamAdet += mevcut.Adet;

            if (toplamAdet > urun.Stok)
                return false;

            if (mevcut != null)
            {
                mevcut.Adet += dto.Adet;
            }
            else
            {
                await _context.Sepetler.AddAsync(new Sepet
                {
                    KullaniciId = dto.KullaniciId,
                    UrunId = dto.UrunId,
                    Adet = dto.Adet
                });
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveFromCartAsync(int sepetId)
        {
            var urun = await _context.Sepetler.FindAsync(sepetId);
            if (urun == null) return false;

            _context.Sepetler.Remove(urun);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateQuantityAsync(int sepetId, int yeniAdet)
        {
            var urunSepet = await _context.Sepetler.FindAsync(sepetId);
            if (urunSepet == null || yeniAdet < 1)
                return false;

            var urun = await _context.Urunler.FindAsync(urunSepet.UrunId);

            if (urun == null || yeniAdet > urun.Stok)
                return false;

            urunSepet.Adet = yeniAdet;

            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<SepetToplamDto> GetCartSummary(int kullaniciId)
        {
            var sepet = await _context.Sepetler
                .Include(x => x.Urun)
                .Where(x => x.KullaniciId == kullaniciId)
                .ToListAsync();

            var liste = sepet.Select(s => new SepetListeDto
            {
                Id = s.Id,
                UrunId = s.UrunId,
                UrunAd = s.Urun.Ad,
                Fiyat = s.Urun.Fiyat,
                Adet = s.Adet
            }).ToList();

            var toplam = liste.Sum(x => x.Fiyat * x.Adet);

            return new SepetToplamDto
            {
                Urunler = liste,
                ToplamFiyat = toplam
            };
        }
    }
}
