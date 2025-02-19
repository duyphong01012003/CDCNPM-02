using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class TruongNhom
{
    public string IdtruongNhom { get; set; } = null!;

    public string? HoTenTruongNhom { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public int Sdt { get; set; }

    public string Email { get; set; } = null!;

    public string? Idadmin { get; set; }

    public string? IdtaiKhoan { get; set; }

    public virtual ICollection<DuAn> DuAns { get; set; } = new List<DuAn>();

    public virtual Admin? IdadminNavigation { get; set; }

    public virtual TaiKhoan? IdtaiKhoanNavigation { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();

    public virtual ICollection<NhomLamViec> NhomLamViecs { get; set; } = new List<NhomLamViec>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
