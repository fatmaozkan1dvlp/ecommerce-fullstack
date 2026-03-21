using Microsoft.EntityFrameworkCore;
using ECommerce.API.Data;
using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KullanicilarController : ControllerBase
    {
        private readonly IRepository<Kullanici> _kullaniciRepo;
        private readonly AppDbContext _context; 

        public KullanicilarController(IRepository<Kullanici> kullaniciRepo, AppDbContext context)
        {
            _kullaniciRepo = kullaniciRepo;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Kullanici>>> GetMusteriler()
        {
            return await _context.Kullanicilar.ToListAsync();
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(KullaniciRegisterDto dto)
        {
            if (_context.Kullanicilar.Any(u => u.EMail == dto.EMail))
                return BadRequest("Bu email zaten kayıtlı.");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre);

            var yeniKullanici = new Kullanici
            {
                AdSoyad = dto.AdSoyad,
                EMail = dto.EMail,
                SifreHash = passwordHash,
                Rol = "Musteri",
                OlusturmaT = DateTime.Now,
                SilindiMi = false
            };

            await _kullaniciRepo.AddAsync(yeniKullanici);
            await _kullaniciRepo.SaveAsync();

            return Ok("Kullanıcı başarıyla oluşturuldu.");
        }

        [HttpPost("login")]
        public IActionResult Login(KullaniciLoginDto dto)
        {
            var kullanici = _context.Kullanicilar.FirstOrDefault(u => u.EMail == dto.EMail && !u.SilindiMi);

            if (kullanici == null) return BadRequest("Kullanıcı bulunamadı.");

            bool sifreDogruMu = BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.SifreHash);

            if (!sifreDogruMu) return BadRequest("Hatalı şifre.");

            return Ok(new { Message = "Giriş başarılı!", AdSoyad = kullanici.AdSoyad, Rol = kullanici.Rol, Id = kullanici.ID });
        }

        [HttpPut("profil-guncelle/{id}")]
        public async Task<IActionResult> ProfilGuncelle(int id, KullaniciRegisterDto dto)
        {
            var kullanici = await _kullaniciRepo.GetByIdAsync(id);
            if (kullanici == null) return NotFound("Kullanıcı bulunamadı.");

            
            if (_context.Kullanicilar.Any(u => u.EMail == dto.EMail && u.ID != id))
                return BadRequest("Bu email zaten başka bir kullanıcı tarafından kullanılıyor.");

            if (!string.IsNullOrWhiteSpace(dto.AdSoyad) && dto.AdSoyad != "string") kullanici.AdSoyad = dto.AdSoyad;
            if (!string.IsNullOrWhiteSpace(dto.EMail) && dto.EMail != "string") kullanici.EMail = dto.EMail;
            if (!string.IsNullOrWhiteSpace(dto.Sifre) && dto.Sifre != "string") kullanici.SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre);

            _kullaniciRepo.Update(kullanici);
            await _kullaniciRepo.SaveAsync();
            return Ok(new { Message = "Bilgileriniz güncellendi." });
        }
    }
}
