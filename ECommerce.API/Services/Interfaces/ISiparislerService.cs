using ECommerce.API.DTOs;

namespace ECommerce.API.Services.Interfaces
{
    public interface ISiparislerService
    {
        Task<(bool BasariliMi, string Mesaj, int SiparisId)> SiparisOlusturAsync(SiparisKayitDto dto);
        Task<(bool BasariliMi, string Mesaj)> DurumGuncelleAsync(SiparisDurumGuncelleDto dto);
        Task<object> GetDashboardOzetAsync();
        Task<List<object>> SiparisleriGetirByDurumAsync(string durum);
        Task<object?> GetSiparisDetayAsync(int id);
    }
}