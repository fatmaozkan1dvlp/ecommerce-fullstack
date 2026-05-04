using ECommerce.API.DTOs;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KategorilerController : ControllerBase
    {
        private readonly IKategorilerService _kategorilerService;

        public KategorilerController(IKategorilerService kategorilerService)
        {
            _kategorilerService = kategorilerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetKategoriler()
        {
            var kategoriler = await _kategorilerService.GetKategorilerAsync();
            return Ok(kategoriler);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostKategori([FromBody] KategoriEkleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Ad))
                return BadRequest(new { Message = "Kategori adı boş olamaz." });

            var sonuc = await _kategorilerService.PostKategoriAsync(dto);

            if (!sonuc.BasariliMi)
                return BadRequest(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj, Kategori = sonuc.Data });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> KategoriGuncelle(int id, [FromBody] KategoriGuncelleDto dto)
        {
            var sonuc = await _kategorilerService.KategoriGuncelleAsync(id, dto);

            if (!sonuc.BasariliMi)
                return NotFound(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpPut("arsivle/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> KategoriArsivle(int id)
        {
            var sonuc = await _kategorilerService.KategoriArsivleAsync(id);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Kategori bulunamadı.")
                    return NotFound(new { Message = sonuc.Mesaj });

                return BadRequest(new { Message = sonuc.Mesaj });
            }

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpDelete("kalici-sil/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> KategoriKaliciSil(int id)
        {
            var sonuc = await _kategorilerService.KategoriKaliciSilAsync(id);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Kategori bulunamadı.")
                    return NotFound(new { Message = sonuc.Mesaj });

                return BadRequest(new { Message = sonuc.Mesaj });
            }

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpPut("arsivden-cikar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ArsivdenCikar(int id)
        {
            var sonuc = await _kategorilerService.ArsivdenCikarAsync(id);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Kategori bulunamadı.")
                    return NotFound(new { Message = sonuc.Mesaj });

                return BadRequest(new { Message = sonuc.Mesaj });
            }

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpGet("arsivlenenler")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetArsivlenenKategoriler()
        {
            var arsiv = await _kategorilerService.GetArsivlenenKategorilerAsync();
            return Ok(arsiv);
        }
    }
}