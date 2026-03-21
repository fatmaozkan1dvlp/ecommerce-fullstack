using ECommerce.API.DTOs;
using ECommerce.API.Data;
using ECommerce.API.Models;
using ECommerce.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UrunlerController : ControllerBase
    {
        private readonly IRepository<Urun> _urunRepo;
        private readonly IRepository<UrunResim> _resimRepo; 
        private readonly AppDbContext _context;

        public UrunlerController(IRepository<Urun> urunRepo, IRepository<UrunResim> resimRepo, AppDbContext context)
        {
            _urunRepo = urunRepo;
            _resimRepo = resimRepo;
            _context = context;
        }

  
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UrunlerDto>>> GetUrunler()
        {
            var urunler = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .Where(u => !u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            return Ok(urunler);
        }


        [HttpPost]
        public async Task<ActionResult<Urun>> PostUrun([FromBody] Urun urun)
        {
            urun.Kategori = null;
            urun.OlusturmaTarihi = DateTime.Now;
            urun.SilindiMi = false;

            await _urunRepo.AddAsync(urun);
            await _urunRepo.SaveAsync();
            return Ok(urun);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UrunGuncelle(int id, [FromBody] UrunGuncelleDto dto)
        {
            var mevcutUrun = await _urunRepo.GetByIdAsync(id);

            if (mevcutUrun == null)
                return NotFound(new { Message = "Ürün bulunamadı." });

            if (!string.IsNullOrWhiteSpace(dto.Ad) && dto.Ad != "string") mevcutUrun.Ad = dto.Ad;
            if (!string.IsNullOrWhiteSpace(dto.Aciklama) && dto.Aciklama != "string") mevcutUrun.Aciklama = dto.Aciklama;
            if (dto.Fiyat > 0) mevcutUrun.Fiyat = dto.Fiyat;
            if (dto.Stok >= 0) mevcutUrun.Stok = dto.Stok;
            if (dto.KategoriId > 0) mevcutUrun.KategoriId = dto.KategoriId;

            _urunRepo.Update(mevcutUrun);
            await _urunRepo.SaveAsync();
            return Ok(new { Message = "Ürün güncellendi.", Urun = mevcutUrun });
        }

        [HttpPut("arsivle/{id}")]
        public async Task<IActionResult> UrunArsivle(int id)
        {
            var urun = await _urunRepo.GetByIdAsync(id);
            if (urun == null) return NotFound("Ürün bulunamadı.");

            if (urun.SilindiMi) return BadRequest($"{urun.Ad} zaten arşivde.");

            urun.SilindiMi = true;
            await _urunRepo.SaveAsync();
            return Ok(new { Message = $"{urun.Ad} arşive kaldırıldı." });
        }


        [HttpDelete("kalici-sil/{id}")]
        public async Task<IActionResult> UrunKaliciSil(int id)
        {
            var urun = await _urunRepo.GetByIdAsync(id);
            if (urun == null) return NotFound("Ürün bulunamadı.");

            var siparisVarMi = await _context.SiparisDetaylari.AnyAsync(d => d.UrunId == id);
            if (siparisVarMi)
            {
                return BadRequest("Bu ürün geçmiş siparişlerde kayıtlı olduğu için kalıcı olarak silinemez.");
            }

            _urunRepo.Delete(urun);
            await _urunRepo.SaveAsync();
            return Ok(new { Message = "Ürün silindi." });
        }


        [HttpPut("arsivden-cikar/{id}")]
        public async Task<IActionResult> ArsivdenCikar(int id)
        {
            var urun = await _urunRepo.GetByIdAsync(id);
            if (urun == null) return NotFound("Ürün Bulunamadı!");

            if (!urun.SilindiMi) return BadRequest($"{urun.Ad} zaten yayında.");

            urun.SilindiMi = false;
            await _urunRepo.SaveAsync();
            return Ok(new { Message = $"{urun.Ad} tekrar yayına alındı." });
        }

        [HttpGet("arsivdekiler")]
        public async Task<ActionResult<IEnumerable<UrunlerDto>>> GetArsivdekiUrunler()
        {
            var urunler = await _context.Urunler
                .Include(u => u.Kategori)
                .Where(u => u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                })
                .ToListAsync();

            return Ok(urunler);
        }

        [HttpPost("{id}/resim-ekle")]
        public async Task<IActionResult> ResimEkle(int id, IFormFile dosya) 
        {
            var urun = await _context.Urunler.Include(u => u.Resimler).FirstOrDefaultAsync(u => u.ID == id);
            if (urun == null) return NotFound(new { Message = "Ürün bulunamadı." });

            var dosyaAdi = Guid.NewGuid().ToString() + Path.GetExtension(dosya.FileName);
            var yol = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", dosyaAdi);

            using (var stream = new FileStream(yol, FileMode.Create))
            {
                await dosya.CopyToAsync(stream);
            }

            var yeniResim = new UrunResim
            {
                UrunId = id,
                Url = "/images/" + dosyaAdi,
                SiraNo = urun.Resimler.Count + 1
            };

            await _resimRepo.AddAsync(yeniResim);
            await _resimRepo.SaveAsync();
            return Ok(new { url = yeniResim.Url });
        }

        [HttpDelete("resim-sil/{resimId}")]
        public async Task<IActionResult> ResimSil(int resimId)
        {
            var resim = await _resimRepo.GetByIdAsync(resimId);
            if (resim == null) return NotFound("Resim bulunamadı.");

            _resimRepo.Delete(resim);
            await _resimRepo.SaveAsync();
            return Ok("Resim silindi.");
        }

        [HttpPut("resim-kapak-yap/{resimId}")]
        public async Task<IActionResult> ResimKapakYap(int resimId)
        {
            var secilenResim = await _resimRepo.GetByIdAsync(resimId);
            if (secilenResim == null) return NotFound();

            var tumResimler = await _context.UrunResimleri
                .Where(r => r.UrunId == secilenResim.UrunId)
                .ToListAsync();

            foreach (var r in tumResimler) r.SiraNo = 2;
            secilenResim.SiraNo = 1;

            await _resimRepo.SaveAsync();
            return Ok("Kapak resmi güncellendi.");
        }

        [HttpGet("kategori/{kategoriId}")]
        public async Task<ActionResult<IEnumerable<UrunlerDto>>> GetUrunlerByKategori(int kategoriId)
        {
            var kategoriVarMi = await _context.Kategoriler.AnyAsync(k => k.ID == kategoriId && !k.SilindiMi);
            if (!kategoriVarMi)
            {
                return NotFound(new { Message = $" kategori sistemde bulunamadı." });
            }

            var urunler = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .Where(u => u.KategoriId == kategoriId && !u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            if (urunler == null || urunler.Count == 0)
            {
                return Ok(new { Message = "Bu kategoriye ait henüz bir ürün eklenmemiş.", Data = new List<UrunlerDto>() });
            }

            return Ok(urunler);
        }

        [HttpGet("ara/{kelime}")]
        public async Task<ActionResult<IEnumerable<UrunlerDto>>> UrunAra(string kelime)
        {
            if (string.IsNullOrWhiteSpace(kelime) || kelime.Length < 2)
            {
                return BadRequest(new { Message = "Arama yapmak için en az 2 karakter girmelisiniz." });
            }

            var urunler = await _context.Urunler
                .Include(u => u.Resimler)
                .Include(u => u.Kategori)
                .Where(u => u.Ad.ToLower().Contains(kelime.ToLower()) && !u.SilindiMi)
                .Select(u => new UrunlerDto
                {
                    ID = u.ID,
                    Ad = u.Ad,
                    Fiyat = u.Fiyat,
                    Stok = u.Stok,
                    KategoriAd = u.Kategori != null ? u.Kategori.Ad : "Kategorisiz",
                    Galeri = u.Resimler.OrderBy(r => r.SiraNo).Select(r => r.Url).ToList()
                })
                .ToListAsync();

            if (urunler.Count == 0)
            {
                return NotFound(new { Message = $"'{kelime}' aramasına uygun bir ürün bulunamadı." });
            }

            return Ok(urunler);
        }
    }
}