using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QlyDuAn.Models;

namespace QlyDuAn.Services
{
	public class AuthService
	{
		private readonly QlyDuAnContext dbContext;

		// Constructor nhận đối tượng dbContext từ bên ngoài
		public AuthService(QlyDuAnContext dbContext)
		{
			this.dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
		}

		public async Task<TaiKhoan> LoginAsync(string code, string password)
		{
			if (string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(password))
			{
				return null;
			}

			// Tìm kiếm user trong cơ sở dữ liệu (sử dụng StringComparison.OrdinalIgnoreCase)
			//var user = dbContext.TaiKhoans
			//	.AsEnumerable() // ⚠ Chuyển sang xử lý trên bộ nhớ
			//	.FirstOrDefault(u => u.IdtaiKhoan.Equals(sdt.Trim(), StringComparison.OrdinalIgnoreCase));



			var idTaiKhoan = await dbContext.NhanViens
				.Where(nv => EF.Functions.Like(nv.CodeNhanVien.Trim(), code.Trim())) // Loại bỏ khoảng trắng
				.Select(nv => nv.IdtaiKhoan)
				.FirstOrDefaultAsync();

			if (idTaiKhoan == null)
			{
				return null; // Không tìm thấy nhân viên có số điện thoại này
			}

			// Tìm tài khoản dựa trên IdtaiKhoan lấy được từ nhân viên
			var user = await dbContext.TaiKhoans
				.FirstOrDefaultAsync(tk => tk.IdtaiKhoan == idTaiKhoan);

			// Kiểm tra mật khẩu (bạn nên băm mật khẩu thay vì lưu plaintext)
			if (user != null && VerifyPassword(password, user.MatKhau))
			{
				return user;
			}
			return null;
		}

		// Giả định có hàm VerifyPassword để kiểm tra mật khẩu đã băm
		private bool VerifyPassword(string inputPassword, string storedHashedPassword)
		{
			// Nếu bạn dùng bcrypt thì sẽ là: return BCrypt.Net.BCrypt.Verify(inputPassword, storedHashedPassword);
			return inputPassword == storedHashedPassword; // Thay thế bằng giải pháp băm mật khẩu phù hợp
		}
	}
}