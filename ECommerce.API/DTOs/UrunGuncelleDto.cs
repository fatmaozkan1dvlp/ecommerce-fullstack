namespace ECommerce.API.DTOs
{
    public class UrunGuncelleDto
    {
        public string? Ad { get; set; }
        public decimal Fiyat { get; set; }
        public int Stok { get; set; }
        public string? Aciklama { get; set; }
        public int KategoriId { get; set; }
    }
}
