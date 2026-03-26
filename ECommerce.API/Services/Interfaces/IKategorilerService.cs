using ECommerce.API.Models;

namespace ECommerce.API.Services.Interfaces
{
    public interface IKategorilerService
    {
        Task<List<Kategori>> GetKategorilerAsync();
        Task<Kategori> PostKategoriAsync(Kategori kategori);
        Task<(bool BasariliMi, string Mesaj)> KategoriGuncelleAsync(int id, Kategori guncelKategori);
        Task<(bool BasariliMi, string Mesaj)> KategoriArsivleAsync(int id);
        Task<(bool BasariliMi, string Mesaj)> KategoriKaliciSilAsync(int id);
        Task<(bool BasariliMi, string Mesaj)> ArsivdenCikarAsync(int id);
        Task<List<Kategori>> GetArsivlenenKategorilerAsync();
    }
}