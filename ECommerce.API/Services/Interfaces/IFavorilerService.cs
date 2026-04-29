using ECommerce.API.DTOs;

namespace ECommerce.API.Services.Interfaces
{
    public interface IFavorilerService
    {
        Task<List<FavorilerDto>> GetUserFavoritesAsync(int kullaniciId);
        Task<string> ToggleFavoriteAsync(FavoriIslemDto dto);
        Task<bool> IsInFavoriteAsync(int kullaniciId, int urunId);

    }
}
