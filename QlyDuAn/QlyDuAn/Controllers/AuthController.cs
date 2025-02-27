﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QlyDuAn.Services; // 💡 Kiểm tra và thêm dòng này nếu thiếu
using QlyDuAn.Request;

namespace QlyDuAn.Controllers
{
	[Route("api/auth")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly AuthService _authService;

		public AuthController(AuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("login")]
		public async Task<ActionResult<LoginRequest>> Login([FromBody] LoginRequest request)
		{
			var user = await _authService.LoginAsync(request.Code, request.Password);

			if (user == null)
			{
				return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu!" });
			}

			return Ok(new { message = "Đăng nhập thành công", username = user.IdtaiKhoan });
		}
	}


}
