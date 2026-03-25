using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiparislerController : ControllerBase
    {
        private readonly IRepository<Siparis> _siparisRepo;
        private readonly IRepository<Urun> _urunRepo;
        private readonly AppDbContext _context;

        public SiparislerController(IRepository<Siparis> siparisRepo, IRepository<Urun> urunRepo, AppDbContext context)
        {
            _siparisRepo = siparisRepo;
            _urunRepo = urunRepo;
            _context = context;
        }

        [HttpPost("olustur")]
        public async Task<IActionResult> SiparisOlustur(SiparisKayitDto dto)
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
                if (item.Adet <= 0) return BadRequest("Sipariş adedi en az 1 olmalıdır.");

                var urun = await _context.Urunler.FirstOrDefaultAsync(u => u.ID == item.UrunId && !u.SilindiMi);
                if (urun == null) return BadRequest($"{item.UrunId} ID'li ürün aktif değil.");
                if (urun.Stok < item.Adet) return BadRequest($"{urun.Ad} için yetersiz stok!");

                var detay = new SiparisDetay
                {
                    UrunId = item.UrunId,
                    Adet = item.Adet,
                    BirimFiyat = urun.Fiyat
                };

                yeniSiparis.SiparisDetaylari.Add(detay);
                yeniSiparis.ToplamTutar += (detay.BirimFiyat * detay.Adet);

                urun.Stok -= item.Adet;
                _urunRepo.Update(urun);
            }

            await _siparisRepo.AddAsync(yeniSiparis);
            await _siparisRepo.SaveAsync();

            return Ok(new { Message = "Sipariş başarıyla alındı", SiparisId = yeniSiparis.ID });
        }

        [HttpPut("durum-guncelle")]
        public async Task<IActionResult> DurumGuncelle(SiparisDurumGuncelleDto dto)
        {
            var siparis = await _siparisRepo.GetByIdAsync(dto.SiparisId);
            if (siparis == null) return NotFound("Sipariş bulunamadı.");

            siparis.Durum = dto.YeniDurum;
            await _siparisRepo.SaveAsync();
            return Ok(new { Message = $"Durum '{dto.YeniDurum}' olarak güncellendi." });
        }

        //[HttpGet("tum-siparisler")]
        //public async Task<IActionResult> TumSiparisleriGetir()
        //{
        //    var siparisler = await _context.Siparisler
        //        .Include(s => s.SiparisDetaylari)
        //        .OrderByDescending(s => s.SiparisTarihi)
        //        .ToListAsync();
        //    return Ok(siparisler);
        //}

        [HttpGet("dashboard-ozet")]
        public async Task<IActionResult> GetDashboardOzet()
        {
            var toplamSatis = await _context.Siparisler.SumAsync(s => s.ToplamTutar);
            var siparisSayisi = await _context.Siparisler.CountAsync();
            var urunSayisi = await _context.Urunler.CountAsync(u => !u.SilindiMi);
            var sonSiparisler = await _context.Siparisler.OrderByDescending(s => s.SiparisTarihi).Take(5).ToListAsync();

            return Ok(new { ToplamKazanc = toplamSatis, ToplamSiparis = siparisSayisi, AktifUrunSayisi = urunSayisi, SonBesSiparis = sonSiparisler });
        }

        [HttpGet("duruma-gore")]
        public async Task<IActionResult> SiparisleriGetirByDurum(string durum)
        {
            var query = _context.Siparisler.AsQueryable();

            if (!string.IsNullOrEmpty(durum) && durum != "Hepsi")
            {
                query = query.Where(s => s.Durum == durum);
            }

            var result = await query
                .OrderByDescending(s => s.SiparisTarihi)
                .Select(s => new { // Basit anonim nesne veya DTO
                    s.ID,
                    s.SiparisTarihi,
                    s.ToplamTutar,
                    s.Durum
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSiparisDetay(int id)
        {
            // Veriyi veritabanından tüm dallarıyla çekiyoruz
            var siparis = await _context.Siparisler
                .Include(s => s.Kullanici)
                .Include(s => s.SiparisDetaylari)
                    .ThenInclude(d => d.Urun)
                        .ThenInclude(u => u.Resimler)
                .FirstOrDefaultAsync(s => s.ID == id);

            if (siparis == null) return NotFound("Sipariş bulunamadı");

            // JSON dönerken isimleri küçük harf yapıyoruz ki React görsün
            return Ok(new
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
                    // Ürünün ilk resmini alıyoruz, yoksa boş döner
                    urunResimUrl = d.Urun?.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).FirstOrDefault() ?? "",
                    adet = d.Adet,
                    birimFiyat = d.BirimFiyat
                }).ToList()
            });
        }
    }
}
