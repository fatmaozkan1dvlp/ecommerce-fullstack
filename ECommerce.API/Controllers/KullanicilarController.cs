using ECommerce.API.DTOs;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetMusteriler()
        {
            var musteriler = await _kullanicilarService.GetMusterilerAsync();
            return Ok(musteriler);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(KullaniciRegisterDto dto)
        {
            var sonuc = await _kullanicilarService.RegisterAsync(dto);

            if (!sonuc.BasariliMi)
                return BadRequest(sonuc.Mesaj);

            return Ok(sonuc.Mesaj);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(KullaniciLoginDto dto)
        {
            var sonuc = await _kullanicilarService.LoginAsync(dto);

            if (!sonuc.BasariliMi)
                return BadRequest(sonuc.Mesaj);

            return Ok(sonuc.Data);
        }

        [HttpPut("profil-guncelle/{id}")]
        public async Task<IActionResult> ProfilGuncelle(int id, KullaniciGuncelleDto dto)
        {
            var sonuc = await _kullanicilarService.ProfilGuncelleAsync(id, dto);

            if (!sonuc.BasariliMi) {
                if(sonuc.Mesaj=="Kullanıcı Bulunamadı.")
                    return NotFound(sonuc.Mesaj);
                
                return BadRequest(sonuc.Mesaj); 
            }
               

            return Ok(new { Message = sonuc.Mesaj });
        }
    }
}