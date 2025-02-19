using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class TaskCon
{
    public int IdtaskCon { get; set; }

    public string? IdtaskCha { get; set; }

    public string? TenTaskCon { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateOnly? NgayTao { get; set; }

    public int? Deadline { get; set; }

    public string? IdnguoiTaoTask { get; set; }

    public virtual NhanVien? IdnguoiTaoTaskNavigation { get; set; }

    public virtual Task? IdtaskChaNavigation { get; set; }
}
