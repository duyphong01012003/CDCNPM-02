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
	public class NhomLamViecsController : ControllerBase
	{
		private readonly QlyDuAnContext _context;

		public NhomLamViecsController(QlyDuAnContext context)
		{
			_context = context;
		}

		// GET: api/NhomLamViecs
		[HttpGet]
		public async Task<ActionResult<IEnumerable<object>>> GetNhomLamViecs()
		{
			var Team = await _context.NhomLamViecs
				.Include(nlv => nlv.IdnguoiQuanLyNavigation)
				.Select(nlv => new
				{
					nlv.IdnhomLamViec,
					nlv.CodeNhom,
					nlv.TenNhom,
					nlv.MoTaNhom,
					nlv.SoThanhVien,
					nlv.IdnguoiQuanLyNavigation.IdtruongNhom,
					nlv.IdnguoiQuanLyNavigation.HoTenTruongNhom,

					// Lấy tất cả dự án liên quan đến nhóm làm việc này
					DuAn = _context.DuAns
						.Where(da => da.IdnhomLamViec == nlv.IdnhomLamViec)
						.Select(da => new
						{
							da.IdduAn,
							da.CodeDuAn,
							da.TenDuAn
						}).ToList(),

				})
				.ToListAsync(); // Thực thi truy vấn và trả về danh sách

			return Ok(Team);
		}

		// GET: api/NhomLamViecs/5
		[HttpGet("{id}")]
		public async Task<ActionResult<NhomLamViec>> GetNhomLamViec(int id)
		{
			var nhomLamViec = await _context.NhomLamViecs.FindAsync(id);
			if (nhomLamViec == null)
			{
				return NotFound();
			}
			return Ok(nhomLamViec);
		}


		[HttpGet("by-name/{name?}")] // Dấu ? cho phép name là tùy chọn
		public async Task<ActionResult<IEnumerable<NhomLamViec>>> GetNhomLamViecsByName(string? name)
		{
			var query = _context.NhomLamViecs
				.Include(nlv => nlv.IdnguoiQuanLyNavigation)
				.Select(nlv => new
				{
					nlv.IdnhomLamViec,
					nlv.CodeNhom,
					nlv.TenNhom,
					nlv.MoTaNhom,
					nlv.SoThanhVien,
					nlv.IdnguoiQuanLyNavigation.IdtruongNhom,
					nlv.IdnguoiQuanLyNavigation.HoTenTruongNhom,
					DuAn = _context.DuAns
						.Where(da => da.IdnhomLamViec == nlv.IdnhomLamViec)
						.Select(da => new
						{
							da.CodeDuAn,
							da.TenDuAn
						}).FirstOrDefault()
				});

			// Nếu name có giá trị, lọc theo tên nhóm
			if (!string.IsNullOrEmpty(name))
			{
				query = query.Where(x => x.TenNhom.Contains(name));
			}

			var nhomLamViec = await query.ToListAsync();
			return Ok(nhomLamViec);
		}

		// PUT: api/NhomLamViecs/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutNhomLamViec(int id, NhomLamViec nhomLamViec)
		{
			if (id != nhomLamViec.IdnhomLamViec)
			{
				return BadRequest();
			}

			_context.Entry(nhomLamViec).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!NhomLamViecExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			var nhomResult = _context.NhomLamViecs
				.Include(nlv => nlv.IdnguoiQuanLyNavigation)
				.Where(nlv => nlv.IdnhomLamViec == nhomLamViec.IdnhomLamViec)
				.Select(nlv => new
				{
					nlv.IdnhomLamViec,
					nlv.CodeNhom,
					nlv.TenNhom,
					nlv.MoTaNhom,
					nlv.SoThanhVien,
					nlv.IdnguoiQuanLyNavigation.IdtruongNhom,
					nlv.IdnguoiQuanLyNavigation.HoTenTruongNhom,
					DuAn = _context.DuAns
						.Where(da => da.IdnhomLamViec == nlv.IdnhomLamViec)
						.Select(da => new
						{
							da.CodeDuAn,
							da.TenDuAn
						}).FirstOrDefault()
				});

			return Ok(nhomResult);
		}

		// POST: api/NhomLamViecs
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<NhomLamViec>> PostNhomLamViec(NhomLamViec nhomLamViec)
		{
			_context.NhomLamViecs.Add(nhomLamViec);
			await _context.SaveChangesAsync();

			var hoTenTruongNhom = await _context.NhomLamViecs
				.Where(nlv => nlv.IdnhomLamViec == nhomLamViec.IdnhomLamViec)
				.Include(nlv => nlv.IdnguoiQuanLyNavigation)
				.Select(nlv => nlv.IdnguoiQuanLyNavigation.HoTenTruongNhom)
				.FirstOrDefaultAsync();

			return Ok(hoTenTruongNhom);
		}

		// DELETE: api/NhomLamViecs/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteNhomLamViec(int id)
		{
			var nhomLamViec = await _context.NhomLamViecs.FindAsync(id);
			if (nhomLamViec == null)
			{
				return NotFound();
			}
			await _context.NhanViens
				.Where(nv => nv.IdnhomLamViec == id)
				.ForEachAsync(nv => nv.IdnhomLamViec = null);

			_context.NhomLamViecs.Remove(nhomLamViec);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool NhomLamViecExists(int id)
		{
			return _context.NhomLamViecs.Any(e => e.IdnhomLamViec == id);
		}
	}
}
