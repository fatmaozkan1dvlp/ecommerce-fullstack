namespace ECommerce.API.DTOs
{
    public class SiparisKayitDto
    {
        public int KullaniciId { get; set; }
        public string TamAdres { get; set; }
        public string Sehir { get; set; }
        public string Telefon { get; set; }
        public List<SepetItemDto> Sepet { get; set; }
    }
    public class SepetItemDto
    {
        public int UrunId { get; set; }
        public int Adet { get; set; }
    }
}
