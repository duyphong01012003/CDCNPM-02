using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class NhanVien
{
    public int IdnhanVien { get; set; }

    public string? HoTenNhanVien { get; set; }

    public string? GioiTinh { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string Sdt { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int? Idadmin { get; set; }

    public int? IdnhomLamViec { get; set; }

    public int? IdnguoiQuanLy { get; set; }

    public int? IdtaiKhoan { get; set; }

    public virtual Admin? IdadminNavigation { get; set; }

    public virtual TruongNhom? IdnguoiQuanLyNavigation { get; set; }

    public virtual NhomLamViec? IdnhomLamViecNavigation { get; set; }

    public virtual TaiKhoan? IdtaiKhoanNavigation { get; set; }

    public virtual ICollection<TaskCon> TaskCons { get; set; } = new List<TaskCon>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
