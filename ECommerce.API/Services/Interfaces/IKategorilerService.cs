using ECommerce.API.DTOs;
using ECommerce.API.Models;

namespace ECommerce.API.Services.Interfaces
{
    public interface IKategorilerService
    {
        Task<List<Kategori>> GetKategorilerAsync();
        Task<(bool BasariliMi, string Mesaj, Kategori? Data)> PostKategoriAsync(KategoriEkleDto dto);
        Task<(bool BasariliMi, string Mesaj)> KategoriGuncelleAsync(int id, KategoriGuncelleDto dto);
        Task<(bool BasariliMi, string Mesaj)> KategoriArsivleAsync(int id);
        Task<(bool BasariliMi, string Mesaj)> KategoriKaliciSilAsync(int id);
        Task<(bool BasariliMi, string Mesaj)> ArsivdenCikarAsync(int id);
        Task<List<Kategori>> GetArsivlenenKategorilerAsync();
    }
}