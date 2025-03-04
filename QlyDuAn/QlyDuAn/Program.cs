using Microsoft.EntityFrameworkCore;
using QlyDuAn;
using QlyDuAn.Models;
using QlyDuAn.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<QlyDuAnContext>(options =>
	options.UseSqlServer(connectionString));

//builder.Services.AddCors(options =>
//{
//	options.AddPolicy("AllowNgrok",
//		policy => policy
//			.SetIsOriginAllowed(origin => new Uri(origin).Host.EndsWith("ngrok-free.app")) // Chấp nhận mọi link ngrok
//			.AllowAnyMethod()
//			.WithHeaders("Content-Type") // Chỉ cho phép header "Content-Type"
//			.AllowCredentials());
//});

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowNgrok", policy =>
	{
		policy.WithOrigins("http://localhost:5173", "https://b08e-1-53-37-0.ngrok-free.app") // Chấp nhận cả localhost và Ngrok
			  .AllowAnyMethod()
			  .AllowAnyHeader()
			  .AllowCredentials(); // Nếu dùng cookie hoặc authentication
	});
});


// Add services to the container.
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<RegisterService>();

builder.WebHost.UseUrls("http://0.0.0.0:5113", "https://0.0.0.0:7002");

builder.Services.AddControllers()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.PropertyNamingPolicy = null; // Giữ nguyên tên property
		options.JsonSerializerOptions.WriteIndented = true; // Format JSON đẹp hơn
	});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1",
	new()
	{
		Title = "QlyDuAn API",
		Version = "v1",
		Description = "API phục vụ quản lý dự án bởi nhóm 2",
	});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("AllowNgrok");

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
