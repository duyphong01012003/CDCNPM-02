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
	public class TasksController : ControllerBase
	{
		private readonly QlyDuAnContext _context;

		public TasksController(QlyDuAnContext context)
		{
			_context = context;
		}

		// GET: api/Tasks
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Models.Task>>> GetTasks()
		{
			var Task = await _context.Tasks
				.Include(t => t.IdduAnNavigation)
				.Include(t => t.IdnguoiTaoTaskNavigation)
				.Include(t => t.IdnhanVienNhanTaskNavigation)
				.Select( t => new
				{
					t.Idtask,
					t.CodeTank,
					t.TenTask,
					t.NgayGiaoTask,
					t.NgayKetThucTask,
					t.Deadline,
					t.TrangThai,
					t.MoTaCongViec,
					t.IdduAnNavigation.TenDuAn,
					t.IdduAnNavigation.IdduAn,
					t.IdduAnNavigation.CodeDuAn,
					t.IdnguoiTaoTaskNavigation.IdtruongNhom,
					t.IdnguoiTaoTaskNavigation.HoTenTruongNhom,
					t.IdnhanVienNhanTaskNavigation.IdnhanVien,
					CodeTaiKhoan = _context.NhanViens.Where(nv => nv.IdnhanVien == t.IdnhanVienNhanTask).Select(nv => nv.IdtaiKhoanNavigation.CodeTaiKhoan).ToList(),
					t.IdnhanVienNhanTaskNavigation.HoTenNhanVien,

				}).ToListAsync();
			return Ok(Task);

			//   return await _context.Tasks.ToListAsync();
		}

		// GET: api/Tasks/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Models.Task>> GetTask(int id)
		{
			var task = await _context.Tasks.FindAsync(id);

			if (task == null)
			{
				return NotFound();
			}

			return task;
		}

		//GET: api/Tasks/by-name/abc
		[HttpGet("by-name/{name}")]
		public async Task<ActionResult<IEnumerable<Models.Task>>> GetTasksByName(string name)
		{
			var task = await _context.Tasks
				.Include(t => t.IdduAnNavigation)
				.Include(t => t.IdnguoiTaoTaskNavigation)
				.Include(t => t.IdnhanVienNhanTaskNavigation)
				.Where(t => t.TenTask.Contains(name))
				.Select(t => new
				{
					t.Idtask,
					t.CodeTank,
					t.TenTask,
					t.NgayGiaoTask,
					t.NgayKetThucTask,
					t.Deadline,
					t.TrangThai,
					t.MoTaCongViec,
					t.IdduAnNavigation.TenDuAn,
					t.IdduAnNavigation.IdduAn,
					t.IdduAnNavigation.CodeDuAn,
					t.IdnguoiTaoTaskNavigation.IdtruongNhom,
					t.IdnguoiTaoTaskNavigation.HoTenTruongNhom,
					t.IdnhanVienNhanTaskNavigation.IdnhanVien,
					CodeTaiKhoan = _context.NhanViens.Where(nv => nv.IdnhanVien == t.IdnhanVienNhanTask).Select(nv => nv.IdtaiKhoanNavigation.CodeTaiKhoan).ToList(),
					t.IdnhanVienNhanTaskNavigation.HoTenNhanVien,
				}).ToListAsync();
			if (task == null)
			{
				return NotFound();
			}
			return Ok(task);
		}

		// PUT: api/Tasks/5
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut("{id}")]
		public async Task<IActionResult> PutTask(int id, Models.Task task)
		{
			if (id != task.Idtask)
			{
				return BadRequest();
			}

			_context.Entry(task).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!TaskExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			var taskResult = await _context.Tasks
				.Include(t => t.IdduAnNavigation)
				.Include(t => t.IdnguoiTaoTaskNavigation)
				.Include(t => t.IdnhanVienNhanTaskNavigation)
				.Where(t => t.Idtask == task.Idtask)
				.Select(t => new
				{
					t.Idtask,
					t.CodeTank,
					t.TenTask,
					t.NgayGiaoTask,
					t.NgayKetThucTask,
					t.Deadline,
					t.TrangThai,
					t.MoTaCongViec,
					t.IdduAnNavigation.TenDuAn,
					t.IdduAnNavigation.IdduAn,
					t.IdduAnNavigation.CodeDuAn,
					t.IdnguoiTaoTaskNavigation.IdtruongNhom,
					t.IdnguoiTaoTaskNavigation.HoTenTruongNhom,
					t.IdnhanVienNhanTaskNavigation.IdnhanVien,
					CodeTaiKhoan = _context.NhanViens.Where(nv => nv.IdnhanVien == t.IdnhanVienNhanTask).Select(nv => nv.IdtaiKhoanNavigation.CodeTaiKhoan).ToList(),
					t.IdnhanVienNhanTaskNavigation.HoTenNhanVien,
				}).FirstOrDefaultAsync();


			return Ok(taskResult);
		}

		// POST: api/Tasks
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<ActionResult<Models.Task>> PostTask(Models.Task task)
		{
			Console.WriteLine($"IdNguoiTaoTask: {task.IdnguoiTaoTask}");

			// Kiểm tra tồn tại IDNguoiTaoTask trong bảng TruongNhom
			if (!_context.TruongNhoms.Any(tn => tn.IdtruongNhom == task.IdnguoiTaoTask))
			{
				return BadRequest("Người tạo Task không tồn tại trong hệ thống.");
			}

			// Kiểm tra tồn tại IDNhanVienNhanTask trong bảng NhanVien
			if (!_context.NhanViens.Any(nv => nv.IdnhanVien == task.IdnhanVienNhanTask))
			{
				return BadRequest("Nhân viên nhận Task không tồn tại.");
			}

			_context.Tasks.Add(task);
			await _context.SaveChangesAsync();

			var taskResult = await _context.Tasks
				.Include(t => t.IdduAnNavigation)
				.Include(t => t.IdnguoiTaoTaskNavigation)
				.Include(t => t.IdnhanVienNhanTaskNavigation)
				.Where(t => t.Idtask == task.Idtask)
				.Select(t => new
				{
					t.Idtask,
					t.CodeTank,
					t.TenTask,
					t.NgayGiaoTask,
					t.NgayKetThucTask,
					t.Deadline,
					t.TrangThai,
					t.MoTaCongViec,
					t.IdduAnNavigation.TenDuAn,
					t.IdduAnNavigation.IdduAn,
					t.IdduAnNavigation.CodeDuAn,
					t.IdnguoiTaoTaskNavigation.IdtruongNhom,
					t.IdnguoiTaoTaskNavigation.HoTenTruongNhom,
					t.IdnhanVienNhanTaskNavigation.IdnhanVien,
					CodeTaiKhoan = _context.NhanViens
						.Where(nv => nv.IdnhanVien == t.IdnhanVienNhanTask)
						.Select(nv => nv.IdtaiKhoanNavigation.CodeTaiKhoan)
						.FirstOrDefault(),
					t.IdnhanVienNhanTaskNavigation.HoTenNhanVien,
				})
				.FirstOrDefaultAsync();

			return Ok(taskResult);
		}


		// DELETE: api/Tasks/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTask(int id)
		{
			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				var task = await _context.Tasks.FindAsync(id);
				if (task == null)
				{
					return NotFound();
				}

				var taskCon = await _context.TaskCons.Where(tc => tc.IdtaskCha == id).ToListAsync();
				if (taskCon.Any())
				{
					_context.TaskCons.RemoveRange(taskCon);
					await _context.SaveChangesAsync();
					await transaction.CommitAsync();
				}

				_context.Tasks.Remove(task);
				await _context.SaveChangesAsync();

				return NoContent();
			}
			catch (Exception)
			{
				await transaction.RollbackAsync();
				return BadRequest();
			}
		}

		private bool TaskExists(int id)
		{
			return _context.Tasks.Any(e => e.Idtask == id);
		}

		//Update status "Accept"
		[HttpPut("accept/{id}")]
		public async Task<IActionResult> AcceptTask(int id)
		{
			var task = await _context.Tasks.FindAsync(id);
			if (task == null)
			{
				return NotFound();
			}
			task.TrangThai = "Đã được giao";
			_context.Entry(task).State = EntityState.Modified;
			await _context.SaveChangesAsync();
			var taskResult = await _context.Tasks
				.Include(t => t.IdduAnNavigation)
				.Include(t => t.IdnguoiTaoTaskNavigation)
				.Include(t => t.IdnhanVienNhanTaskNavigation)
				.Where(t => t.Idtask == task.Idtask)
				.Select(t => new
				{
					t.Idtask,
					t.CodeTank,
					t.TenTask,
					t.NgayGiaoTask,
					t.NgayKetThucTask,
					t.Deadline,
					t.TrangThai,
					t.MoTaCongViec,
					t.IdduAnNavigation.TenDuAn,
					t.IdduAnNavigation.IdduAn,
					t.IdduAnNavigation.CodeDuAn,
					t.IdnguoiTaoTaskNavigation.IdtruongNhom,
					t.IdnguoiTaoTaskNavigation.HoTenTruongNhom,
					t.IdnhanVienNhanTaskNavigation.IdnhanVien,
					t.IdnhanVienNhanTaskNavigation.HoTenNhanVien,
				}).FirstOrDefaultAsync();


			return Ok(taskResult);
		}

		//Update status "Decline"
		[HttpPut("decline/{id}")]
		public async Task<IActionResult> DeclineTask(int id)
		{
			var task = await _context.Tasks.FindAsync(id);
			if (task == null)
			{
				return NotFound();
			}
			task.TrangThai = "Từ chối";
			_context.Entry(task).State = EntityState.Modified;
			await _context.SaveChangesAsync();
			var taskResult = await _context.Tasks
				.Include(t => t.IdduAnNavigation)
				.Include(t => t.IdnguoiTaoTaskNavigation)
				.Include(t => t.IdnhanVienNhanTaskNavigation)
				.Where(t => t.Idtask == task.Idtask)
				.Select(t => new
				{
					t.Idtask,
					t.CodeTank,
					t.TenTask,
					t.NgayGiaoTask,
					t.NgayKetThucTask,
					t.Deadline,
					t.TrangThai,
					t.MoTaCongViec,
					t.IdduAnNavigation.TenDuAn,
					t.IdduAnNavigation.IdduAn,
					t.IdduAnNavigation.CodeDuAn,
					t.IdnguoiTaoTaskNavigation.IdtruongNhom,
					t.IdnguoiTaoTaskNavigation.HoTenTruongNhom,
					t.IdnhanVienNhanTaskNavigation.IdnhanVien,
					t.IdnhanVienNhanTaskNavigation.HoTenNhanVien,
				}).FirstOrDefaultAsync();


			return Ok(taskResult);
		}



	}
}
