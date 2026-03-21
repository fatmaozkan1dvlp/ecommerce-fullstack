using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
namespace ECommerce.API.Models
{
    public class Siparis
    {
        [Key]
        public int ID { get; set; }
        public int KullaniciId { get; set; }
        public DateTime SiparisTarihi { get; set; } = DateTime.Now;
        [Precision(18, 2)]
        public decimal ToplamTutar { get; set; }
        public string Durum { get; set; } = "Sipariş Alındı";
        public virtual List<SiparisDetay> SiparisDetaylari { get; set; } = new();
    }
}
