using ECommerce.API.Data;
using Microsoft.EntityFrameworkCore;
using ECommerce.API.Services.Interfaces;
using ECommerce.API.Services.Concrete;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddScoped<IKullanicilarService,KullanicilarService>();
builder.Services.AddScoped<IKategorilerService,KategorilerService>();
builder.Services.AddScoped<IUrunlerService,UrunlerService>();
builder.Services.AddScoped<ISiparislerService,SiparislerService>();


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();


app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();