using System;
using System.Collections.Generic;

namespace QlyDuAn.Models;

public partial class TaiLieu
{
    public int IdtaiLieu { get; set; }

    public string? CodeTaiLieu { get; set; }

    public string? TenTaiLieu { get; set; }

    public int? IdduAn { get; set; }

    public DateOnly? NgayTaiLen { get; set; }

    public virtual DuAn? IdduAnNavigation { get; set; }
}
