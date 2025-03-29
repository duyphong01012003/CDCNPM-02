using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDuAn.Models;

namespace QlyDuAn.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class NhanViensController : ControllerBase
	{
		private readonly QlyDuAnContext _context;

		public NhanViensController(QlyDuAnContext context)
		{
			_context = context;
		}

		// GET: api/NhanViens
		[HttpGet]
		public async Task<ActionResult<IEnumerable<NhanVien>>> GetNhanViens()
		{
			var nhanVien = await _context.NhanViens.
				Include(nv => nv.IdtaiKhoanNavigation).
				Include(nv => nv.IdnguoiQuanLyNavigation).
				Include(nv => nv.IdnhomLamViecNavigation).
				Select(nv => new
				{
					nv.IdnhanVien,
					id = nv.IdtaiKhoanNavigation.CodeTaiKhoan,
					nv.HoTenNhanVien,
					nv.Sdt,
					nv.NgaySinh,
					nv.GioiTinh,
					TrangThai = nv.Status == 0 ? "Nhân viên mới" : nv.Status == 1 ? "Đang làm" : "Nghỉ việc",
					nv.Email,
					IdTruongNhom = nv.IdnguoiQuanLyNavigation != null ? nv.IdnguoiQuanLyNavigation.IdtruongNhom : (int?)null,
					HoTenTruongNhom = nv.IdnguoiQuanLyNavigation.HoTenTruongNhom,
					IdnhomLamViec = nv.IdnhomLamViecNavigation != null ? nv.IdnhomLamViecNavigation.IdnhomLamViec : (int?)null,
					TenNhom = nv.IdnhomLamViecNavigation.TenNhom,
					QuyenTaiKhoan = nv.IdtaiKhoanNavigation.QuyenTaiKhoan
				}
			).ToListAsync();
			return Ok(nhanVien);
			//return await _context.NhanViens.ToListAsync();
		}

		//GET: api/NhanViens/by-name/abc
		[HttpGet("by-name/{name}")]
		public async Task<ActionResult<IEnumerable<DuAn>>> GetNhanViensByName(string name)
		{
			var nhanVien = await _context.NhanViens.
				Include(nv => nv.IdtaiKhoanNavigation).
				Include(nv => nv.IdnguoiQuanLyNavigation).
				Include(nv => nv.IdnhomLamViecNavigation).
				Where(nv => nv.HoTenNhanVien.Contains(name))
				.Select(nv => new
				{
					nv.IdnhanVien,
					id = nv.IdtaiKhoanNavigation.CodeTaiKhoan,
					nv.HoTenNhanVien,
					nv.Sdt,
					nv.NgaySinh,
					nv.GioiTinh,
					nv.Email,
					IdTruongNhom = nv.IdnguoiQuanLyNavigation != null ? nv.IdnguoiQuanLyNavigation.IdtruongNhom : (int?)null,
					HoTenTruongNhom = nv.IdnguoiQuanLyNavigation.HoTenTruongNhom,
					IdnhomLamViec = nv.IdnhomLamViecNavigation != null ? nv.IdnhomLamViecNavigation.IdnhomLamViec : (int?)null,
					TenNhom = nv.IdnhomLamViecNavigation.TenNhom,
					QuyenTaiKhoan = nv.IdtaiKhoanNavigation.QuyenTaiKhoan
				}).ToListAsync();
			if (nhanVien == null)
			{
				return NotFound();
			}
			return Ok(nhanVien);
		}

		// PUT: api/NhanViens/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutNhanVien(int id, NhanVien nhanVien)
		{
			if (id != nhanVien.IdnhanVien)
			{
				return BadRequest();
			}

			_context.Entry(nhanVien).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!NhanVienExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			var nhanVienResult = await _context.NhanViens
					.Include(nv => nv.IdtaiKhoanNavigation)
					.Include(nv => nv.IdnguoiQuanLyNavigation)
					.Include(nv => nv.IdnhomLamViecNavigation)
					.Where(nv => nv.IdnhanVien == nhanVien.IdnhanVien)
					.Select(nv => new
					{
						nv.IdtaiKhoanNavigation.IdtaiKhoan,
						nv.IdtaiKhoanNavigation.CodeTaiKhoan,
						ThongTin = new
						{
							HoTen = nv.HoTenNhanVien,
							nv.IdnhanVien,
							nv.Sdt,
							nv.NgaySinh,
							nv.GioiTinh,
							nv.Email,
							IdTruongNhom = nv.IdnguoiQuanLyNavigation != null ? nv.IdnguoiQuanLyNavigation.IdtruongNhom : (int?)null,
							HoTenTruongNhom = nv.IdnguoiQuanLyNavigation != null ? nv.IdnguoiQuanLyNavigation.HoTenTruongNhom : null,
							IdnhomLamViec = nv.IdnhomLamViecNavigation != null ? nv.IdnhomLamViecNavigation.IdnhomLamViec : (int?)null,
							TenNhom = nv.IdnhomLamViecNavigation != null ? nv.IdnhomLamViecNavigation.TenNhom : null,
						},
						QuyenTaiKhoan = nv.IdtaiKhoanNavigation.QuyenTaiKhoan
					}).FirstOrDefaultAsync();


			return Ok(nhanVienResult);
		}

		// POST: api/NhanViens
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<NhanVien>> PostNhanVien(NhanVien nhanVien)
		{
			_context.NhanViens.Add(nhanVien);
			await _context.SaveChangesAsync();

			var nhanVienResult = await _context.NhanViens
				.Include(nv => nv.IdtaiKhoanNavigation)
				.Include(nv => nv.IdnguoiQuanLyNavigation)
				.Include(nv => nv.IdnhomLamViecNavigation)
				.Where(nv => nv.IdnhanVien == nhanVien.IdnhanVien)
				.Select(nv => new
				{
					nv.IdnhanVien,
					id = nv.IdtaiKhoanNavigation.CodeTaiKhoan,
					nv.HoTenNhanVien,
					nv.Sdt,
					nv.NgaySinh,
					nv.GioiTinh,
					nv.Email,
					nv.IdnguoiQuanLyNavigation.HoTenTruongNhom,
					nv.IdnhomLamViecNavigation.TenNhom,
					nv.IdtaiKhoanNavigation.QuyenTaiKhoan
				}).FirstOrDefaultAsync();


			return Ok(nhanVienResult);
		}

		//DELETE: api/NhanViens/5


		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteNhanVien(int id)
		{
			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				var nhanVien = await _context.NhanViens
					.Include(nv => nv.IdtaiKhoanNavigation) // Load tài khoản liên quan
					.FirstOrDefaultAsync(nv => nv.IdnhanVien == id);

				if (nhanVien == null)
				{
					return NotFound();
				}

				// Xóa tài khoản trước nếu có
				if (nhanVien.IdtaiKhoanNavigation != null)
				{
					_context.TaiKhoans.Remove(nhanVien.IdtaiKhoanNavigation);
					await _context.SaveChangesAsync(); // Lưu ngay để tránh lỗi FK
				}

				// Xóa nhân viên
				_context.NhanViens.Remove(nhanVien);
				await _context.SaveChangesAsync();

				// Commit transaction
				await transaction.CommitAsync();

				return NoContent();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				return StatusCode(500, "Lỗi trong quá trình xóa nhân viên: " + ex.Message);
			}
		}

		[HttpDelete("delete-then-update-status/{id}")]
		public async Task<IActionResult> DeleteThenUpdateStatus(int id)
		{
			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				var nhanVien = await _context.NhanViens
					.Include(nv => nv.IdtaiKhoanNavigation) // Load tài khoản liên quan
					.FirstOrDefaultAsync(nv => nv.IdnhanVien == id);
				if (nhanVien == null)
				{
					return NotFound();
				}
				// Xóa tài khoản trước nếu có
				//if (nhanVien.IdtaiKhoanNavigation != null)
				//{
				//	_context.TaiKhoans.Remove(nhanVien.IdtaiKhoanNavigation);
				//	await _context.SaveChangesAsync(); // Lưu ngay để tránh lỗi FK
				//}
				// Update status
				nhanVien.Status = 2;
				_context.Entry(nhanVien).State = EntityState.Modified;
				await _context.SaveChangesAsync();
				// Commit transaction
				await transaction.CommitAsync();
				return NoContent();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				return StatusCode(500, "Lỗi trong quá trình xóa nhân viên: " + ex.Message);
			}
		}

		private bool NhanVienExists(int id)
		{
			return _context.NhanViens.Any(e => e.IdnhanVien == id);
		}
	}
}
