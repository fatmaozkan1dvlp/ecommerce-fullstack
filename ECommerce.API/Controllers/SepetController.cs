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

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _sepetService.GetUserCartAsync(GetUserId());
            return Ok(result);
        }

        [HttpPost("ekle")]
        public async Task<IActionResult> Ekle([FromBody] SepetEkleDto dto)
        {
            var result = await _sepetService.AddToCartAsync(GetUserId(), dto);

            if (!result.BasariliMi)
                return BadRequest(new { Message = result.Mesaj });

            return Ok(new { Message = result.Mesaj });
        }

        [HttpDelete("sil/{id}")]
        public async Task<IActionResult> Sil(int id)
        {
            var result = await _sepetService.RemoveFromCartAsync(id, GetUserId());

            if (!result.BasariliMi)
                return NotFound(new { Message = result.Mesaj });

            return Ok(new { Message = result.Mesaj });
        }

        [HttpPut("guncelle/{id}")]
        public async Task<IActionResult> Guncelle(int id, [FromBody] int adet)
        {
            var result = await _sepetService.UpdateQuantityAsync(id, GetUserId(), adet);

            if (!result.BasariliMi)
                return BadRequest(new { Message = result.Mesaj });

            return Ok(new { Message = result.Mesaj });
        }

        [HttpGet("ozet")]
        public async Task<IActionResult> Ozet()
        {
            var result = await _sepetService.GetCartSummaryAsync(GetUserId());
            return Ok(result);
        }
    }
}