using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class Task
{
    public string Idtask { get; set; } = null!;

    public string? TenTask { get; set; }

    public DateOnly? NgayGiaoTask { get; set; }

    public DateOnly? NgayKetThucTask { get; set; }

    public string? TrangThai { get; set; }

    public string? IdnguoiTaoTask { get; set; }

    public string? IdnhanVienNhanTask { get; set; }

    public DateOnly? Deadline { get; set; }

    public string? IdduAn { get; set; }

    public virtual DuAn? IdduAnNavigation { get; set; }

    public virtual TruongNhom? IdnguoiTaoTaskNavigation { get; set; }

    public virtual NhanVien? IdnhanVienNhanTaskNavigation { get; set; }

    public virtual ICollection<TaskCon> TaskCons { get; set; } = new List<TaskCon>();
}
