using QlyDuAn.Models;
using System.Linq;

namespace QlyDuAn.Services
{
	public class DashboardService
	{
		private readonly QlyDuAnContext _context;

		public DashboardService(QlyDuAnContext context)
		{
			_context = context;
		}

		public int NhanVienCount()
		{
			return _context.NhanViens.Count();
		}

		public int DuAnCount()
		{
			return _context.DuAns.Count();
		}

		public int TruongNhomCount()
		{
			return _context.TruongNhoms.Count();
		}
		public int NhomCount()
		{
			return _context.NhomLamViecs.Count();
		}
	}
}