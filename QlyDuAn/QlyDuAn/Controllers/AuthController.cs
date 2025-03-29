using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QlyDuAn.Services; // 💡 Kiểm tra và thêm dòng này nếu thiếu
using QlyDuAn.Request;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using QlyDuAn.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;

namespace QlyDuAn.Controllers
{
	[Route("api/auth")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly AuthService _authService;
		private readonly QlyDuAnContext _context;

		public AuthController(AuthService authService, QlyDuAnContext context)
		{
			_authService = authService;
			_context = context;
		}

		[HttpPost("login")]
		public async Task<ActionResult<LoginRequest>> Login([FromBody] LoginRequest request)
		{
			var user = await _authService.LoginAsync(request.Code, request.Password);

			if (user == null)
			{
				return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu!" });
			}

			var nhanVien = await _context.NhanViens
				.Include(nv => nv.IdnhomLamViecNavigation)
				.ThenInclude(nlv => nlv.DuAns)
				.Where(nv => nv.IdtaiKhoan == user.IdtaiKhoan)
				.Select(nv => new
				{
					nv.IdnhanVien,
					nv.HoTenNhanVien,
					nv.IdnhomLamViecNavigation.TenNhom,
					DuAn = nv.IdnhomLamViecNavigation.DuAns.Any() ? nv.IdnhomLamViecNavigation.DuAns.Select(da => da.TenDuAn).ToList() : null,
				}).FirstOrDefaultAsync();


			var admin = await _context.Admins
				.Where(a => a.IdtaiKhoan == user.IdtaiKhoan)
				.Select(a => new
				{
					a.Idadmin,
					a.HoTenAdmin,
				}).FirstOrDefaultAsync();

			var truongNhom = await _context.TruongNhoms
				.Where(tn => tn.IdtaiKhoan == user.IdtaiKhoan)
				.Select(tn => new
				{
					tn.IdtruongNhom,
					tn.HoTenTruongNhom,
				}).FirstOrDefaultAsync();

			if (user.QuyenTaiKhoan == "Admin")
			{
				return Ok(new
				{
					message = "Đăng nhập thành công",
					id = user.IdtaiKhoan,
					role = user.QuyenTaiKhoan,
					admin.Idadmin,
					ten = admin.HoTenAdmin,
				});
			}
			else if (user.QuyenTaiKhoan == "TruongNhom")
			{
				return Ok(new
				{
					message = "Đăng nhập thành công",
					id = user.IdtaiKhoan,
					role = user.QuyenTaiKhoan,
					truongNhom.IdtruongNhom,
					ten = truongNhom.HoTenTruongNhom,
				});
			}

			return Ok(new
			{
				message = "Đăng nhập thành công",
				id = user.CodeTaiKhoan,
				role = user.QuyenTaiKhoan,
				nhanVien.IdnhanVien,
				ten = nhanVien.HoTenNhanVien,
				nhom = nhanVien.TenNhom,
				duAn = nhanVien.DuAn
			});
		}

		[HttpPost("logout")]
		public async Task<IActionResult> Logout()
		{
			await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
			return Ok(new { message = "Đăng xuất thành công" });
		}

	}


}
