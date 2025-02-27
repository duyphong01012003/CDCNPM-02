namespace QlyDuAn.Request
{
	public class RegisterRequest
	{
		public string QuyenTaiKhoan { get; set; } = null!;  // Nhân viên, Admin, Trưởng nhóm
		public string MatKhau { get; set; } = "12345678";

		// Thông tin nhập từ form
		public string HoTen { get; set; } = null!;
		public string Sdt { get; set; } = null!;
		public DateOnly? NgaySinh { get; set; }
		public string GioiTinh { get; set; } = null!;
		public string Email { get; set; } = null!;
	}
}
