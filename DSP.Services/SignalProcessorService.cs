using System.Threading.Tasks;
using DSP.Core.Characteristics;
using DSP.Core.Signal;
using DSP.Reading;
using DSP.Utils;

namespace DSP.Services
{
    public sealed class SignalProcessorService : ISignalProcessorService
    {
        private readonly string _fileName;
        private readonly IFileParser _fileParser;
        private readonly ICharacteristicManagerFactory _characteristicManagerFactory;
        private ICharacteristicManager _characteristicManager;

        public SignalProcessorService(
            string fileName,
            IFileParser fileParser,
            ICharacteristicManagerFactory characteristicManagerFactory)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));
            Throw.IfNull(fileParser, nameof(fileParser));
            Throw.IfNull(characteristicManagerFactory, nameof(characteristicManagerFactory));

            _fileName = fileName;
            _fileParser = fileParser;
            _characteristicManagerFactory = characteristicManagerFactory;
        }

        public async Task<SignalInfo> ProcessFileAsync(int startPoint, int endPoint)
        {
            await this.VerifyCharacteristicManagerCreated();

            CharacteristicsResult characteristics = _characteristicManager.Calculate(startPoint, endPoint);

            return new SignalInfo(_characteristicManager.SignalData, characteristics);
        }

        public async Task<SignalInfo> ProcessFileAsync()
        {
            await this.VerifyCharacteristicManagerCreated();

            int startPoint = 0;
            int endPoint = _characteristicManager.SignalData.Values.Count;

            return await this.ProcessFileAsync(startPoint, endPoint);
        }

        private async Task VerifyCharacteristicManagerCreated()
        {
            if (_characteristicManager == null)
            {
                _characteristicManager = await this.CreateCharacteristicManager();
            }
        }

        private async Task<ICharacteristicManager> CreateCharacteristicManager()
        {
            FileParserResult fileParserResult = await _fileParser.ParseFileAsync(_fileName);
            SignalData signalData = SignalDataMapper.Map(fileParserResult);
            return _characteristicManagerFactory.Create(signalData);
        }
    }
}
