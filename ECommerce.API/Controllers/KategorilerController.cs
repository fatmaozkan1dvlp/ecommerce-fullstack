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
            _kategoriRepo.Update(kategori);

            var bagliUrunler = await _context.Urunler
                .Where(u => u.KategoriId == id && !u.SilindiMi)
                .ToListAsync();

            foreach (var urun in bagliUrunler)
            {
                urun.SilindiMi = true; 
            }

            await _context.SaveChangesAsync();
            await _kategoriRepo.SaveAsync();

            return Ok(new { Message = $"{kategori.Ad} kategorisi ve içindeki {bagliUrunler.Count} ürün başarıyla arşivlendi." });
        }

        [HttpDelete("kalici-sil/{id}")]
        public async Task<IActionResult> KategoriKaliciSil(int id)
        {
            var kategori = await _kategoriRepo.GetByIdAsync(id);
            if (kategori == null) return NotFound("Kategori bulunamadı.");

            var aktifUrunVarMi = await _context.Urunler.AnyAsync(u => u.KategoriId == id && !u.SilindiMi);
            if (aktifUrunVarMi)
            {
                return BadRequest("Bu kategoride aktif ürünler var. Önce ürünleri silmeli veya başka kategoriye taşımalısınız.");
            }

            var arsivdeUrunVarMi = await _context.Urunler.AnyAsync(u => u.KategoriId == id && u.SilindiMi);
            if (arsivdeUrunVarMi)
            {
                kategori.SilindiMi = true;
                _kategoriRepo.Update(kategori);
                await _kategoriRepo.SaveAsync();
                return Ok(new { Message = "Kategoride arşivlenmiş ürünler bulunduğu için kategori arşive taşındı." });
            }

            _kategoriRepo.Delete(kategori);
            await _kategoriRepo.SaveAsync();

            return Ok(new { Message = "Kategori (içinde ürün bulunmadığı için) kalıcı olarak silindi." });
        }

        [HttpPut("arsivden-cikar/{id}")]
        public async Task<IActionResult> ArsivdenCikar(int id)
        {
            var kategori = await _kategoriRepo.GetByIdAsync(id);
            if (kategori == null) return NotFound("Kategori bulunamadı.");

            if (!kategori.SilindiMi) return BadRequest($"{kategori.Ad} zaten yayında.");

            kategori.SilindiMi = false;
            await _kategoriRepo.SaveAsync();
            return Ok(new { Message = $"{kategori.Ad} kategorisi ve bağlı ürünleri artık görüntülenebilir." });
        }

        [HttpGet("arsivlenenler")]
        public async Task<IActionResult> GetArsivlenenKategoriler()
        {
            var arsiv = await _context.Kategoriler
                .Where(k => k.SilindiMi == true)
                .ToListAsync();

            return Ok(arsiv);
        }
    }
}

