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
	public class TaiKhoansController : ControllerBase
	{
		private readonly QlyDuAnContext _context;

		public TaiKhoansController(QlyDuAnContext context)
		{
			_context = context;
		}

		// GET: api/TaiKhoans
		[HttpGet]
		public async Task<ActionResult<IEnumerable<TaiKhoan>>> GetTaiKhoans()
		{
			var taiKhoan = await _context.TaiKhoans.
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
								nv.IdnhanVien,
								nv.Sdt,
								nv.NgaySinh,
								nv.GioiTinh,
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
								tn.IdtruongNhom,
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
								ad.Idadmin,
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

		//GET: api/TaiKhoans/by-name/abc
		[HttpGet("by-name/{searchName}")]
		public async Task<ActionResult<IEnumerable<TaiKhoan>>> GetTaiKhoansByName(string searchName)
		{
			var taiKhoan = await _context.TaiKhoans.
				Where(tk => _context.NhanViens.Any(nv => nv.IdtaiKhoan == tk.IdtaiKhoan && nv.HoTenNhanVien.Contains(searchName)) ||
							_context.TruongNhoms.Any(tn => tn.IdtaiKhoan == tk.IdtaiKhoan && tn.HoTenTruongNhom.Contains(searchName)) ||
							_context.Admins.Any(ad => ad.IdtaiKhoan == tk.IdtaiKhoan && ad.HoTenAdmin.Contains(searchName))).
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
				}).ToListAsync();
			return Ok(taiKhoan);
		}

		//GET: api/TaiKhoans/5
		[HttpGet("{id}")]
		public async Task<ActionResult<TaiKhoan>> GetTaiKhoan(int id)
		{
			var taiKhoan = await _context.TaiKhoans.FindAsync(id);
			if (taiKhoan == null)
			{
				return NotFound();
			}
			return Ok(taiKhoan);
		}


		// PUT: api/TaiKhoans/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutTaiKhoan(int id, TaiKhoan taiKhoan)
		{
			if (id != taiKhoan.IdtaiKhoan)
			{
				return BadRequest();
			}

			try
			{
				if (taiKhoan.QuyenTaiKhoan == "NhanVien")
				{
					var nhanVien = await _context.NhanViens.FirstOrDefaultAsync(nv => nv.IdtaiKhoan == id);
					if (nhanVien != null)
					{
						nhanVien.HoTenNhanVien = taiKhoan.NhanViens.FirstOrDefault()?.HoTenNhanVien;
						nhanVien.Sdt = taiKhoan.NhanViens.FirstOrDefault()?.Sdt;
						nhanVien.NgaySinh = taiKhoan.NhanViens.FirstOrDefault()?.NgaySinh;
						nhanVien.GioiTinh = taiKhoan.NhanViens.FirstOrDefault()?.GioiTinh;
						nhanVien.Email = taiKhoan.NhanViens.FirstOrDefault()?.Email;
						nhanVien.IdnguoiQuanLy = taiKhoan.NhanViens.FirstOrDefault()?.IdnguoiQuanLy;
						nhanVien.IdnhomLamViec = taiKhoan.NhanViens.FirstOrDefault()?.IdnhomLamViec;
					}
				}
				else if (taiKhoan.QuyenTaiKhoan == "TruongNhom")
				{
					var truongNhom = await _context.TruongNhoms.FirstOrDefaultAsync(tn => tn.IdtaiKhoan == id);
					if (truongNhom != null)
					{
						truongNhom.HoTenTruongNhom = taiKhoan.TruongNhoms.FirstOrDefault()?.HoTenTruongNhom;
						truongNhom.Sdt = taiKhoan.TruongNhoms.FirstOrDefault()?.Sdt;
						truongNhom.NgaySinh = taiKhoan.TruongNhoms.FirstOrDefault()?.NgaySinh;
						truongNhom.GioiTinh = taiKhoan.TruongNhoms.FirstOrDefault()?.GioiTinh;
						truongNhom.Email = taiKhoan.TruongNhoms.FirstOrDefault()?.Email;
					}
				}
				else if (taiKhoan.QuyenTaiKhoan == "Admin")
				{
					var admin = await _context.Admins.FirstOrDefaultAsync(ad => ad.IdtaiKhoan == id);
					if (admin != null)
					{
						admin.HoTenAdmin = taiKhoan.Admins.FirstOrDefault()?.HoTenAdmin;
						admin.Sdt = taiKhoan.Admins.FirstOrDefault()?.Sdt;
						admin.NgaySinh = taiKhoan.Admins.FirstOrDefault()?.NgaySinh;
						admin.GioiTinh = taiKhoan.Admins.FirstOrDefault()?.GioiTinh;
						admin.Email = taiKhoan.Admins.FirstOrDefault()?.Email;
					}
				}

				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!_context.TaiKhoans.Any(e => e.IdtaiKhoan == id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}


		// POST: api/TaiKhoans
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<TaiKhoan>> PostTaiKhoan(TaiKhoan taiKhoan)
		{
			if (string.IsNullOrEmpty(taiKhoan.MatKhau))
			{
				taiKhoan.MatKhau = "12345678";
			}

			_context.TaiKhoans.Add(taiKhoan);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetTaiKhoan", new { id = taiKhoan.IdtaiKhoan }, taiKhoan);
		}

		// DELETE: api/TaiKhoans/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTaiKhoan(int id)
		{
			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				var taiKhoan = await _context.TaiKhoans.FindAsync(id);
				if (taiKhoan == null)
				{
					return NotFound();
				}

				// Tìm và xóa tất cả nhân viên có tài khoản này
				var nhanViens = await _context.NhanViens.Where(nv => nv.IdtaiKhoan == id).ToListAsync();
				if (nhanViens.Any())
				{
					_context.NhanViens.RemoveRange(nhanViens);
					await _context.SaveChangesAsync();
				}
				// Tìm và xóa tất cả trưởng nhóm có tài khoản này
				var truongNhoms = await _context.TruongNhoms.Where(tn => tn.IdtaiKhoan == id).ToListAsync();
				if (truongNhoms.Any())
				{
					_context.TruongNhoms.RemoveRange(truongNhoms);
					await _context.SaveChangesAsync();
				}

				// Tìm và xóa tất cả admin có tài khoản này
				var admins = await _context.Admins.Where(ad => ad.IdtaiKhoan == id).ToListAsync();
				if (admins.Any())
				{
					_context.Admins.RemoveRange(admins);
					await _context.SaveChangesAsync();
				}

				_context.TaiKhoans.Remove(taiKhoan);
				await _context.SaveChangesAsync();

				await transaction.CommitAsync();

				return NoContent();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				return StatusCode(500, "Lỗi trong quá trình xóa tài khoản: " + ex.Message);
			}

		}

		private bool TaiKhoanExists(int id)
		{
			return _context.TaiKhoans.Any(e => e.IdtaiKhoan == id);
		}
	}
}
