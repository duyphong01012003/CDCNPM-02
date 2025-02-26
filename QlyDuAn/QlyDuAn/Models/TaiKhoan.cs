using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class TaiKhoan
{
    public int IdtaiKhoan { get; set; }

    public string? CodeTaiKhoan { get; set; }

    public string? QuyenTaiKhoan { get; set; }

    public string? MatKhau { get; set; } = null!;

    public virtual ICollection<Admin> Admins { get; set; } = new List<Admin>();

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();

    public virtual ICollection<TruongNhom> TruongNhoms { get; set; } = new List<TruongNhom>();
}
