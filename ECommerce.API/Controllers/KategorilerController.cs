using ECommerce.API.Data;
using ECommerce.API.Models;
using ECommerce.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KategorilerController : ControllerBase
    {
        private readonly IRepository<Kategori> _kategoriRepo;
        private readonly AppDbContext _context; 

        public KategorilerController(IRepository<Kategori> kategoriRepo, AppDbContext context)
        {
            _kategoriRepo = kategoriRepo;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Kategori>>> GetKategoriler()
        {
            return await _context.Kategoriler.Where(x => !x.SilindiMi).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Kategori>> PostKategori(Kategori kategori)
        {
            kategori.OlusturmaTarih = DateTime.Now;
            kategori.SilindiMi = false;

            await _kategoriRepo.AddAsync(kategori);
            await _kategoriRepo.SaveAsync();

            return Ok(kategori);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> KategoriGuncelle(int id, Kategori guncelKategori)
        {
            var mevcutKategori = await _kategoriRepo.GetByIdAsync(id);
            if (mevcutKategori == null) return NotFound("Kategori bulunamadı.");

            mevcutKategori.Ad = guncelKategori.Ad;

            _kategoriRepo.Update(mevcutKategori);
            await _kategoriRepo.SaveAsync();
            return Ok(new { Message = "Kategori güncellendi." });
        }

        [HttpPut("arsivle/{id}")]
        public async Task<IActionResult> KategoriArsivle(int id)
        {
            var kategori = await _kategoriRepo.GetByIdAsync(id);
            if (kategori == null) return NotFound("Kategori bulunamadı.");

            if (kategori.SilindiMi) return BadRequest($"{kategori.Ad} zaten arşivde.");

            kategori.SilindiMi = true;
            await _kategoriRepo.SaveAsync();
            return Ok(new { Message = "Kategori arşivlendi." });
        }

        [HttpDelete("kalici-sil/{id}")]
        public async Task<IActionResult> KategoriKaliciSil(int id)
        {
            var kategori = await _kategoriRepo.GetByIdAsync(id);
            if (kategori == null) return NotFound("Kategori bulunamadı.");

            var urunVarMi = await _context.Urunler.AnyAsync(u => u.KategoriId == id);
            if (urunVarMi) return BadRequest("İçinde ürün olan kategori kalıcı olarak silinemez.");

            _kategoriRepo.Delete(kategori);
            await _kategoriRepo.SaveAsync();
            return Ok(new { Message = "Kategori kalıcı olarak silindi." });
        }

        [HttpPut("arsivden-cikar/{id}")]
        public async Task<IActionResult> ArsivdenCikar(int id)
        {
            var kategori = await _kategoriRepo.GetByIdAsync(id);
            if (kategori == null) return NotFound("Kategori bulunamadı.");

            if (!kategori.SilindiMi) return BadRequest($"{kategori.Ad} zaten yayında.");

            kategori.SilindiMi = false;
            await _kategoriRepo.SaveAsync();
            return Ok(new { Message = "Kategori tekrar yayına alındı." });
        }
    }
}

