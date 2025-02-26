using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class NhomLamViec
{
    public int IdnhomLamViec { get; set; }

    public string? CodeNhom { get; set; }

    public int? SoThanhVien { get; set; }

    public int? IdnguoiQuanLy { get; set; }

    public string? TenNhom { get; set; }

    public virtual ICollection<DuAn> DuAns { get; set; } = new List<DuAn>();

    public virtual TruongNhom? IdnguoiQuanLyNavigation { get; set; }

    public virtual ICollection<NhanVien> NhanViens { get; set; } = new List<NhanVien>();
}
