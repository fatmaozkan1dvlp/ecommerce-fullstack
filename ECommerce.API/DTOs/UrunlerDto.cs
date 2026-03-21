namespace ECommerce.API.DTOs
{
    public class UrunlerDto
    {
        public int ID { get; set; }
        public string Ad { get; set; }
        public decimal Fiyat { get; set; }
        public int Stok { get; set; }
        public string KategoriAd { get; set; }
        public string? Aciklama { get; set; }
        public List<string> Galeri { get; set; } = new();
    }
}
