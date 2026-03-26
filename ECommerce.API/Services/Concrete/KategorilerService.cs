using ECommerce.API.Data;
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

        public async Task<Kategori> PostKategoriAsync(Kategori kategori)
        {
            kategori.OlusturmaTarih = DateTime.Now;
            kategori.SilindiMi = false;

            _context.Kategoriler.Add(kategori);
            await _context.SaveChangesAsync();

            return kategori;
        }

        public async Task<(bool BasariliMi, string Mesaj)> KategoriGuncelleAsync(int id, Kategori guncelKategori)
        {
            var mevcutKategori = await _context.Kategoriler.FindAsync(id);

            if (mevcutKategori == null)
                return (false, "Kategori bulunamadı.");

            mevcutKategori.Ad = guncelKategori.Ad;
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

            return (true, $"{kategori.Ad} kategorisi ve içindeki {bagliUrunler.Count} ürün başarıyla arşivlendi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> KategoriKaliciSilAsync(int id)
        {
            var kategori = await _context.Kategoriler.FindAsync(id);

            if (kategori == null)
                return (false, "Kategori bulunamadı.");

            var aktifUrunVarMi = await _context.Urunler
                .AnyAsync(u => u.KategoriId == id && !u.SilindiMi);

            if (aktifUrunVarMi)
                return (false, "Bu kategoride aktif ürünler var. Önce ürünleri silmeli veya başka kategoriye taşımalısınız.");

            var arsivdeUrunVarMi = await _context.Urunler
                .AnyAsync(u => u.KategoriId == id && u.SilindiMi);

            if (arsivdeUrunVarMi)
            {
                kategori.SilindiMi = true;
                await _context.SaveChangesAsync();
                return (true, "Kategoride arşivlenmiş ürünler bulunduğu için kategori arşive taşındı.");
            }

            _context.Kategoriler.Remove(kategori);
            await _context.SaveChangesAsync();

            return (true, "Kategori (içinde ürün bulunmadığı için) kalıcı olarak silindi.");
        }

        public async Task<(bool BasariliMi, string Mesaj)> ArsivdenCikarAsync(int id)
        {
            var kategori = await _context.Kategoriler.FindAsync(id);

            if (kategori == null)
                return (false, "Kategori bulunamadı.");

            if (!kategori.SilindiMi)
                return (false, $"{kategori.Ad} zaten yayında.");

            kategori.SilindiMi = false;

            var bagliUrunler = await _context.Urunler
                .Where(u => u.KategoriId == id && u.SilindiMi)
                .ToListAsync();

            foreach (var urun in bagliUrunler)
                urun.SilindiMi = false;

            await _context.SaveChangesAsync();

            return (true, $"{kategori.Ad} kategorisi ve bağlı ürünleri artık görüntülenebilir.");
        }

        public async Task<List<Kategori>> GetArsivlenenKategorilerAsync()
        {
            return await _context.Kategoriler
                .Where(k => k.SilindiMi)
                .ToListAsync();
        }
    }
}