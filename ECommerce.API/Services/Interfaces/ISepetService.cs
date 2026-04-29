using ECommerce.API.DTOs;

namespace ECommerce.API.Services.Interfaces
{
    public interface ISepetService
    {
        Task<List<SepetListeDto>> GetUserCartAsync(int kullaniciId);
        Task<bool> AddToCartAsync(SepetEkleDto sepetEkleDto);
        Task<bool> RemoveFromCartAsync(int sepetId);
        Task<bool> UpdateQuantityAsync(int sepetId, int yeniAdet);
        Task<SepetToplamDto> GetCartSummary(int kullaniciId);
    }
}
