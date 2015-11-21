using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using NLog;

namespace DSP.Web.Controllers
{
    [RoutePrefix("File")]
    public sealed class FileController : Controller
    {
        private static readonly ILogger Logger = LogManager.GetCurrentClassLogger();

        [Route("Upload")]
        public async Task<ActionResult> Upload()
        {
            if (this.Request.Files.Count > 0)
            {
                HttpPostedFileBase file = this.Request.Files[0];

                try
                {
                    this.SaveFile(file);
                }
                catch (Exception ex)
                {
                    Logger.Error(ex);
                    return this.Json(new {Message = "The file upload procedure has failed. Please, try again later.", Success = false});
                }

                string message = $"The file {file.FileName} has been uploaded successfully.";
                Logger.Info(message);
                return this.Json(new { Message = message, Success = true, File = file.FileName });
            }

            return this.Json(new {Message = "There is no file to upload.", Success = false});
        }

        private void SaveFile(HttpPostedFileBase file)
        {
            string directoryPath = this.Server.MapPath("~/Content/Upload");
            string fullPath = Path.Combine(directoryPath, file.FileName);
            file.SaveAs(fullPath);
        }
    }
}
