using System.ComponentModel.DataAnnotations;


namespace ECommerce.API.Models
{
    public class Kullanici
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string AdSoyad { get; set; }
        [Required]
        public string EMail { get; set; }
        [Required]
        public string SifreHash { get; set; }
        public string? Telefon { get; set; }
        public string? Sehir { get; set; }
        public string? TamAdres { get; set; }
        public string Rol { get;set; }
        public DateTime OlusturmaT { get;set; } = DateTime.Now;
        public bool SilindiMi { get;set; }=false;

    }
}
