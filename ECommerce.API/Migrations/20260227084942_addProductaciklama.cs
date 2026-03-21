using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.API.Migrations
{
    /// <inheritdoc />
    public partial class addProductaciklama : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Aciklama",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aciklama",
                table: "Urunler");
        }
    }
}
