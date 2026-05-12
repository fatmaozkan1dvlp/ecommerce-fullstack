namespace ECommerce.API.DTOs
{
    public class FavorilerDto
    {
        public int Id { get; set; }
        public int UrunId { get; set; }
        public string UrunAd { get; set; }
        public decimal Fiyat { get; set; }
        public string Gorsel { get; set; }
        public string? UrunSlug { get; set; } 
    }

    public class FavoriIslemDto
    {
        public int UrunId { get; set; }

    }
}