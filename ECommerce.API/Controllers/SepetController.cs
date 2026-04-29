using ECommerce.API.DTOs;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SepetController : ControllerBase
    {
        private readonly ISepetService _sepetService;

        public SepetController(ISepetService sepetService)
        {
            _sepetService = sepetService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _sepetService.GetUserCartAsync(userId);
            return Ok(result);
        }

        [HttpPost("ekle")]
        public async Task<IActionResult> Ekle([FromBody] SepetEkleDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            dto.KullaniciId = userId;
            var result = await _sepetService.AddToCartAsync(dto);
            if (result) return Ok(new { message = "Ürün sepete eklendi." });
            return BadRequest("Ürün eklenemedi.");
        }

        [HttpDelete("sil/{id}")]
        public async Task<IActionResult> Sil(int id)
        {
            var result = await _sepetService.RemoveFromCartAsync(id);
            if (result) return Ok(new { message = "Ürün sepetten çıkarıldı." });
            return NotFound();
        }

        [HttpPut("guncelle/{id}/{adet}")]
        public async Task<IActionResult> Guncelle(int id, int adet)
        {
            var result = await _sepetService.UpdateQuantityAsync(id, adet);
            if (result) return Ok();
            return BadRequest("Stok yetersiz");
        }

        [HttpGet("ozet")]
        public async Task<IActionResult> Ozet()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var result = await _sepetService.GetCartSummary(userId);

            return Ok(result);
        }
    }
}