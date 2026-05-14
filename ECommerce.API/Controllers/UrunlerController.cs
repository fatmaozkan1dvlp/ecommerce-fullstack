using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UrunlerController : ControllerBase
    {
        private readonly IUrunlerService _urunlerService;

        public UrunlerController(IUrunlerService urunlerService)
        {
            _urunlerService = urunlerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UrunlerDto>>> GetUrunler()
        {
            var urunler = await _urunlerService.GetUrunlerAsync();
            return Ok(urunler);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> PostUrun([FromBody] UrunEkleDto dto)
        {
            var yeniUrun = await _urunlerService.PostUrunAsync(dto);
            return Ok(new
            {
                Message = "Ürün başarıyla eklendi.",
                Id = yeniUrun.ID,
                Ad = yeniUrun.Ad
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUrunById(int id)
        {
            var urun = await _urunlerService.GetUrunByIdAsync(id);

            if (urun == null)
                return NotFound();

            return Ok(urun);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UrunGuncelle(int id, [FromBody] UrunGuncelleDto dto)
        {
            var sonuc = await _urunlerService.UrunGuncelleAsync(id, dto);

            if (!sonuc.BasariliMi)
                return NotFound(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj, Urun = sonuc.Data });
        }

        [HttpPut("arsivle/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UrunArsivle(int id)
        {
            var sonuc = await _urunlerService.UrunArsivleAsync(id);

            if (!sonuc.BasariliMi)
                return NotFound(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpDelete("kalici-sil/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UrunKaliciSil(int id)
        {
            var sonuc = await _urunlerService.UrunKaliciSilAsync(id);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Ürün bulunamadı.")
                    return NotFound(new { Message = sonuc.Mesaj });

                return BadRequest(new { Message = sonuc.Mesaj });
            }

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpPut("arsivden-cikar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UrunArsivdenCikar(int id)
        {
            var sonuc = await _urunlerService.UrunArsivdenCikarAsync(id);

            if (!sonuc.BasariliMi)
                return NotFound(new { Message = sonuc.Mesaj });

            return Ok(new { Message = sonuc.Mesaj });
        }

        [HttpGet("arsivdekiler")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UrunlerDto>>> GetArsivdekiUrunler()
        {
            var urunler = await _urunlerService.GetArsivdekiUrunlerAsync();
            return Ok(urunler);
        }

        [HttpPost("{id}/resim-ekle")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ResimEkle(int id, [FromForm] ResimEkleDto request)
        {
            var sonuc = await _urunlerService.ResimEkleAsync(id, request.Dosya);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Ürün bulunamadı.")
                    return NotFound(new { Message = sonuc.Mesaj });

                return BadRequest(new { Message = sonuc.Mesaj });
            }

            return Ok(sonuc.Data);
        }

        [HttpDelete("resim-sil/{resimId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResimSil(int resimId)
        {
            var sonuc = await _urunlerService.ResimSilAsync(resimId);

            if (!sonuc.BasariliMi)
                return NotFound(sonuc.Mesaj);

            return Ok(sonuc.Mesaj);
        }

        [HttpPut("resim-kapak-yap/{resimId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResimKapakYap(int resimId)
        {
            var sonuc = await _urunlerService.ResimKapakYapAsync(resimId);

            if (!sonuc.BasariliMi)
                return NotFound(sonuc.Mesaj);

            return Ok(sonuc.Mesaj);
        }

        [HttpGet("kategori/{kategoriId}")]
        public async Task<IActionResult> GetUrunlerByKategori(int kategoriId)
        {
            var sonuc = await _urunlerService.GetUrunlerByKategoriAsync(kategoriId);

            if (!sonuc.BasariliMi)
                return NotFound(new { Message = sonuc.Mesaj });

            if (sonuc.Mesaj == "Bu kategoriye ait henüz bir ürün eklenmemiş.")
            {
                return Ok(new
                {
                    Message = sonuc.Mesaj,
                    Data = sonuc.Data
                });
            }

            return Ok(sonuc.Data);
        }

        [HttpGet("ara/{kelime}")]
        public async Task<IActionResult> UrunAra(string kelime)
        {
            var sonuc = await _urunlerService.UrunAraAsync(kelime);

            if (!sonuc.BasariliMi)
            {
                if (sonuc.Mesaj == "Arama yapmak için en az 2 karakter girmelisiniz.")
                    return BadRequest(new { Message = sonuc.Mesaj });

                return NotFound(new { Message = sonuc.Mesaj });
            }

            return Ok(sonuc.Data);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetUrunBySlug(string slug)
        {
            var urun = await _urunlerService.GetUrunBySlugAsync(slug);
            if (urun == null) return NotFound();
            return Ok(urun);
        }

        [HttpGet("kategori/slug/{slug}")]
        public async Task<IActionResult> GetUrunlerByKategoriSlug(string slug)
        {
            var sonuc = await _urunlerService.GetUrunlerByKategoriSlugAsync(slug);
            if (!sonuc.BasariliMi) return NotFound(new { Message = sonuc.Mesaj });
            return Ok(sonuc.Data);
        }
    }
}