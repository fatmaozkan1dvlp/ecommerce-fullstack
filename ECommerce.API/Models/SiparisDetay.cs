using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.Models
{
    public class SiparisDetay
    {
        [Key]
        public int ID { get; set; }
        public int SiparisId { get; set; }
        public int UrunId { get; set; }
        public int Adet { get; set; }
        [Precision(18, 2)]
        public decimal BirimFiyat { get; set; }
    }
}
