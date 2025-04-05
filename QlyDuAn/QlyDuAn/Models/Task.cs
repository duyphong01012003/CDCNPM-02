using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class Task
{
    public int Idtask { get; set; }

    public string? CodeTank { get; set; }

    public string? TenTask { get; set; }

    public DateOnly? NgayGiaoTask { get; set; }

    public DateOnly? NgayKetThucTask { get; set; }

	public string? TrangThai { get; set; } = "Đã tạo";

	public int? IdnguoiTaoTask { get; set; }

    public int? IdnhanVienNhanTask { get; set; }

    public DateOnly? Deadline { get; set; }

    public int? IdduAn { get; set; }

    public string? MoTaCongViec { get; set; }

    public virtual DuAn? IdduAnNavigation { get; set; }

    public virtual TruongNhom? IdnguoiTaoTaskNavigation { get; set; }

    public virtual NhanVien? IdnhanVienNhanTaskNavigation { get; set; }

    public virtual ICollection<TaskCon> TaskCons { get; set; } = new List<TaskCon>();
}
