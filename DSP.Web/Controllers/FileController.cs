using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace DSP.Web.Controllers
{
    [RoutePrefix("File")]
    public sealed class FileController : Controller
    {
        [Route("Upload")]
        public async Task<ActionResult> Upload()
        {
            if (this.Request.Files.Count > 0)
            {
                HttpPostedFileBase file = this.Request.Files[0];
                this.SaveFile(file);

                return this.Json(new {Message = "The file has been uploaded successfully.", File = file.FileName});
            }

            return this.Json(new { Message = "There is no file to upload."});
        }

        private void SaveFile(HttpPostedFileBase file)
        {
            string directoryPath = this.Server.MapPath("~/Content/Upload");
            string fullPath = Path.Combine(directoryPath, file.FileName);
            file.SaveAs(fullPath);
        }
    }
}
