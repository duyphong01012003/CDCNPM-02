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
    public class TruongNhomsController : ControllerBase
    {
        private readonly QlyDuAnContext _context;

        public TruongNhomsController(QlyDuAnContext context)
        {
            _context = context;
        }

        // GET: api/TruongNhoms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TruongNhom>>> GetTruongNhoms()
        {
            return await _context.TruongNhoms.ToListAsync();
        }

        // GET: api/TruongNhoms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TruongNhom>> GetTruongNhom(string id)
        {
            var truongNhom = await _context.TruongNhoms.FindAsync(id);

            if (truongNhom == null)
            {
                return NotFound();
            }

            return truongNhom;
        }

        // PUT: api/TruongNhoms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTruongNhom(string id, TruongNhom truongNhom)
        {
            if (id != truongNhom.IdtruongNhom)
            {
                return BadRequest();
            }

            _context.Entry(truongNhom).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TruongNhomExists(id))
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

        // POST: api/TruongNhoms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TruongNhom>> PostTruongNhom(TruongNhom truongNhom)
        {
            _context.TruongNhoms.Add(truongNhom);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TruongNhomExists(truongNhom.IdtruongNhom))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTruongNhom", new { id = truongNhom.IdtruongNhom }, truongNhom);
        }

        // DELETE: api/TruongNhoms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTruongNhom(string id)
        {
            var truongNhom = await _context.TruongNhoms.FindAsync(id);
            if (truongNhom == null)
            {
                return NotFound();
            }

            _context.TruongNhoms.Remove(truongNhom);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TruongNhomExists(string id)
        {
            return _context.TruongNhoms.Any(e => e.IdtruongNhom == id);
        }
    }
}
