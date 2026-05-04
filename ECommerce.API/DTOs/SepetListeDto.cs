namespace ECommerce.API.DTOs
{
    public class SepetListeDto
    {
        public int Id { get; set; }
        public int UrunId { get; set; }
        public string UrunAd { get; set; }
        public decimal Fiyat { get; set; }
        public string Gorsel { get; set; }
        public int Adet { get; set; }
        public int Stok { get; set; }
    }

    public class SepetEkleDto
    {
        public int UrunId { get; set; }
        public int Adet { get; set; }
     
    }
    public class SepetToplamDto
{
    public List<SepetListeDto> Urunler { get; set; }
    public decimal ToplamFiyat { get; set; }
}
}
