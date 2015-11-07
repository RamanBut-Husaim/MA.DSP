using System.Web.Mvc;

namespace DSP.Web.Controllers
{
    [Route("{action=index}")]
    public sealed class HomeController : Controller
    {
        [Route]
        public ActionResult Index()
        {
            return View();
        }
    }
}