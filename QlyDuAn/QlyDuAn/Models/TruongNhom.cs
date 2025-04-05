using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class TruongNhom
{
    public int IdtruongNhom { get; set; }

    public string? HoTenTruongNhom { get; set; }

    public string? GioiTinh { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string Sdt { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int? Idadmin { get; set; }

    public int? IdtaiKhoan { get; set; }

    public virtual ICollection<DuAn> DuAns { get; set; } = new List<DuAn>();

    public virtual Admin? IdadminNavigation { get; set; }

    public virtual TaiKhoan? IdtaiKhoanNavigation { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();

    public virtual ICollection<NhomLamViec> NhomLamViecs { get; set; } = new List<NhomLamViec>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
