﻿using System;
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
    public class TaiLieuxController : ControllerBase
    {
        private readonly QlyDuAnContext _context;

        public TaiLieuxController(QlyDuAnContext context)
        {
            _context = context;
        }

        // GET: api/TaiLieux
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaiLieu>>> GetTaiLieus()
        {
            return await _context.TaiLieus.ToListAsync();
        }

        // GET: api/TaiLieux/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaiLieu>> GetTaiLieu(int id)
        {
            var taiLieu = await _context.TaiLieus.FindAsync(id);

            if (taiLieu == null)
            {
                return NotFound();
            }

            return taiLieu;
        }

        // PUT: api/TaiLieux/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaiLieu(int id, TaiLieu taiLieu)
        {
            if (id != taiLieu.IdtaiLieu)
            {
                return BadRequest();
            }

            _context.Entry(taiLieu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaiLieuExists(id))
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

        // POST: api/TaiLieux
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TaiLieu>> PostTaiLieu(TaiLieu taiLieu)
        {
            _context.TaiLieus.Add(taiLieu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTaiLieu", new { id = taiLieu.IdtaiLieu }, taiLieu);
        }

        // DELETE: api/TaiLieux/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaiLieu(int id)
        {
            var taiLieu = await _context.TaiLieus.FindAsync(id);
            if (taiLieu == null)
            {
                return NotFound();
            }

            _context.TaiLieus.Remove(taiLieu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaiLieuExists(int id)
        {
            return _context.TaiLieus.Any(e => e.IdtaiLieu == id);
        }
    }
}
