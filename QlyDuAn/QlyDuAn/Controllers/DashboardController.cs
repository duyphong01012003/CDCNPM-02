using Microsoft.AspNetCore.Mvc;
using QlyDuAn.Services;

namespace QlyDuAn.Controllers
{
    public class DashboardController : Controller
    {
        private readonly DatabaseService _databaseService;

        public DashboardController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public IActionResult TotalCountNhanVien()
        {
            var totalNhanVien = _databaseService.GetTotalCountNhanVien();
            return View(totalNhanVien);
        }

        public IActionResult TotalCountDuAn()
        {
            var totalNhanVien = _databaseService.GetTotalCountDuAn();
            return View(totalNhanVien);
        }

        public IActionResult TotalCountNhom()
        {
            var totalNhanVien = _databaseService.GetTotalCountNhom();
            return View(totalNhanVien);
        }
        public IActionResult TotalCountTruongNhom()
        {
            var totalNhanVien = _databaseService.GetTotalCountTruongNhom();
            return View(totalNhanVien);
        }
    }
}
