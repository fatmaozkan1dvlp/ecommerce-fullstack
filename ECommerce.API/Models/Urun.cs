using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.Models
{
    public class Urun
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string Ad { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Fiyat { get; set; }
        public int Stok { get; set; }
        public string? Aciklama { get; set; }
        public int KategoriId { get; set; }
        public virtual Kategori? Kategori { get; set; }
        public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
        public bool SilindiMi {  get; set; }=false;
        public virtual List<UrunResim> Resimler { get; set; } = new();
    }
}
