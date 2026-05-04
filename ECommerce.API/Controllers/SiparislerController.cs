using ECommerce.API.DTOs;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        private bool IsAdmin() =>
            User.IsInRole("Admin");

        [Authorize]
        [HttpPost("olustur")]
        public async Task<IActionResult> SiparisOlustur([FromBody] SiparisKayitDto dto)
        {
            var sonuc = await _siparislerService.SiparisOlusturAsync(GetUserId(), dto);

            if (!sonuc.BasariliMi)
                return BadRequest(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj, SiparisId = sonuc.SiparisId });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("durum-guncelle")]
        public async Task<IActionResult> DurumGuncelle([FromBody] SiparisDurumGuncelleDto dto)
        {
            var sonuc = await _siparislerService.DurumGuncelleAsync(dto);

            if (!sonuc.BasariliMi)
                return BadRequest(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("dashboard-ozet")]
        public async Task<IActionResult> GetDashboardOzet()
        {
            var sonuc = await _siparislerService.GetDashboardOzetAsync();
            return Ok(sonuc);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("duruma-gore")]
        public async Task<IActionResult> SiparisleriGetirByDurum([FromQuery] string durum = "Hepsi")
        {
            var sonuc = await _siparislerService.SiparisleriGetirByDurumAsync(durum);
            return Ok(sonuc);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSiparisDetay(int id)
        {
            var siparis = await _siparislerService.GetSiparisDetayAsync(id, GetUserId(), IsAdmin());

            if (siparis == null)
                return NotFound(new { Message = "Sipariş bulunamadı." });

            return Ok(siparis);
        }

        [Authorize]
        [HttpGet("siparislerim")]
        public async Task<IActionResult> GetSiparislerim()
        {
            var sonuc = await _siparislerService.GetKullanicininSiparisleriAsync(GetUserId());
            return Ok(sonuc);
        }

        [Authorize]
        [HttpPut("{id}/iptal")]
        public async Task<IActionResult> SiparisIptalEt(int id)
        {
            var sonuc = await _siparislerService.SiparisIptalEtAsync(id, GetUserId());

            if (!sonuc.BasariliMi)
                return BadRequest(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj });
        }
    }
}