using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Concrete
{
    public class FavorilerService : IFavorilerService
    {
        private readonly AppDbContext _context;

        public FavorilerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<FavorilerDto>> GetUserFavoritesAsync(int kullaniciId)
        {
            return await _context.Favoriler
                .Include(x => x.Urun)
                    .ThenInclude(u => u.Resimler)
                .Where(x => x.KullaniciId == kullaniciId && !x.Urun.SilindiMi)
                .Select(f => new FavorilerDto
                {
                    Id = f.Id,
                    UrunId = f.UrunId,
                    UrunAd = f.Urun.Ad,
                    Fiyat = f.Urun.Fiyat,
                    UrunSlug = f.Urun.Slug,
                    Gorsel = f.Urun.Resimler
                        .OrderBy(r => r.SiraNo)
                        .Select(r => r.Url)
                        .FirstOrDefault() ?? "varsayilan.jpg"
                })
                .ToListAsync();
        }

        public async Task<(bool BasariliMi, string Mesaj)> ToggleFavoriteAsync(int kullaniciId, int urunId)
        {
            var urun = await _context.Urunler
                .FirstOrDefaultAsync(u => u.ID == urunId && !u.SilindiMi);

            if (urun == null)
                return (false, "Ürün bulunamadı.");

            var mevcut = await _context.Favoriler
                .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.UrunId == urunId);

            if (mevcut != null)
            {
                _context.Favoriler.Remove(mevcut);
                await _context.SaveChangesAsync();
                return (true, "Favorilerden çıkarıldı.");
            }

            await _context.Favoriler.AddAsync(new Favoriler
            {
                KullaniciId = kullaniciId,
                UrunId = urunId
            });

            await _context.SaveChangesAsync();
            return (true, "Favorilere eklendi.");
        }

        public async Task<bool> IsInFavoriteAsync(int kullaniciId, int urunId)
        {
            return await _context.Favoriler
                .AnyAsync(x => x.KullaniciId == kullaniciId && x.UrunId == urunId);
        }
    }
}