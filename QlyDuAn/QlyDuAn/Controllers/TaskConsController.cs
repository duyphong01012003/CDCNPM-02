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
    public class TaskConsController : ControllerBase
    {
        private readonly QlyDuAnContext _context;

        public TaskConsController(QlyDuAnContext context)
        {
            _context = context;
        }

        // GET: api/TaskCons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskCon>>> GetTaskCons()
        {
            return await _context.TaskCons.ToListAsync();
        }

        // GET: api/TaskCons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskCon>> GetTaskCon(int id)
        {
            var taskCon = await _context.TaskCons.FindAsync(id);

            if (taskCon == null)
            {
                return NotFound();
            }

            return taskCon;
        }

        // PUT: api/TaskCons/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskCon(int id, TaskCon taskCon)
        {
            if (id != taskCon.IdtaskCon)
            {
                return BadRequest();
            }

            _context.Entry(taskCon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskConExists(id))
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

        // POST: api/TaskCons
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TaskCon>> PostTaskCon(TaskCon taskCon)
        {
            _context.TaskCons.Add(taskCon);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TaskConExists(taskCon.IdtaskCon))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTaskCon", new { id = taskCon.IdtaskCon }, taskCon);
        }

        // DELETE: api/TaskCons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskCon(int id)
        {
            var taskCon = await _context.TaskCons.FindAsync(id);
            if (taskCon == null)
            {
                return NotFound();
            }

            _context.TaskCons.Remove(taskCon);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskConExists(int id)
        {
            return _context.TaskCons.Any(e => e.IdtaskCon == id);
        }
    }
}
