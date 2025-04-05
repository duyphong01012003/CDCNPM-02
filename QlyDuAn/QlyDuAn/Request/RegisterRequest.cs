namespace QlyDuAn.Request
{
	public class RegisterRequest
	{
		public string QuyenTaiKhoan { get; set; } = null!;  // Nhân viên, Admin, Trưởng nhóm
		public string MatKhau { get; set; } = "12345678";

		public string HoTen { get; set; } = null!;
		public string Sdt { get; set; } = null!;
		public int? Status { get; set; } = 0;
		public DateOnly? NgaySinh { get; set; }
		public string GioiTinh { get; set; } = null!;
		public string Email { get; set; } = null!;

		public int? IdnguoiQuanLy { get; set; }
		public int? IdnhomLamViec { get; set; }
	}
}
