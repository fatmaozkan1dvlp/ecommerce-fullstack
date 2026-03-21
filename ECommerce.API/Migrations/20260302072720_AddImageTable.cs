using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.API.Migrations
{
    /// <inheritdoc />
    public partial class AddImageTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResimUrl",
                table: "Urunler");

            migrationBuilder.CreateTable(
                name: "UrunResimleri",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SiraNo = table.Column<int>(type: "int", nullable: false),
                    UrunId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UrunResimleri", x => x.ID);
                    table.ForeignKey(
                        name: "FK_UrunResimleri_Urunler_UrunId",
                        column: x => x.UrunId,
                        principalTable: "Urunler",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UrunResimleri_UrunId",
                table: "UrunResimleri",
                column: "UrunId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UrunResimleri");

            migrationBuilder.AddColumn<string>(
                name: "ResimUrl",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
