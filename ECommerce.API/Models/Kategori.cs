using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.Models
{
    public class Kategori
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string Ad { get; set; }
        public DateTime OlusturmaTarih { get; set; } = DateTime.Now;
        public bool SilindiMi { get; set; } = false;
    }
}
