using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace QuanlyDoanhNghiep
{
    public class AuthService
    {
        private readonly AppDbContext dbContext;

        // Constructor nhận đối tượng dbContext từ bên ngoài
        public AuthService(AppDbContext dbContext)
        {
            this.dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<TaiKhoan> LoginAsync(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                return null;
            }

            // Tìm kiếm user trong cơ sở dữ liệu (sử dụng StringComparison.OrdinalIgnoreCase)
            var user = await dbContext.TaiKhoan
                .FirstOrDefaultAsync(u => u.IDTaiKhoan.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase));

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
