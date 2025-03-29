using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using QlyDuAn;
using QlyDuAn.Models;
using QlyDuAn.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<QlyDuAnContext>(options =>
	options.UseSqlServer(connectionString));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
	.AddCookie(options =>
	{
		options.LoginPath = "/api/auth/login";    // Đường dẫn đăng nhập (nếu cần)
		options.LogoutPath = "/api/auth/logout";    // Đường dẫn đăng xuất (nếu cần)
													// Bạn có thể thêm các tùy chỉnh khác như: ExpireTimeSpan, Cookie.Name, v.v.
	});

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowNgrok", policy =>
	{
		policy.WithOrigins("http://localhost:5173", "https://2dc6-2405-4802-1d40-2ae0-65d8-31c0-a7b6-dc08.ngrok-free.app") // Chấp nhận cả localhost và Ngrok
			  .AllowAnyMethod()
			  .AllowAnyHeader()
			  .AllowCredentials(); // Nếu dùng cookie hoặc authentication
	});
});

// Add services to the container.
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<RegisterService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<TaskProgressService>();

builder.Services.AddHostedService<TaskProgressService>();
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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
