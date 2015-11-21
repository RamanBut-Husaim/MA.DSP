using DSP.Core.Characteristics;
using DSP.Reading;
using DSP.Utils;

namespace DSP.Services
{
    public sealed class SignalProcessorServiceFactory : ISignalProcessorServiceFactory
    {
        private readonly IFileParserManager _fileParserManager;
        private readonly ICharacteristicManagerFactory _characteristicManagerFactory;

        public SignalProcessorServiceFactory(IFileParserManager fileParserManager, ICharacteristicManagerFactory characteristicManagerFactory)
        {
            _fileParserManager = fileParserManager;
            _characteristicManagerFactory = characteristicManagerFactory;
        }

        public ISignalProcessorService Create(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));

            var signalProcessorService = new SignalProcessorService(fileName, _fileParserManager, _characteristicManagerFactory);

            var logginsSignalProcessorService = new LoggingSignalProcessorService(signalProcessorService);

            return logginsSignalProcessorService;
        }
    }
}
