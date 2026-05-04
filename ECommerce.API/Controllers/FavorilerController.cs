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
    public class FavorilerController : ControllerBase
    {
        private readonly IFavorilerService _favorilerService;

        public FavorilerController(IFavorilerService favorilerService)
        {
            _favorilerService = favorilerService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpGet]
        public async Task<IActionResult> GetFavoriler()
        {
            var result = await _favorilerService.GetUserFavoritesAsync(GetUserId());
            return Ok(result);
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> Toggle([FromBody] FavoriIslemDto dto)
        {
            var result = await _favorilerService
                .ToggleFavoriteAsync(GetUserId(), dto.UrunId);

            if (!result.BasariliMi)
                return BadRequest(new { Message = result.Mesaj });

            return Ok(new { Message = result.Mesaj });
        }

        [HttpGet("kontrol/{urunId}")]
        public async Task<IActionResult> IsInFavorite(int urunId)
        {
            var result = await _favorilerService
                .IsInFavoriteAsync(GetUserId(), urunId);

            return Ok(new { IsFavorite = result });
        }
    }
}