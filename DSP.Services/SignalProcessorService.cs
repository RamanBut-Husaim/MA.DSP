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
        private readonly IFileParserManager _fileParserManager;
        private readonly ICharacteristicManagerFactory _characteristicManagerFactory;
        private ICharacteristicManager _characteristicManager;

        public SignalProcessorService(
            string fileName,
            IFileParserManager fileParserManager,
            ICharacteristicManagerFactory characteristicManagerFactory)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));
            Throw.IfNull(fileParserManager, nameof(fileParserManager));
            Throw.IfNull(characteristicManagerFactory, nameof(characteristicManagerFactory));

            _fileName = fileName;
            _fileParserManager = fileParserManager;
            _characteristicManagerFactory = characteristicManagerFactory;
        }

        public string FileName => _fileName;

        public async Task<SignalInfo> ProcessFileAsync(int startPoint, int endPoint)
        {
            await this.EnsureCharacteristicManagerCreated();

            CharacteristicsResult characteristics = _characteristicManager.Calculate(startPoint, endPoint);

            return new SignalInfo(_characteristicManager.SignalData, characteristics);
        }

        public async Task<SignalInfo> ProcessFileAsync()
        {
            await this.EnsureCharacteristicManagerCreated();

            int startPoint = 0;
            int endPoint = _characteristicManager.SignalData.Values.Count;

            return await this.ProcessFileAsync(startPoint, endPoint);
        }

        private async Task EnsureCharacteristicManagerCreated()
        {
            if (_characteristicManager == null)
            {
                _characteristicManager = await this.CreateCharacteristicManager();
            }
        }

        private async Task<ICharacteristicManager> CreateCharacteristicManager()
        {
            FileParserResult fileParserResult = await _fileParserManager.ParseFileAsync(_fileName);

            SignalData signalData = SignalDataMapper.Map(fileParserResult);

            return _characteristicManagerFactory.Create(signalData);
        }
    }
}
