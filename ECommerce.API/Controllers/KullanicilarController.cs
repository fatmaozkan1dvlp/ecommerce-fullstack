using ECommerce.API.DTOs;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KullanicilarController : ControllerBase
    {
        private readonly IKullanicilarService _kullanicilarService;

        public KullanicilarController(IKullanicilarService kullanicilarService)
        {
            _kullanicilarService = kullanicilarService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMusteriler()
        {
            var result = await _kullanicilarService.GetMusterilerAsync();
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(KullaniciRegisterDto dto)
        {
            var result = await _kullanicilarService.RegisterAsync(dto);

            if (!result.BasariliMi)
                return BadRequest(result.Mesaj);

            return Ok(result.Mesaj);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(KullaniciLoginDto dto)
        {
            var result = await _kullanicilarService.LoginAsync(dto);

            if (!result.BasariliMi)
                return BadRequest(result.Mesaj);

            return Ok(result.Data);
        }

        [Authorize]
        [HttpPut("profil")]
        public async Task<IActionResult> ProfilGuncelle(KullaniciGuncelleDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var result = await _kullanicilarService.ProfilGuncelleAsync(userId, dto);

            if (!result.BasariliMi)
                return BadRequest(result.Mesaj);

            return Ok(new { message = result.Mesaj });
        }

        [Authorize]
        [HttpGet("profil")]
        public async Task<IActionResult> Profil()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            var result = await _kullanicilarService.GetProfilBilgileriAsync(userId);

            return Ok(result);
        }

    }
}