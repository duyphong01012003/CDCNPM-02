using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QlyDuAn.Services;

namespace QlyDuAn.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DashboardController : ControllerBase
	{
		private readonly DashboardService _dashboardService;

		public DashboardController(DashboardService dashboardService)
		{
			_dashboardService = dashboardService;
		}

		[HttpGet("nhanVienCount")]
		public IActionResult NhanVienCount()
		{
			int count = _dashboardService.NhanVienCount();
			return Ok(count);
		}

		[HttpGet("duAnCount")]
		public IActionResult DuAnCount()
		{
			int count = _dashboardService.DuAnCount();
			return Ok(count);
		}

		[HttpGet("truongNhomCount")]
		public IActionResult TruongNhomCount()
		{
			int count = _dashboardService.TruongNhomCount();
			return Ok(count);
		}

		[HttpGet("nhomCount")]
		public IActionResult nhomCount()
		{
			int count = _dashboardService.NhomCount();
			return Ok(count);
		}
	}
}

