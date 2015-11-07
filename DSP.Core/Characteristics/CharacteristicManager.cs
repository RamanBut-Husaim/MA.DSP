using System;
using System.Linq.Expressions;
using DSP.Core.Signal;
using DSP.Utils;

namespace DSP.Core.Characteristics
{
    public sealed class CharacteristicManager : ICharacteristicManager
    {
        private readonly SignalData _signalData;
        private readonly ICharacteristicBuilder _characteristicBuilder;

        public CharacteristicManager(ICharacteristicBuilder characteristicBuilder, SignalData signalData)
        {
            Throw.IfNull(signalData, nameof(signalData));
            Throw.IfNull(signalData, nameof(characteristicBuilder));

            _signalData = signalData;
            _characteristicBuilder = characteristicBuilder;
        }

        public ICharacteristic<T> Characteristic<T>(Expression<Func<CharacteristicSelector, ICharacteristic<T>>> selector)
        {
            Throw.IfNull(selector, nameof(selector));

            return _characteristicBuilder.Builder(selector).Invoke(_signalData) as ICharacteristic<T>;
        }

        public CharacteristicsResult Calculate(int startPoint, int endPoint)
        {
            var characteristicsResult = new CharacteristicsResult
            {
                MaxValue = this.Characteristic(p => p.MaxValue).Calculate(startPoint, endPoint),
                MinValue = this.Characteristic(p => p.MinValue).Calculate(startPoint, endPoint),
                PeakFactor = this.Characteristic(p => p.PeakFactor).Calculate(startPoint, endPoint),
                PeekToPeek = this.Characteristic(p => p.PeekToPeek).Calculate(startPoint, endPoint),
                StandardDeviation = this.Characteristic(p => p.StandardDeviation).Calculate(startPoint, endPoint)
            };

            return characteristicsResult;
        }
    }
}
