using System;
using System.IO;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.SessionState;
using DSP.Services;
using DSP.Web.Models;
using DSP.Web.Models.Signal;
using NLog;

namespace DSP.Web.Controllers
{
    [RoutePrefix("Dsp")]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public sealed class DspController : Controller
    {
        private static readonly ILogger Logger = LogManager.GetCurrentClassLogger();

        private readonly ISignalProcessorServiceFactory _signalProcessorServiceFactory;

        public DspController(ISignalProcessorServiceFactory signalProcessorServiceFactory)
        {
            _signalProcessorServiceFactory = signalProcessorServiceFactory;
        }

        [HttpPost]
        [Route("Process")]
        public async Task<JsonResult> ProcessFile(string fileName)
        {
            var signalsViewModel = new SignalsViewModel();
            if (!string.IsNullOrEmpty(fileName))
            {
                string[] fileNames = fileName.Split(new[] {';'}, StringSplitOptions.RemoveEmptyEntries);
                foreach (string file in fileNames)
                {
                    try
                    {
                        var signalViewModel = await this.ProcessSignal(file);
                        signalsViewModel.Signals.Add(signalViewModel);
                        Logger.Info("The file {0} has been processed successfully.", file);
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex);
                        signalsViewModel.Errors.Add(new ErrorModel
                        {
                            FileName = file,
                            Message = $"Error occured while processing the file {file}. Please, try again later."
                        });
                    }
                }
            }

            return this.Json(signalsViewModel);
        }

        private async Task<SignalViewModel> ProcessSignal(string fileName)
        {
            string fullPath = this.GetFileFullPath(fileName);

            ISignalProcessorService signalProcessor = _signalProcessorServiceFactory.Create(fullPath);
            SignalInfo signalInfo = await signalProcessor.ProcessFileAsync();
            SignalViewModel signalViewModel = SignalViewModelBuilder.Create(signalInfo, fileName);

            return signalViewModel;
        }

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = int.MaxValue
            };
        }

        private string GetFileFullPath(string fileName)
        {
            string directoryPath = this.Server.MapPath("~/Content/Upload");
            string fullPath = Path.Combine(directoryPath, fileName);
            return fullPath;
        }
    }
}
