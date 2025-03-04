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
					tk.CodeTaiKhoan,
                    ThongTin = tk.QuyenTaiKhoan == "NhanVien"
                        ? (object)_context.NhanViens
						    .Where(nv => nv.IdtaiKhoan == tk.IdtaiKhoan)
                            .Select(nv => new
						    {
					            nv.HoTenNhanVien,
				    	        nv.Sdt
						    }
                            ).FirstOrDefault()
						: tk.QuyenTaiKhoan == "TruongNhom"
						? (object)_context.TruongNhoms
                            .Where(tn => tn.IdtaiKhoan == tk.IdtaiKhoan)
							.Select(tn => new
							{
                                tn.HoTenTruongNhom,
								tn.Sdt
							}
							).FirstOrDefault()
						: (object)_context.Admins
							.Where(ad => ad.IdtaiKhoan == tk.IdtaiKhoan)
                            .Select(ad => new
							{
								ad.HoTenAdmin,
                                ad.Sdt
							}
                            ).FirstOrDefault(),
                    tk.QuyenTaiKhoan
				}
			).ToListAsync();
			return Ok(taiKhoan);
		}

		// GET: api/TaiKhoans/5
		//GET: api/TaiKhoans/by-name/abc
		[HttpGet("by-name/{name}")]
		public async Task<ActionResult<IEnumerable<DuAn>>> GetTaiKhoansByName(string name)
		{
			var duAnName = await _context.DuAns.Where(x => x.TenDuAn == name).ToListAsync();
			if (duAnName == null)
			{
				return NotFound();
			}
			return duAnName;
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

            _context.Entry(taiKhoan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaiKhoanExists(id))
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
            var taiKhoan = await _context.TaiKhoans.FindAsync(id);
            if (taiKhoan == null)
            {
                return NotFound();
            }

            _context.TaiKhoans.Remove(taiKhoan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaiKhoanExists(int id)
        {
            return _context.TaiKhoans.Any(e => e.IdtaiKhoan == id);
        }
    }
}
