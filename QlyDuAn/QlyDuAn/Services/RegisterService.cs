using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QlyDuAn.Models;
using QlyDuAn.Request;

namespace QlyDuAn.Services
{
	public class RegisterService
	{
		private readonly QlyDuAnContext dbContext;

		// Constructor nhận đối tượng dbContext từ bên ngoài
		public RegisterService(QlyDuAnContext dbContext)
		{
			this.dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
		}
		public async Task<bool> Register (RegisterRequest registerRequest) 
		{
			// các tiến trình thành công thì lưu vào db. Nếu không thì rollback
			using var transaction = await dbContext.Database.BeginTransactionAsync();
			try
			{
				var taikhoan = new TaiKhoan
				{
					QuyenTaiKhoan = registerRequest.QuyenTaiKhoan,
					MatKhau = registerRequest.MatKhau,
				};
				dbContext.TaiKhoans.Add(taikhoan);
				await dbContext.SaveChangesAsync();
				if (registerRequest.QuyenTaiKhoan == "NhanVien")
				{
					var nhanvien = new NhanVien
					{
						HoTenNhanVien = registerRequest.HoTen,
						GioiTinh = registerRequest.GioiTinh,
						NgaySinh = registerRequest.NgaySinh,
						Sdt = registerRequest.Sdt,
						Email = registerRequest.Email,
						IdtaiKhoan = taikhoan.IdtaiKhoan
					};
					dbContext.NhanViens.Add(nhanvien);
				}
				else if (registerRequest.QuyenTaiKhoan == "TruongNhom")
				{
					var truongnhom = new TruongNhom
					{
						HoTenTruongNhom = registerRequest.HoTen,
						GioiTinh = registerRequest.GioiTinh,
						NgaySinh = registerRequest.NgaySinh,
						Sdt = registerRequest.Sdt,
						Email = registerRequest.Email,
						IdtaiKhoan = taikhoan.IdtaiKhoan
					};
					dbContext.TruongNhoms.Add(truongnhom);
				}
				else if (registerRequest.QuyenTaiKhoan == "Admin")
				{
					var admin = new Admin
					{
						HoTenAdmin = registerRequest.HoTen,
						GioiTinh = registerRequest.GioiTinh,
						NgaySinh = registerRequest.NgaySinh,
						Sdt = registerRequest.Sdt,
						Email = registerRequest.Email,
						IdtaiKhoan = taikhoan.IdtaiKhoan
					};
					dbContext.Admins.Add(admin);
				}
				await dbContext.SaveChangesAsync();
				await transaction.CommitAsync();
				return true;
			}
			catch
			{
				await transaction.RollbackAsync();
				throw;
			}
		}
	}
}
