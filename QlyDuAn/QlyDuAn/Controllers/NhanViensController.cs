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
				Select(nv => new
				{
					id = nv.IdtaiKhoanNavigation.CodeTaiKhoan,
					nv.HoTenNhanVien,
					nv.Sdt,
					nv.IdtaiKhoanNavigation.QuyenTaiKhoan
				}
			).ToListAsync();
			return Ok(nhanVien);
			//return await _context.NhanViens.ToListAsync();
		}

		//GET: api/NhanViens/by-name/abc
		[HttpGet("by-name/{name}")]
		public async Task<ActionResult<IEnumerable<DuAn>>> GetNhanViensByName(string name)
		{
			var nhanVien = await _context.NhanViens
                .Include(x => x.IdtaiKhoanNavigation)
				.Where(x => x.HoTenNhanVien.Contains(name))
                .Select(x => new
                {
					id = x.IdtaiKhoanNavigation.CodeTaiKhoan,
					x.HoTenNhanVien,
					x.Sdt,
					x.IdtaiKhoanNavigation.QuyenTaiKhoan
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

            return NoContent();
        }

        // POST: api/NhanViens
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NhanVien>> PostNhanVien(NhanVien nhanVien)
        {
            _context.NhanViens.Add(nhanVien);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNhanVien", new { id = nhanVien.IdnhanVien }, nhanVien);
        }

        // DELETE: api/NhanViens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhanVien(int id)
        {
            var nhanVien = await _context.NhanViens.FindAsync(id);
            if (nhanVien == null)
            {
                return NotFound();
            }

            _context.NhanViens.Remove(nhanVien);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NhanVienExists(int id)
        {
            return _context.NhanViens.Any(e => e.IdnhanVien == id);
        }
    }
}
