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
                .Where(x => x.KullaniciId == kullaniciId)
                .Select(f => new FavorilerDto
                {
                    Id = f.Id,
                    UrunId = f.UrunId,
                    UrunAd = f.Urun != null ? f.Urun.Ad : "Ürün bulunamadı",
                    Fiyat = f.Urun != null ? f.Urun.Fiyat : 0,

                    Gorsel = f.Urun != null && f.Urun.Resimler.Any()
                        ? f.Urun.Resimler.First().Url
                        : "varsayilan.jpg"
                })
                .ToListAsync();
        }

        public async Task<string> ToggleFavoriteAsync(FavoriIslemDto dto)
        {
            var urun = await _context.Urunler.FindAsync(dto.UrunId);

            if (urun == null)
                return "Ürün bulunamadı";

            var mevcut = await _context.Favoriler
                .FirstOrDefaultAsync(x => x.KullaniciId == dto.KullaniciId && x.UrunId == dto.UrunId);

            if (mevcut != null)
            {
                _context.Favoriler.Remove(mevcut);
                await _context.SaveChangesAsync();
                return "Favorilerden çıkarıldı.";
            }

            await _context.Favoriler.AddAsync(new Favoriler
            {
                KullaniciId = dto.KullaniciId,
                UrunId = dto.UrunId
            });

            await _context.SaveChangesAsync();

            return "Favorilere eklendi.";
        }

        public async Task<bool> IsInFavoriteAsync(int kullaniciId, int urunId)
        {
            return await _context.Favoriler
                .AnyAsync(x => x.KullaniciId == kullaniciId && x.UrunId == urunId);
        }
    }
}
