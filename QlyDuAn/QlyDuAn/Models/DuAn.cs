using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class DuAn
{
    public int IdduAn { get; set; }

    public string? CodeDuAn { get; set; }

    public string? TenDuAn { get; set; }

    public DateOnly? NgayBatDau { get; set; }

    public DateOnly? NgayKetThuc { get; set; }

    public string? MoTaDuAn { get; set; }

    public int? IdnguoiQuanLy { get; set; }

    public int? IdnhomLamViec { get; set; }

    public virtual TruongNhom? IdnguoiQuanLyNavigation { get; set; }

    public virtual NhomLamViec? IdnhomLamViecNavigation { get; set; }

    public virtual ICollection<TaiLieu> TaiLieus { get; set; } = new List<TaiLieu>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
