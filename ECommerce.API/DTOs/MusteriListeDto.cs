namespace ECommerce.API.DTOs
{
    public class MusteriListeDto
    {
        public int ID { get; set; }
        public string AdSoyad { get; set; } = string.Empty;
        public string EMail { get; set; } = string.Empty;
        public DateTime OlusturmaT { get; set; }
        public int SiparisSayisi { get; set; }
        public decimal ToplamHarcama { get; set; }
    }
}