using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class Admin
{
    public string Idadmin { get; set; } = null!;

    public string? HoTenAdmin { get; set; }

    public string? GioiTinh { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public int Sdt { get; set; }

    public string Email { get; set; } = null!;

    public string? IdtaiKhoan { get; set; }

    public virtual TaiKhoan? IdtaiKhoanNavigation { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();

    public virtual ICollection<TruongNhom> TruongNhoms { get; set; } = new List<TruongNhom>();
}
