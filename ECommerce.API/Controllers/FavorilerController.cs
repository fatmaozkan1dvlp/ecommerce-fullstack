using Microsoft.AspNetCore.Mvc;
using ECommerce.API.Services.Interfaces;
using ECommerce.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ECommerce.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FavorilerController : ControllerBase
    {
        private readonly IFavorilerService _favoriService;

        public FavorilerController(IFavorilerService favoriService)
        {
            _favoriService = favoriService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var result = await _favoriService.GetUserFavoritesAsync(userId);

            return Ok(result);
        }

        [HttpPost("ekle-cikar")]
        public async Task<IActionResult> ToggleFavori([FromBody]FavoriIslemDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            dto.KullaniciId = userId;

            var result = await _favoriService.ToggleFavoriteAsync(dto);

            return Ok(new { message = result });
        }
        [HttpGet("kontrol/{urunId}")]
        public async Task<IActionResult> IsFavorite(int urunId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var result = await _favoriService.IsInFavoriteAsync(userId, urunId);

            return Ok(result);
        }
    }
}
