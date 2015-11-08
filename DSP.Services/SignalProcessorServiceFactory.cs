using DSP.Core.Characteristics;
using DSP.Reading;
using DSP.Utils;

namespace DSP.Services
{
    public sealed class SignalProcessorServiceFactory : ISignalProcessorServiceFactory
    {
        private readonly IFileParser _fileParser;
        private readonly ICharacteristicManagerFactory _characteristicManagerFactory;

        public SignalProcessorServiceFactory(IFileParser fileParser, ICharacteristicManagerFactory characteristicManagerFactory)
        {
            _fileParser = fileParser;
            _characteristicManagerFactory = characteristicManagerFactory;
        }

        public ISignalProcessorService Create(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));

            return new SignalProcessorService(fileName, _fileParser, _characteristicManagerFactory);
        }
    }
}
