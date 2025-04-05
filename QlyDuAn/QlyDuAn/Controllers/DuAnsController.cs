using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using QlyDuAn.Models;


namespace QlyDuAn.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DuAnsController : ControllerBase
	{
		private readonly QlyDuAnContext _context;

		public DuAnsController(QlyDuAnContext context)
		{
			_context = context;
		}

		// GET: api/DuAns
		[HttpGet]
		public async Task<ActionResult<IEnumerable<DuAn>>> GetDuAns()
		{
			var DuAn = await _context.DuAns
				.Include(da => da.IdnguoiQuanLyNavigation)
				.Include(da => da.IdnhomLamViecNavigation)
				.Select(da => new
				{
					da.IdduAn,
					da.CodeDuAn,
					da.TenDuAn,
					da.MoTaDuAn,
					da.NgayBatDau,
					da.NgayKetThuc,
					da.IdnhomLamViecNavigation.IdnhomLamViec,
					da.IdnhomLamViecNavigation.CodeNhom,
					da.IdnhomLamViecNavigation.TenNhom,
					da.IdnguoiQuanLyNavigation.IdtruongNhom,
					da.IdnguoiQuanLyNavigation.HoTenTruongNhom,
				}
			).ToListAsync();
			return Ok(DuAn);

			//return await _context.DuAns.ToListAsync();
		}

		[HttpGet("export-excel")]
		public async Task<IActionResult> ExportDuAnsToExcel()
		{
			var duAns = await _context.DuAns
				.Include(da => da.IdnguoiQuanLyNavigation)
				.Include(da => da.IdnhomLamViecNavigation)
				.Select(da => new
				{
					da.IdduAn,
					da.CodeDuAn,
					da.TenDuAn,
					da.MoTaDuAn,
					da.NgayBatDau,
					da.NgayKetThuc,
					NhomLamViec = da.IdnhomLamViecNavigation.TenNhom,
					TruongNhom = da.IdnguoiQuanLyNavigation.HoTenTruongNhom
				})
				.ToListAsync();

			using (var package = new ExcelPackage())
			{
				var worksheet = package.Workbook.Worksheets.Add("DuAnList");

				// Tạo tiêu đề cho các cột
				worksheet.Cells[1, 1].Value = "ID Dự Án";
				worksheet.Cells[1, 2].Value = "Mã Dự Án";
				worksheet.Cells[1, 3].Value = "Tên Dự Án";
				worksheet.Cells[1, 4].Value = "Mô Tả";
				worksheet.Cells[1, 5].Value = "Ngày Bắt Đầu";
				worksheet.Cells[1, 6].Value = "Ngày Kết Thúc";
				worksheet.Cells[1, 7].Value = "Nhóm Làm Việc";
				worksheet.Cells[1, 8].Value = "Trưởng Nhóm";

				using (var range = worksheet.Cells["A1:H1"])
				{
					range.Style.Font.Bold = true; // Bôi đậm
					range.Style.Font.Size = 14;   // Cỡ chữ lớn hơn
					range.Style.Font.Color.SetColor(System.Drawing.Color.Black); // Chữ trắng
					range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
					range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center; // Canh giữa
				}
				// Đổ dữ liệu vào bảng
				int row = 2;
				foreach (var duAn in duAns)
				{
					worksheet.Cells[row, 1].Value = duAn.IdduAn;
					worksheet.Cells[row, 2].Value = duAn.CodeDuAn;
					worksheet.Cells[row, 3].Value = duAn.TenDuAn;
					worksheet.Cells[row, 4].Value = duAn.MoTaDuAn;
					worksheet.Cells[row, 5].Value = duAn.NgayBatDau?.ToString("dd/MM/yyyy");
					worksheet.Cells[row, 6].Value = duAn.NgayKetThuc?.ToString("dd/MM/yyyy");
					worksheet.Cells[row, 7].Value = duAn.NhomLamViec;
					worksheet.Cells[row, 8].Value = duAn.TruongNhom;
					row++;
				}

				// Format bảng (Căn chỉnh và tự động xuống dòng)
				worksheet.Cells.AutoFitColumns();
				worksheet.Cells.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
				worksheet.Cells.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;

				// Trả về file Excel dưới dạng byte
				var excelBytes = package.GetAsByteArray();

				return File(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "DuAnList.xlsx");
			}
		}




		//GET: api/DuAns/5
		[HttpGet("{id}")]
		public async Task<ActionResult<DuAn>> GetDuAn(int id)
		{
			var duAn = await _context.DuAns.FindAsync(id);
			if (duAn == null)
			{
				return NotFound();
			}
			return Ok(duAn);
		}

		//GET: api/DuAns/by-name/abc
		[HttpGet("by-name/{name}")]
		public async Task<ActionResult<IEnumerable<DuAn>>> GetDuAnByName(string name)
		{
			var duAnName = await _context.DuAns
				.Include(x => x.IdnguoiQuanLyNavigation)
				.Include(x => x.IdnhomLamViecNavigation)
				.Where(x => x.TenDuAn.Contains(name))
				.Select(x => new
				{
					x.IdduAn,
					x.CodeDuAn,
					x.TenDuAn,
					x.MoTaDuAn,
					x.NgayBatDau,
					x.NgayKetThuc,
					x.IdnhomLamViecNavigation.IdnhomLamViec,
					x.IdnhomLamViecNavigation.CodeNhom,
					x.IdnhomLamViecNavigation.TenNhom,
					x.IdnguoiQuanLyNavigation.IdtruongNhom,
					x.IdnguoiQuanLyNavigation.HoTenTruongNhom,
				})
				.ToListAsync();
			if (duAnName == null)
			{
				return NotFound();
			}
			return Ok(duAnName);
		}


		// PUT: api/DuAns/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutDuAn(int id, DuAn duAn)
		{
			if (id != duAn.IdduAn)
			{
				return BadRequest();
			}

			_context.Entry(duAn).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!DuAnExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			var duAnResult = await _context.DuAns
					.Include(x => x.IdnguoiQuanLyNavigation)
					.Include(x => x.IdnhomLamViecNavigation)
					.Where(x => x.IdduAn == duAn.IdduAn)
					.Select(x => new
					{
						x.IdduAn,
						x.CodeDuAn,
						x.TenDuAn,
						x.MoTaDuAn,
						x.NgayBatDau,
						x.NgayKetThuc,
						x.IdnhomLamViecNavigation.IdnhomLamViec,
						x.IdnhomLamViecNavigation.CodeNhom,
						x.IdnhomLamViecNavigation.TenNhom,
						x.IdnguoiQuanLyNavigation.IdtruongNhom,
						x.IdnguoiQuanLyNavigation.HoTenTruongNhom,
					})
					.FirstOrDefaultAsync();

			return Ok(duAnResult);
		}

		// POST: api/DuAns
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<DuAn>> PostDuAn(DuAn duAn)
		{
			_context.DuAns.Add(duAn);
			await _context.SaveChangesAsync();

			var duAnResult = await _context.DuAns
					.Include(x => x.IdnguoiQuanLyNavigation)
					.Include(x => x.IdnhomLamViecNavigation)
					.Where(x => x.IdduAn == duAn.IdduAn)
					.Select(x => new
					{
						x.IdduAn,
						x.CodeDuAn,
						x.TenDuAn,
						x.MoTaDuAn,
						x.NgayBatDau,
						x.NgayKetThuc,
						x.IdnhomLamViecNavigation.IdnhomLamViec,
						x.IdnhomLamViecNavigation.CodeNhom,
						x.IdnhomLamViecNavigation.TenNhom,
						x.IdnguoiQuanLyNavigation.IdtruongNhom,
						x.IdnguoiQuanLyNavigation.HoTenTruongNhom,
					})
					.FirstOrDefaultAsync();

			return CreatedAtAction("GetDuAn", new { id = duAn.IdduAn }, duAnResult);
		}

		// DELETE: api/DuAns/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteDuAn(int id)
		{
			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				var duAn = await _context.DuAns
					.Include(da => da.IdnhomLamViecNavigation) // Load nhóm
					.FirstOrDefaultAsync(da => da.IdduAn == id);
				if (duAn == null)
				{
					return NotFound();
				}

				var taiLieu = await _context.TaiLieus.Where(tl => tl.IdduAn == id).ToListAsync();
				if (taiLieu.Any())
				{
					_context.TaiLieus.RemoveRange(taiLieu);
				}

				var tank = await _context.Tasks.Where(t => t.IdduAn == id).ToListAsync();
				if (tank.Any())
				{
					var tankId = tank.Select(t => t.Idtask).ToList();
					var tankcon = await _context.TaskCons.Where(tc => tankId.Contains(tc.IdtaskCon)).ToListAsync();
					if (tankcon.Any())
					{
						_context.TaskCons.RemoveRange(tankcon);
					}

					_context.Tasks.RemoveRange(tank);
				}

				_context.DuAns.Remove(duAn);
				await _context.SaveChangesAsync();

				await transaction.CommitAsync();

				return NoContent();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				return StatusCode(500, "Lỗi trong quá trình xóa dự án: " + ex.InnerException?.Message ?? ex.Message);
			}
		}

		private bool DuAnExists(int id)
		{
			return _context.DuAns.Any(e => e.IdduAn == id);
		}
	}
}
