using ECommerce.API.DTOs;

namespace ECommerce.API.Services.Interfaces
{
    public interface IFavorilerService
    {
        Task<List<FavorilerDto>> GetUserFavoritesAsync(int kullaniciId);
        Task<(bool BasariliMi, string Mesaj)> ToggleFavoriteAsync(int kullaniciId, int urunId);
        Task<bool> IsInFavoriteAsync(int kullaniciId, int urunId);
    }
}