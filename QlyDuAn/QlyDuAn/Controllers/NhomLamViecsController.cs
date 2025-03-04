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
        public async Task<ActionResult<IEnumerable<NhomLamViec>>> GetNhomLamViecs()
        {
            var Team = await _context.NhomLamViecs
                .Include(nlv => nlv.IdnguoiQuanLyNavigation)
				.Select(nlv => new
				{
					nlv.CodeNhom,
					nlv.TenNhom,
					nlv.SoThanhVien,
                    nlv.IdnguoiQuanLyNavigation.HoTenTruongNhom,
				}
			).ToListAsync();

			return Ok(Team);
			//return await _context.NhomLamViecs.ToListAsync();
		}

		//GET: api/NhomLamViecs/by-name/abc
		[HttpGet("by-name/{name}")]
		public async Task<ActionResult<IEnumerable<DuAn>>> GetNhomLamViecsByName(string name)
		{
			var nhomLamViec = await _context.NhomLamViecs
                .Include(x => x.IdnguoiQuanLyNavigation)
				.Where(x => x.TenNhom.Contains(name))
                .Select(x => new
                {
					x.CodeNhom,
					x.TenNhom,
					x.SoThanhVien,
					x.IdnguoiQuanLyNavigation.HoTenTruongNhom,
				}).ToListAsync();
			if (nhomLamViec == null)
			{
				return NotFound();
			}
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

            return NoContent();
        }

        // POST: api/NhomLamViecs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NhomLamViec>> PostNhomLamViec(NhomLamViec nhomLamViec)
        {
            _context.NhomLamViecs.Add(nhomLamViec);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNhomLamViec", new { id = nhomLamViec.IdnhomLamViec }, nhomLamViec);
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
