namespace ECommerce.API.Models
{
    public class Sepet
    {
        public int Id { get; set; }
        public int KullaniciId { get; set; }
        public int UrunId { get; set; }
        public int Adet { get; set; }
        public virtual Urun Urun { get; set; }
    }

    
}
