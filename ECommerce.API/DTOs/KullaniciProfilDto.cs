namespace ECommerce.API.DTOs
{
    public class KullaniciProfilDto
    {
        public int ID { get; set; }
        public string AdSoyad { get; set; }
        public string EMail { get; set; }
        public string? Telefon { get; set; }
        public string? Sehir { get; set; }
        public string? TamAdres { get; set; }
        public DateTime KayitTarihi { get; set; }

        public int ToplamSiparisSayisi { get; set; }
        public decimal ToplamHarcama { get; set; }

        public List<RecentOrderDto> SonSiparisler { get; set; }
    }

    public class RecentOrderDto
    {
        public int SiparisId { get; set; }
        public DateTime Tarih { get; set; }
        public decimal Tutar { get; set; }
        public string Durum { get; set; }
    }
}
