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

        public SiparislerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool BasariliMi, string Mesaj, int SiparisId)> SiparisOlusturAsync(SiparisKayitDto dto)
        {
            var yeniSiparis = new Siparis
            {
                KullaniciId = dto.KullaniciId,
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
                    return (false, $"{item.UrunId} ID'li ürün aktif değil.", 0);

                if (urun.Stok < item.Adet)
                    return (false, $"{urun.Ad} için yetersiz stok!", 0);

                var detay = new SiparisDetay
                {
                    UrunId = item.UrunId,
                    Adet = item.Adet,
                    BirimFiyat = urun.Fiyat
                };

                yeniSiparis.SiparisDetaylari.Add(detay);
                yeniSiparis.ToplamTutar += (detay.BirimFiyat * detay.Adet);

                urun.Stok -= item.Adet;
            }

            _context.Siparisler.Add(yeniSiparis);
            await _context.SaveChangesAsync();

            return (true, "Sipariş başarıyla alındı", yeniSiparis.ID);
        }

        public async Task<(bool BasariliMi, string Mesaj)> DurumGuncelleAsync(SiparisDurumGuncelleDto dto)
        {
            var siparis = await _context.Siparisler.FindAsync(dto.SiparisId);

            if (siparis == null)
                return (false, "Sipariş bulunamadı.");

            siparis.Durum = dto.YeniDurum;
            await _context.SaveChangesAsync();

            return (true, $"Durum '{dto.YeniDurum}' olarak güncellendi.");
        }

        public async Task<object> GetDashboardOzetAsync()
        {
            var toplamSatis = await _context.Siparisler.SumAsync(s => (decimal?)s.ToplamTutar) ?? 0;
            var siparisSayisi = await _context.Siparisler.CountAsync();
            var urunSayisi = await _context.Urunler.CountAsync(u => !u.SilindiMi);

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
                    MusteriAdi = s.Kullanici != null ? s.Kullanici.AdSoyad : "Bilinmeyen Müşteri"
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
            var query = _context.Siparisler.AsQueryable();

            if (!string.IsNullOrEmpty(durum) && durum != "Hepsi")
                query = query.Where(s => s.Durum == durum);

            var result = await query
                .OrderByDescending(s => s.SiparisTarihi)
                .Select(s => new
                {
                    s.ID,
                    s.SiparisTarihi,
                    s.ToplamTutar,
                    s.Durum
                })
                .ToListAsync();

            return result.Cast<object>().ToList();
        }

        public async Task<object?> GetSiparisDetayAsync(int id)
        {
            var siparis = await _context.Siparisler
                .Include(s => s.Kullanici)
                .Include(s => s.SiparisDetaylari)
                    .ThenInclude(d => d.Urun)
                        .ThenInclude(u => u.Resimler)
                .FirstOrDefaultAsync(s => s.ID == id);

            if (siparis == null) return null;

            return new
            {
                id = siparis.ID,
                musteriAdi = siparis.Kullanici?.AdSoyad ?? "Müşteri Bilgisi Yok",
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
                    birimFiyat = d.BirimFiyat
                }).ToList()
            };
        }
    }
}