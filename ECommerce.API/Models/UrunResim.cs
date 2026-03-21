using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.Models
{
    public class UrunResim
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Url { get; set; }
        public int SiraNo { get; set; }

        public int UrunId { get; set; } 
        
        public virtual Urun? Urun { get; set; }
    }
}
