using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Concrete
{
    public class SiparislerService : ISiparislerService
    {
        private readonly AppDbContext _context;

        private static readonly string[] GecerliDurumlar =
            { "Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi", "İptal Edildi" };

        public SiparislerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool BasariliMi, string Mesaj, int SiparisId)> SiparisOlusturAsync(
            int kullaniciId, SiparisKayitDto dto)
        {

            if (dto.Sepet == null || dto.Sepet.Count == 0)
                return (false, "Sepet boş olamaz.", 0);

            if (string.IsNullOrWhiteSpace(dto.TamAdres))
                return (false, "Adres zorunludur.", 0);

            if (string.IsNullOrWhiteSpace(dto.Telefon))
                return (false, "Telefon zorunludur.", 0);

            var yeniSiparis = new Siparis
            {
                KullaniciId = kullaniciId,
                TamAdres = dto.TamAdres,
                Sehir = dto.Sehir,
                Telefon = dto.Telefon,
                SiparisTarihi = DateTime.Now,
                ToplamTutar = 0
            };

            foreach (var item in dto.Sepet)
            {
                if (item.Adet <= 0)
                    return (false, "Sipariş adedi en az 1 olmalıdır.", 0);

                var urun = await _context.Urunler
                    .FirstOrDefaultAsync(u => u.ID == item.UrunId && !u.SilindiMi);

                if (urun == null)
                    return (false, $"Ürün bulunamadı (ID: {item.UrunId}).", 0);

                if (urun.Stok < item.Adet)
                    return (false, $"'{urun.Ad}' için yetersiz stok. Mevcut: {urun.Stok}", 0);

                var detay = new SiparisDetay
                {
                    UrunId = item.UrunId,
                    Adet = item.Adet,
                    BirimFiyat = urun.Fiyat
                };

                yeniSiparis.SiparisDetaylari.Add(detay);
                yeniSiparis.ToplamTutar += detay.BirimFiyat * detay.Adet;
                urun.Stok -= item.Adet;
            }

            _context.Siparisler.Add(yeniSiparis);
            var kullaniciSepeti = await _context.Sepetler
                                .Where(s => s.KullaniciId == kullaniciId)
                                .ToListAsync();

            _context.Sepetler.RemoveRange(kullaniciSepeti);
            await _context.SaveChangesAsync();

            return (true, "Sipariş başarıyla alındı.", yeniSiparis.ID);
        }

        public async Task<(bool BasariliMi, string Mesaj)> DurumGuncelleAsync(SiparisDurumGuncelleDto dto)
        {
            if (!GecerliDurumlar.Contains(dto.YeniDurum))
                return (false, $"Geçersiz durum. Geçerli değerler: {string.Join(", ", GecerliDurumlar)}");

            var siparis = await _context.Siparisler.FindAsync(dto.SiparisId);

            if (siparis == null)
                return (false, "Sipariş bulunamadı.");

            siparis.Durum = dto.YeniDurum;
            await _context.SaveChangesAsync();

            return (true, $"Durum '{dto.YeniDurum}' olarak güncellendi.");
        }

        public async Task<object> GetDashboardOzetAsync()
        {
            var toplamSatis = await _context.Siparisler
                .Where(s => s.Durum != "İptal Edildi")
                .SumAsync(s => (decimal?)s.ToplamTutar) ?? 0;

            var siparisSayisi = await _context.Siparisler
                .CountAsync(s => s.Durum != "İptal Edildi");

            var urunSayisi = await _context.Urunler
                .CountAsync(u => !u.SilindiMi);

            var sonSiparisler = await _context.Siparisler
                .Include(s => s.Kullanici)
                .OrderByDescending(s => s.SiparisTarihi)
                .Take(5)
                .Select(s => new
                {
                    s.ID,
                    s.SiparisTarihi,
                    s.ToplamTutar,
                    s.Durum,
                    MusteriAdi = s.Kullanici != null ? s.Kullanici.AdSoyad : "Bilinmeyen"
                })
                .ToListAsync();

            return new
            {
                ToplamKazanc = toplamSatis,
                ToplamSiparis = siparisSayisi,
                AktifUrunSayisi = urunSayisi,
                SonBesSiparis = sonSiparisler
            };
        }

        public async Task<List<object>> SiparisleriGetirByDurumAsync(string durum)
        {
            var query = _context.Siparisler
                .Include(s => s.Kullanici)
                .AsQueryable();

            if (!string.IsNullOrEmpty(durum) && durum != "Hepsi")
                query = query.Where(s => s.Durum == durum);

            var result = await query
                .OrderByDescending(s => s.SiparisTarihi)
                .Select(s => new
                {
                    s.ID,
                    s.SiparisTarihi,
                    s.ToplamTutar,
                    s.Durum,
                    MusteriAdi = s.Kullanici != null ? s.Kullanici.AdSoyad : "Bilinmeyen"
                })
                .ToListAsync();

            return result.Cast<object>().ToList();
        }

        public async Task<object?> GetSiparisDetayAsync(int id, int kullaniciId, bool isAdmin)
        {
            var siparis = await _context.Siparisler
                .Include(s => s.Kullanici)
                .Include(s => s.SiparisDetaylari)
                    .ThenInclude(d => d.Urun)
                        .ThenInclude(u => u.Resimler)
                .FirstOrDefaultAsync(s => s.ID == id);

            if (siparis == null) return null;

            if (!isAdmin && siparis.KullaniciId != kullaniciId)
                return null;

            return new
            {
                id = siparis.ID,
                musteriAdi = siparis.Kullanici?.AdSoyad ?? "Bilinmeyen",
                telefon = siparis.Telefon,
                adres = $"{siparis.TamAdres} / {siparis.Sehir}",
                toplamTutar = siparis.ToplamTutar,
                durum = siparis.Durum,
                siparisTarihi = siparis.SiparisTarihi,
                detaylar = siparis.SiparisDetaylari.Select(d => new
                {
                    id = d.ID,
                    urunAdi = d.Urun?.Ad ?? "Ürün Silinmiş",
                    urunResimUrl = d.Urun?.Resimler
                        .OrderBy(r => r.SiraNo)
                        .Select(r => r.Url)
                        .FirstOrDefault() ?? "",
                    adet = d.Adet,
                    birimFiyat = d.BirimFiyat,
                    araToplam = d.Adet * d.BirimFiyat
                }).ToList()
            };
        }

        public async Task<List<object>> GetKullanicininSiparisleriAsync(int kullaniciId)
        {
            var siparisler = await _context.Siparisler
                .Where(s => s.KullaniciId == kullaniciId)
                .OrderByDescending(s => s.SiparisTarihi)
                .Select(s => new
                {
                    s.ID,
                    s.SiparisTarihi,
                    s.ToplamTutar,
                    s.Durum
                })
                .ToListAsync();

            return siparisler.Cast<object>().ToList();
        }


        public async Task<(bool BasariliMi, string Mesaj)> SiparisIptalEtAsync(int siparisId, int kullaniciId)
        {
            var siparis = await _context.Siparisler
                .Include(s => s.SiparisDetaylari)
                .FirstOrDefaultAsync(s => s.ID == siparisId && s.KullaniciId == kullaniciId);

            if (siparis == null)
                return (false, "Sipariş bulunamadı.");

            if (siparis.Durum != "Alındı")
                return (false, "Yalnızca 'Alındı' durumundaki siparişler iptal edilebilir.");

            foreach (var detay in siparis.SiparisDetaylari)
            {
                var urun = await _context.Urunler.FindAsync(detay.UrunId);
                if (urun != null)
                    urun.Stok += detay.Adet;
            }

            siparis.Durum = "İptal Edildi";
            await _context.SaveChangesAsync();

            return (true, "Sipariş iptal edildi ve stoklar güncellendi.");
        }
    }
}