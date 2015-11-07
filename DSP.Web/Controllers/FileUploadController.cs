using System.Web.Mvc;

namespace DSP.Web.Controllers
{
    [RoutePrefix("FileUpload")]
    public sealed class FileUploadController : Controller
    {
        [Route("Upload")]
        public ActionResult Upload()
        {
            if (this.Request.Files.Count > 0)
            {

            }

            return this.Json(new {Success = "Success"});
        }
    }
}
