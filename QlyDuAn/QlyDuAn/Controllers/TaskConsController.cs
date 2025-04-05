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
			var taskCon = await _context.TaskCons
				.Include(tc => tc.IdnguoiTaoTaskNavigation)
				.Include(tc => tc.IdtaskChaNavigation)
				.Select(tc => new
				{
					tc.IdtaskCon,
					tc.CodeTankCon,
					tc.TenTaskCon,
					tc.NgayTao,
					tc.Deadline,
					tc.TrangThai,
					tc.IdtaskChaNavigation.Idtask,
					tc.IdtaskChaNavigation.CodeTank,
					tc.IdtaskChaNavigation.TenTask,
					tc.IdnguoiTaoTaskNavigation.IdnhanVien,
					tc.IdnguoiTaoTaskNavigation.HoTenNhanVien
				}).ToListAsync();

			return Ok(taskCon);
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

		// GET: api/TaskCons/by-name/abc
		[HttpGet("by-name/{name}")]
		public async Task<ActionResult<IEnumerable<TaskCon>>> GetTaskConsByName(string name)
		{
			var taskCon = await _context.TaskCons
				.Include(tc => tc.IdnguoiTaoTaskNavigation)
				.Include(tc => tc.IdtaskChaNavigation)
				.Where(tc => tc.TenTaskCon.Contains(name))
				.Select(tc => new
				{
					tc.IdtaskCon,
					tc.CodeTankCon,
					tc.TenTaskCon,
					tc.NgayTao,
					tc.Deadline,
					tc.TrangThai,
					tc.IdtaskChaNavigation.Idtask,
					tc.IdtaskChaNavigation.CodeTank,
					tc.IdtaskChaNavigation.TenTask,
					tc.IdnguoiTaoTaskNavigation.IdnhanVien,
					tc.IdnguoiTaoTaskNavigation.HoTenNhanVien
				}).ToListAsync();
			return Ok(taskCon);
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
			var taskConResult = await _context.TaskCons
				.Include(tc => tc.IdnguoiTaoTaskNavigation)
				.Include(tc => tc.IdtaskChaNavigation)
				.Where(tc => tc.IdtaskCon == taskCon.IdtaskCon)
				.Select(tc => new
				{
					tc.IdtaskCon,
					tc.CodeTankCon,
					tc.TenTaskCon,
					tc.NgayTao,
					tc.Deadline,
					tc.TrangThai,
					tc.IdtaskChaNavigation.Idtask,
					tc.IdtaskChaNavigation.CodeTank,
					tc.IdtaskChaNavigation.TenTask,
					tc.IdnguoiTaoTaskNavigation.IdnhanVien,
					tc.IdnguoiTaoTaskNavigation.HoTenNhanVien
				}).ToListAsync();
			return Ok(taskConResult);
		}

		// POST: api/TaskCons
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<TaskCon>> PostTaskCon(TaskCon taskCon)
		{
			_context.TaskCons.Add(taskCon);
			await _context.SaveChangesAsync();

			var taskConResult = await _context.TaskCons
				.Include(tc => tc.IdnguoiTaoTaskNavigation)
				.Include(tc => tc.IdtaskChaNavigation)
				.Where(tc => tc.IdtaskCon == taskCon.IdtaskCon)
				.Select(tc => new
				{
					tc.IdtaskCon,
					tc.CodeTankCon,
					tc.TenTaskCon,
					tc.NgayTao,
					tc.Deadline,
					tc.TrangThai,
					tc.IdtaskChaNavigation.Idtask,
					tc.IdtaskChaNavigation.CodeTank,
					tc.IdtaskChaNavigation.TenTask,
					tc.IdnguoiTaoTaskNavigation.IdnhanVien,
					tc.IdnguoiTaoTaskNavigation.HoTenNhanVien
				}).ToListAsync();
			return Ok(taskConResult);
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
			if (taskCon.TrangThai == "Đang thực hiện")
			{
				return BadRequest();
			}

			_context.TaskCons.Remove(taskCon);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool TaskConExists(int id)
		{
			return _context.TaskCons.Any(e => e.IdtaskCon == id);
		}

		//Update status "Đang thực hiện"
		[HttpPut("accept/{id}")]
		public async Task<IActionResult> DoingTaskCon(int id)
		{
			var taskCon = await _context.TaskCons.FindAsync(id);
			if (taskCon == null)
			{
				return NotFound();
			}
			taskCon.TrangThai = "Đang thực hiện";
			_context.Entry(taskCon).State = EntityState.Modified;
			await _context.SaveChangesAsync();
			var taskConResult = await _context.TaskCons
				.Include(tc => tc.IdnguoiTaoTaskNavigation)
				.Include(tc => tc.IdtaskChaNavigation)
				.Where(tc => tc.IdtaskCon == taskCon.IdtaskCon)
				.Select(tc => new
				{
					tc.IdtaskCon,
					tc.CodeTankCon,
					tc.TenTaskCon,
					tc.NgayTao,
					tc.Deadline,
					tc.TrangThai,
					tc.IdtaskChaNavigation.Idtask,
					tc.IdtaskChaNavigation.CodeTank,
					tc.IdtaskChaNavigation.TenTask,
					tc.IdnguoiTaoTaskNavigation.IdnhanVien,
					tc.IdnguoiTaoTaskNavigation.HoTenNhanVien
				}).ToListAsync();
			return Ok(taskConResult);
		}

		//Update status "Đã hoàn thành"
		[HttpPut("complete/{id}")]
		public async Task<IActionResult> CompleteTaskCon(int id)
		{
			var taskCon = await _context.TaskCons.FindAsync(id);
			if (taskCon == null)
			{
				return NotFound();
			}
			taskCon.TrangThai = "Đã hoàn thành";
			_context.Entry(taskCon).State = EntityState.Modified;
			await _context.SaveChangesAsync();
			var taskConResult = await _context.TaskCons
				.Include(tc => tc.IdnguoiTaoTaskNavigation)
				.Include(tc => tc.IdtaskChaNavigation)
				.Where(tc => tc.IdtaskCon == taskCon.IdtaskCon)
				.Select(tc => new
				{
					tc.IdtaskCon,
					tc.CodeTankCon,
					tc.TenTaskCon,
					tc.NgayTao,
					tc.Deadline,
					tc.TrangThai,
					tc.IdtaskChaNavigation.Idtask,
					tc.IdtaskChaNavigation.CodeTank,
					tc.IdtaskChaNavigation.TenTask,
					tc.IdnguoiTaoTaskNavigation.IdnhanVien,
					tc.IdnguoiTaoTaskNavigation.HoTenNhanVien
				}).ToListAsync();
			return Ok(taskConResult);
		}
	}
}
