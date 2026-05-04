using ECommerce.API.DTOs;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class KullanicilarController : ControllerBase
{
    private readonly IKullanicilarService _kullanicilarService;

    public KullanicilarController(IKullanicilarService kullanicilarService)
    {
        _kullanicilarService = kullanicilarService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetMusteriler()
    {
        var result = await _kullanicilarService.GetMusterilerAsync();
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] KullaniciRegisterDto dto)
    {
        var result = await _kullanicilarService.RegisterAsync(dto);

        if (!result.BasariliMi)
            return BadRequest(new { Message = result.Mesaj });

        return Ok(new { Message = result.Mesaj });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] KullaniciLoginDto dto)
    {
        var result = await _kullanicilarService.LoginAsync(dto);

        if (!result.BasariliMi)
            return BadRequest(new { Message = result.Mesaj });

        return Ok(result.Data);
    }

    [Authorize]
    [HttpPut("profil")]
    public async Task<IActionResult> ProfilGuncelle([FromBody] KullaniciGuncelleDto dto)
    {
        var result = await _kullanicilarService.ProfilGuncelleAsync(GetUserId(), dto);

        if (!result.BasariliMi)
            return BadRequest(new { Message = result.Mesaj });

        return Ok(new { Message = result.Mesaj });
    }

    [Authorize]
    [HttpGet("profil")]
    public async Task<IActionResult> Profil()
    {
        var result = await _kullanicilarService.GetProfilBilgileriAsync(GetUserId());

        if (result == null)
            return NotFound(new { Message = "Kullanıcı bulunamadı." });

        return Ok(result);
    }
}