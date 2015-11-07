using DSP.Core.Signal;
using DSP.Utils;

namespace DSP.Core.Characteristics
{
    public sealed class CharacteristicManagerFactory : ICharacteristicManagerFactory
    {
        private readonly ICharacteristicBuilder _characteristicBuilder;

        public CharacteristicManagerFactory(ICharacteristicBuilder characteristicBuilder)
        {
            Throw.IfNull(characteristicBuilder, nameof(characteristicBuilder));

            _characteristicBuilder = characteristicBuilder;
        }

        public ICharacteristicManager Create(SignalData signalData)
        {
            Throw.IfNull(signalData, nameof(signalData));

            return new CharacteristicManager(_characteristicBuilder, signalData);
        }
    }
}
