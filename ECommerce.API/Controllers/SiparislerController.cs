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

        [HttpGet("tum-siparisler")]
        public async Task<IActionResult> TumSiparisleriGetir()
        {
            var siparisler = await _context.Siparisler
                .Include(s => s.SiparisDetaylari)
                .OrderByDescending(s => s.SiparisTarihi)
                .ToListAsync();
            return Ok(siparisler);
        }

        [HttpGet("dashboard-ozet")]
        public async Task<IActionResult> GetDashboardOzet()
        {
            var toplamSatis = await _context.Siparisler.SumAsync(s => s.ToplamTutar);
            var siparisSayisi = await _context.Siparisler.CountAsync();
            var urunSayisi = await _context.Urunler.CountAsync(u => !u.SilindiMi);
            var sonSiparisler = await _context.Siparisler.OrderByDescending(s => s.SiparisTarihi).Take(5).ToListAsync();

            return Ok(new { ToplamKazanc = toplamSatis, ToplamSiparis = siparisSayisi, AktifUrunSayisi = urunSayisi, SonBesSiparis = sonSiparisler });
        }
    }
}
