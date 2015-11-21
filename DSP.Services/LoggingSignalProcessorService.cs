using System.Threading.Tasks;
using NLog;

namespace DSP.Services
{
    public sealed class LoggingSignalProcessorService: ISignalProcessorService
    {
        private static readonly ILogger Logger = LogManager.GetCurrentClassLogger();

        private readonly ISignalProcessorService _signalProcessorService;

        public LoggingSignalProcessorService(ISignalProcessorService signalProcessorService)
        {
            _signalProcessorService = signalProcessorService;
        }

        public string FileName => _signalProcessorService.FileName;

        public async Task<SignalInfo> ProcessFileAsync(int startPoint, int endPoint)
        {
            Logger.Trace("Start file processing {0} for points ({1}; {2})", this.FileName, startPoint, endPoint);

            SignalInfo signalInfo = await _signalProcessorService.ProcessFileAsync(startPoint, endPoint);

            Logger.Trace("End file processing {0} for points ({1}; {2})", this.FileName, startPoint, endPoint);

            return signalInfo;
        }

        public async Task<SignalInfo> ProcessFileAsync()
        {
            Logger.Trace("Start file processing {0}", this.FileName);

            SignalInfo signalInfo = await _signalProcessorService.ProcessFileAsync();

            Logger.Trace("End file processing {0}", this.FileName);

            return signalInfo;
        }
    }
}
