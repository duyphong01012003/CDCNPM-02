using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using QlyDuAn.Models;
using QlyDuAn.Services;
using QlyDuAn.Request;
using Microsoft.EntityFrameworkCore;

namespace QlyDuAn.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RegisterController : ControllerBase
	{
		private readonly RegisterService _registerService;
		private readonly QlyDuAnContext _context;

		public RegisterController(RegisterService registerService, QlyDuAnContext context)
		{
			_registerService = registerService;
			_context = context;
		}

		[HttpPost("register")]
		public async Task<ActionResult<string>> Register([FromBody] RegisterRequest request)
		{
			try
			{
				var taiKhona = await _registerService.Register(request);
				if (taiKhona == null)
				{
					return BadRequest("Tạo tài khoản thất bại.");
				}

				var taiKhoan = await _context.TaiKhoans.
					Where(tk => tk.IdtaiKhoan == taiKhona.IdtaiKhoan).
			   Select(tk => new
			   {
				   tk.IdtaiKhoan,
				   tk.CodeTaiKhoan,
				   ThongTin = tk.QuyenTaiKhoan == "NhanVien"
					   ? (object)_context.NhanViens
						   .Where(nv => nv.IdtaiKhoan == tk.IdtaiKhoan)
						   .Include(nv => nv.IdnguoiQuanLyNavigation)
						   .Include(nv => nv.IdnhomLamViecNavigation)
						   .Select(nv => new
						   {
							   HoTen = nv.HoTenNhanVien,
							   nv.Sdt,
							   nv.NgaySinh,
							   nv.GioiTinh,
							   //TrangThai = nv.Status == 1 ? "Nhân viên mới" : nv.Status == 2 ? "Đang làm" : "Nghỉ việc",
							   nv.Email,
							   nv.IdnguoiQuanLyNavigation.IdtruongNhom,
							   nv.IdnguoiQuanLyNavigation.HoTenTruongNhom,
							   nv.IdnhomLamViecNavigation.IdnhomLamViec,
							   nv.IdnhomLamViecNavigation.TenNhom
						   }
						   ).FirstOrDefault()
				   : tk.QuyenTaiKhoan == "TruongNhom"
					   ? (object)_context.TruongNhoms
						   .Where(tn => tn.IdtaiKhoan == tk.IdtaiKhoan)
						   .Select(tn => new
						   {
							   HoTen = tn.HoTenTruongNhom,
							   tn.Sdt,
							   tn.NgaySinh,
							   tn.GioiTinh,
							   tn.Email
						   }
				   ).FirstOrDefault()
					   : (object)_context.Admins
						   .Where(ad => ad.IdtaiKhoan == tk.IdtaiKhoan)
						   .Select(ad => new
						   {
							   HoTen = ad.HoTenAdmin,
							   ad.Sdt,
							   ad.NgaySinh,
							   ad.GioiTinh,
							   ad.Email
						   }
						   ).FirstOrDefault(),
				   tk.QuyenTaiKhoan
			   }
		   ).ToListAsync();
				return Ok(taiKhoan);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}
	}
}
