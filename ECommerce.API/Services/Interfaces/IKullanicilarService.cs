using ECommerce.API.DTOs;

namespace ECommerce.API.Services.Interfaces
{
    public interface IKullanicilarService
    {
        Task<List<MusteriListeDto>> GetMusterilerAsync();
        Task<(bool BasariliMi, string Mesaj)> RegisterAsync(KullaniciRegisterDto dto);
        Task<(bool BasariliMi, string Mesaj, object? Data)> LoginAsync(KullaniciLoginDto dto);
        Task<(bool BasariliMi, string Mesaj)> ProfilGuncelleAsync(int id, KullaniciGuncelleDto dto);
    }
}