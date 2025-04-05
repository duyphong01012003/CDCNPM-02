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

//builder.Services.AddCors(options =>
//{
//	options.AddPolicy("AllowNgrok", policy =>
//	{
//		policy.WithOrigins("http://localhost:5173", "https://f92e-2405-4802-1d33-2ed0-5ca-8ca7-a5cc-d101.ngrok-free.app", "https://qlksproject-4z9afqqgu-vietanh219s-projects.vercel.app") // Chấp nhận cả localhost và Ngrok
//			  .AllowAnyMethod()
//			  .AllowAnyHeader()
//			  .AllowCredentials(); // Nếu dùng cookie hoặc authentication
//	});
//});

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowNgrok", policy =>
	{
		policy.SetIsOriginAllowed(origin =>
			origin.StartsWith("http://localhost:5173") ||  // React trên localhost
			origin.Contains("ngrok-free.app") ||  // API qua Ngrok
			origin.StartsWith("https://qlksproject") // Chấp nhận mọi FE từ Vercel
		)
		.AllowAnyMethod()  // Cho phép tất cả phương thức (GET, POST, OPTIONS, v.v.)
		.AllowAnyHeader()  // Cho phép tất cả headers
		.AllowCredentials(); // Nếu API yêu cầu xác thực (cookie, token)
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
