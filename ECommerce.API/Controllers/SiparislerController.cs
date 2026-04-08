using ECommerce.API.DTOs;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiparislerController : ControllerBase
    {
        private readonly ISiparislerService _siparislerService;

        public SiparislerController(ISiparislerService siparislerService)
        {
            _siparislerService = siparislerService;
        }

        [HttpPost("olustur")]
        public async Task<IActionResult> SiparisOlustur(SiparisKayitDto dto)
        {
            var sonuc = await _siparislerService.SiparisOlusturAsync(dto);

            if (!sonuc.BasariliMi)
                return BadRequest(sonuc.Mesaj);

            return Ok(new
            {
                Message = sonuc.Mesaj,
                SiparisId = sonuc.SiparisId
            });
        }

        [HttpPut("durum-guncelle")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DurumGuncelle(SiparisDurumGuncelleDto dto)
        {
            var sonuc = await _siparislerService.DurumGuncelleAsync(dto);

            if (!sonuc.BasariliMi)
                return NotFound(sonuc.Mesaj);

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpGet("dashboard-ozet")]
        public async Task<IActionResult> GetDashboardOzet()
        {
            var sonuc = await _siparislerService.GetDashboardOzetAsync();
            return Ok(sonuc);
        }

        [HttpGet("duruma-gore")]
        public async Task<IActionResult> SiparisleriGetirByDurum(string durum)
        {
            var sonuc = await _siparislerService.SiparisleriGetirByDurumAsync(durum);
            return Ok(sonuc);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSiparisDetay(int id)
        {
            var siparis = await _siparislerService.GetSiparisDetayAsync(id);

            if (siparis == null)
                return NotFound("Sipariş bulunamadı");

            return Ok(siparis);
        }
    }
}