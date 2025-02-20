using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class TaiLieu
{
    public string IdtaiLieu { get; set; } = null!;

    public string? TenTaiLieu { get; set; }

    public string? IdduAn { get; set; }

    public DateOnly? NgayTaiLen { get; set; }

    public virtual DuAn? IdduAnNavigation { get; set; }
}
