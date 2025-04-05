using System.Linq;
using QlyDuAn.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;

namespace QlyDuAn.Services
{
	public class TaskProgressService : BackgroundService
	{
		private readonly IServiceScopeFactory _scopeFactory;

		public TaskProgressService(IServiceScopeFactory scopeFactory)
		{
			_scopeFactory = scopeFactory;
		}

		protected override async System.Threading.Tasks.Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (!stoppingToken.IsCancellationRequested)
			{
				await UpdateAllTaskStatusesAsync();
				await System.Threading.Tasks.Task.Delay(TimeSpan.FromDays(5), stoppingToken);
			}
		}

		private async System.Threading.Tasks.Task UpdateAllTaskStatusesAsync()
		{
			using (var scope = _scopeFactory.CreateScope())
			{
				var _context = scope.ServiceProvider.GetRequiredService<QlyDuAnContext>();
				var tasks = await _context.Tasks.ToListAsync();

				foreach (var task in tasks)
				{
					await UpdateTaskStatusAsync(_context, task.Idtask);
				}

				await UpdateOverdueTaskConsAsync(_context);
			}
		}

		public async System.Threading.Tasks.Task UpdateTaskStatusAsync(QlyDuAnContext _context, int taskId)
		{
			var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Idtask == taskId);

			if (task == null)
				return;

			var taskCons = await _context.TaskCons.Where(tc => tc.IdtaskCha == taskId).ToListAsync();

			bool isTaskOverdue = task.Deadline.HasValue && task.Deadline.Value < DateOnly.FromDateTime(DateTime.Now);

			// Nếu task chính quá hạn
			if (task.TrangThai != "Đã tạo")
			{
				if (isTaskOverdue && task.TrangThai == "Đã được giao")
				{
					task.TrangThai = "Quá hạn";
				}
				else if (taskCons.All(tc => tc.TrangThai == "Đã hoàn thành")
						 && (task.TrangThai == "Đã được giao" || task.TrangThai == "Quá hạn"))
				{
					task.TrangThai = "Đã hoàn thành";
				}
				else
				{
					task.TrangThai = "Đã được giao";
				}
			}


			await _context.SaveChangesAsync();
		}


		private async System.Threading.Tasks.Task UpdateOverdueTaskConsAsync(QlyDuAnContext _context)
		{
			var now = DateOnly.FromDateTime(DateTime.Now);
			var overdueTaskCons = await _context.TaskCons
				.Where(tc => tc.Deadline.HasValue && tc.Deadline.Value < now && tc.TrangThai != "Quá hạn")
				.ToListAsync();

			foreach (var taskCon in overdueTaskCons)
			{
				taskCon.TrangThai = "Quá hạn";
			}

			if (overdueTaskCons.Any())
			{
				await _context.SaveChangesAsync();
			}
		}
	}
}