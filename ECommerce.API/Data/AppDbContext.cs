using ECommerce.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Kullanici> Kullanicilar { get; set; }
        public DbSet<Urun> Urunler { get; set; }
        public DbSet<Kategori> Kategoriler { get; set; }
        public DbSet<Siparis> Siparisler { get; set; }
        public DbSet<Sepet> Sepetler { get; set; }
        public DbSet<Favoriler> Favoriler { get; set; }
        public DbSet<SiparisDetay> SiparisDetaylari { get; set; }
        public DbSet<UrunResim> UrunResimleri { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Favoriler>()
            .HasIndex(x => new { x.KullaniciId, x.UrunId })
            .IsUnique();
            modelBuilder.Entity<Urun>()
                .Property(p => p.Fiyat)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Urun>()
        .HasIndex(u => u.Slug)
        .IsUnique()
        .HasFilter("[Slug] IS NOT NULL");

            modelBuilder.Entity<Kategori>()
                .HasIndex(k => k.Slug)
                .IsUnique()
                .HasFilter("[Slug] IS NOT NULL");
        }
    }
}
