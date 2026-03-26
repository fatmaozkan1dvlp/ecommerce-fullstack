using ECommerce.API.DTOs;
using ECommerce.API.Models;

namespace ECommerce.API.Services.Interfaces
{
    public interface IUrunlerService
    {
        Task<List<UrunlerDto>> GetUrunlerAsync();
        Task<Urun> PostUrunAsync(Urun urun);
        Task<object?> GetUrunByIdAsync(int id);
        Task<(bool BasariliMi, string Mesaj, object? Data)> UrunGuncelleAsync(int id, UrunGuncelleDto dto);
        Task<(bool BasariliMi, string Mesaj)> UrunArsivleAsync(int id);
        Task<(bool BasariliMi, string Mesaj)> UrunKaliciSilAsync(int id);
        Task<(bool BasariliMi, string Mesaj)> UrunArsivdenCikarAsync(int id);
        Task<List<UrunlerDto>> GetArsivdekiUrunlerAsync();
        Task<(bool BasariliMi, string Mesaj, object? Data)> ResimEkleAsync(int id, IFormFile dosya);
        Task<(bool BasariliMi, string Mesaj)> ResimSilAsync(int resimId);
        Task<(bool BasariliMi, string Mesaj)> ResimKapakYapAsync(int resimId);
        Task<(bool BasariliMi, string Mesaj, object? Data)> GetUrunlerByKategoriAsync(int kategoriId);
        Task<(bool BasariliMi, string Mesaj, object? Data)> UrunAraAsync(string kelime);
    }
}