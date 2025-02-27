using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using QlyDuAn.Models;
using QlyDuAn.Services;
using QlyDuAn.Request;

namespace QlyDuAn.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RegisterController : ControllerBase
	{
		private readonly RegisterService _registerService;

		public RegisterController(RegisterService registerService)
		{
			_registerService = registerService;
		}

		[HttpPost("register")]
		public async Task<ActionResult<string>> Register([FromBody] RegisterRequest request)
		{
			try
			{
				var result = await _registerService.Register(request);
				if (!result)
				{
					return BadRequest("Tạo tài khoản thất bại.");
				}
				return Ok("Tạo tài khoản thành công!");
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = ex.Message });
			}
		}
	}
}
