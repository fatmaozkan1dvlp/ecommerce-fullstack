using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.API.Migrations
{
    /// <inheritdoc />
    public partial class SiparisUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Siparisler_KullaniciId",
                table: "Siparisler",
                column: "KullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_SiparisDetaylari_UrunId",
                table: "SiparisDetaylari",
                column: "UrunId");

            migrationBuilder.AddForeignKey(
                name: "FK_SiparisDetaylari_Urunler_UrunId",
                table: "SiparisDetaylari",
                column: "UrunId",
                principalTable: "Urunler",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Siparisler_Kullanicilar_KullaniciId",
                table: "Siparisler",
                column: "KullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SiparisDetaylari_Urunler_UrunId",
                table: "SiparisDetaylari");

            migrationBuilder.DropForeignKey(
                name: "FK_Siparisler_Kullanicilar_KullaniciId",
                table: "Siparisler");

            migrationBuilder.DropIndex(
                name: "IX_Siparisler_KullaniciId",
                table: "Siparisler");

            migrationBuilder.DropIndex(
                name: "IX_SiparisDetaylari_UrunId",
                table: "SiparisDetaylari");
        }
    }
}
