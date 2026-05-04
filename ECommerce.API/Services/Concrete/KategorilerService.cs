using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Concrete
{
    public class KategorilerService : IKategorilerService
    {
        private readonly AppDbContext _context;

        public KategorilerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Kategori>> GetKategorilerAsync()
        {
            return await _context.Kategoriler
                .Where(x => !x.SilindiMi)
                .ToListAsync();
        }

        public async Task<(bool BasariliMi, string Mesaj, Kategori? Data)> PostKategoriAsync(KategoriEkleDto dto)
        {
            var mevcutVarMi = await _context.Kategoriler
                .AnyAsync(k => k.Ad.ToLower() == dto.Ad.ToLower() && !k.SilindiMi);

            if (mevcutVarMi)
                return (false, "Bu isimde bir kategori zaten mevcut.", null);

            var kategori = new Kategori
            {
                Ad = dto.Ad,
                OlusturmaTarih = DateTime.Now,
                SilindiMi = false
            };

            _context.Kategoriler.Add(kategori);
            await _context.SaveChangesAsync();

            return (true, "Kategori oluşturuldu.", kategori);
        }

        public async Task<(bool BasariliMi, string Mesaj)> KategoriGuncelleAsync(int id, KategoriGuncelleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Ad))
                return (false, "Kategori adı boş olamaz.");

            var mevcutKategori = await _context.Kategoriler.FindAsync(id);

            if (mevcutKategori == null)
                return (false, "Kategori bulunamadı.");

            var isimKullanimdaMi = await _context.Kategoriler
                .AnyAsync(k => k.Ad.ToLower() == dto.Ad.ToLower() && k.ID != id && !k.SilindiMi);

            if (isimKullanimdaMi)
                return (false, "Bu isimde başka bir kategori zaten mevcut.");

            mevcutKategori.Ad = dto.Ad;
            await _context.SaveChangesAsync();

            return (true, "Kategori güncellendi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> KategoriArsivleAsync(int id)
        {
            var kategori = await _context.Kategoriler.FindAsync(id);

            if (kategori == null)
                return (false, "Kategori bulunamadı.");

            if (kategori.SilindiMi)
                return (false, $"{kategori.Ad} zaten arşivde.");

            kategori.SilindiMi = true;

            var bagliUrunler = await _context.Urunler
                .Where(u => u.KategoriId == id && !u.SilindiMi)
                .ToListAsync();

            foreach (var urun in bagliUrunler)
                urun.SilindiMi = true;

            await _context.SaveChangesAsync();

            return (true, $"{kategori.Ad} ve {bagliUrunler.Count} ürün arşivlendi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> KategoriKaliciSilAsync(int id)
        {
            var kategori = await _context.Kategoriler.FindAsync(id);

            if (kategori == null)
                return (false, "Kategori bulunamadı.");

            var aktifUrunVarMi = await _context.Urunler
                .AnyAsync(u => u.KategoriId == id && !u.SilindiMi);

            if (aktifUrunVarMi)
                return (false, "Aktif ürünler var. Önce ürünleri arşivleyin.");

            var arsivdeUrunVarMi = await _context.Urunler
                .AnyAsync(u => u.KategoriId == id && u.SilindiMi);

            if (arsivdeUrunVarMi)
            {
                kategori.SilindiMi = true;
                await _context.SaveChangesAsync();
                return (true, "Arşivlenmiş ürünler bulunduğu için kategori arşive taşındı.");
            }

            _context.Kategoriler.Remove(kategori);
            await _context.SaveChangesAsync();

            return (true, "Kategori kalıcı olarak silindi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> ArsivdenCikarAsync(int id)
        {
            var kategori = await _context.Kategoriler.FindAsync(id);

            if (kategori == null)
                return (false, "Kategori bulunamadı.");

            if (!kategori.SilindiMi)
                return (false, $"{kategori.Ad} zaten yayında.");

            kategori.SilindiMi = false;
            await _context.SaveChangesAsync();

            return (true, $"{kategori.Ad} kategorisi aktif edildi. Ürünleri ayrıca yönetebilirsiniz.");
        }

        public async Task<List<Kategori>> GetArsivlenenKategorilerAsync()
        {
            return await _context.Kategoriler
                .Where(k => k.SilindiMi)
                .ToListAsync();
        }
    }
}