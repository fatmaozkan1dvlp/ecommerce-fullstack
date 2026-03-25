namespace ECommerce.API.DTOs
{
    public class SiparisListeDto
    {
        public int Id { get; set; }
        public string MusteriAdi { get; set; }
        public DateTime SiparisTarihi { get; set; }
        public decimal ToplamTutar { get; set; }
        public string Durum { get; set; }
       
    }
    public class SiparisDetayDto
    {
        public int ID { get; set; }
        public string UrunAdi { get; set; }
        public string UrunResimUrl { get; set; }
        public int Adet { get; set; }
        public decimal BirimFiyat { get; set; }
        public decimal AraToplam => Adet * BirimFiyat;
    }

    public class SiparisGoruntuleDto
    {
        public int ID { get; set; }
        public string MusteriAdi { get; set; } 
        public string Telefon { get; set; }
        public string Adres { get; set; }
        public DateTime SiparisTarihi { get; set; }
        public decimal ToplamTutar { get; set; }
        public string Durum { get; set; }
        public List<SiparisDetayDto> Detaylar { get; set; }
    }
}
