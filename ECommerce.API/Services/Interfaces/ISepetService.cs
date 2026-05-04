using ECommerce.API.DTOs;

namespace ECommerce.API.Services.Interfaces
{
    public interface ISepetService
    {
        Task<List<SepetListeDto>> GetUserCartAsync(int kullaniciId);
        Task<(bool BasariliMi, string Mesaj)> AddToCartAsync(int kullaniciId, SepetEkleDto dto);
        Task<(bool BasariliMi, string Mesaj)> RemoveFromCartAsync(int sepetId, int kullaniciId);
        Task<(bool BasariliMi, string Mesaj)> UpdateQuantityAsync(int sepetId, int kullaniciId, int yeniAdet);
        Task<SepetToplamDto> GetCartSummaryAsync(int kullaniciId);
    }
}
