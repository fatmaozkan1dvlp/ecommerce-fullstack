using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
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
        public async Task<ActionResult<IEnumerable<Kategori>>> GetKategoriler()
        {
            var kategoriler = await _kategorilerService.GetKategorilerAsync();
            return Ok(kategoriler);
        }

        [HttpPost]
        public async Task<ActionResult<Kategori>> PostKategori(Kategori kategori)
        {
            var yeniKategori = await _kategorilerService.PostKategoriAsync(kategori);
            return Ok(yeniKategori);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> KategoriGuncelle(int id, Kategori guncelKategori)
        {
            var sonuc = await _kategorilerService.KategoriGuncelleAsync(id, guncelKategori);

            if (!sonuc.BasariliMi)
                return NotFound(sonuc.Mesaj);

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpPut("arsivle/{id}")]
        public async Task<IActionResult> KategoriArsivle(int id)
        {
            var sonuc = await _kategorilerService.KategoriArsivleAsync(id);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Kategori bulunamadı.")
                    return NotFound(sonuc.Mesaj);

                return BadRequest(sonuc.Mesaj);
            }

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpDelete("kalici-sil/{id}")]
        public async Task<IActionResult> KategoriKaliciSil(int id)
        {
            var sonuc = await _kategorilerService.KategoriKaliciSilAsync(id);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Kategori bulunamadı.")
                    return NotFound(sonuc.Mesaj);

                return BadRequest(sonuc.Mesaj);
            }

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpPut("arsivden-cikar/{id}")]
        public async Task<IActionResult> ArsivdenCikar(int id)
        {
            var sonuc = await _kategorilerService.ArsivdenCikarAsync(id);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Kategori bulunamadı.")
                    return NotFound(sonuc.Mesaj);

                return BadRequest(sonuc.Mesaj);
            }

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpGet("arsivlenenler")]
        public async Task<IActionResult> GetArsivlenenKategoriler()
        {
            var arsiv = await _kategorilerService.GetArsivlenenKategorilerAsync();
            return Ok(arsiv);
        }
    }
}