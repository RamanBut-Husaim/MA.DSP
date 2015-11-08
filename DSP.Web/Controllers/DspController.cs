using System.IO;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.SessionState;
using DSP.Services;
using DSP.Web.Models.File;

namespace DSP.Web.Controllers
{
    [RoutePrefix("Dsp")]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public sealed class DspController : Controller
    {
        private readonly ISignalProcessorServiceFactory _signalProcessorServiceFactory;

        public DspController(ISignalProcessorServiceFactory signalProcessorServiceFactory)
        {
            _signalProcessorServiceFactory = signalProcessorServiceFactory;
        }

        [HttpPost]
        [Route("Process")]
        public async Task<JsonResult> ProcessFile(string fileName)
        {
            string fullPath = this.GetFileFullPath(fileName);
            ISignalProcessorService signalProcessor = _signalProcessorServiceFactory.Create(fullPath);
            SignalInfo signalInfo = await signalProcessor.ProcessFileAsync();
            SignalViewModel signalViewModel = SignalViewModelBuilder.Create(signalInfo, fileName);

            //return this.Json(new {Sucess = "one"});

            return this.Json(signalViewModel);
        }

        private string GetFileFullPath(string fileName)
        {
            string directoryPath = this.Server.MapPath("~/Content/Upload");
            string fullPath = Path.Combine(directoryPath, fileName);
            return fullPath;
        }
    }
}
