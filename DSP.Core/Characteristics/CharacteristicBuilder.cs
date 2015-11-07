using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using DSP.Core.Characteristics.Implementation;
using DSP.Core.Signal;

namespace DSP.Core.Characteristics
{
    public sealed class CharacteristicBuilder : ICharacteristicBuilder
    {
        public static readonly IDictionary<string, Func<SignalData, ICharacteristicBase>> Characteristics;

        static CharacteristicBuilder()
        {
            Characteristics = new Dictionary<string, Func<SignalData, ICharacteristicBase>>
            {
                {GetPropertyName(p => p.MinValue), (signalData) => new MinValueCharacteristic(signalData)},
                {GetPropertyName(p => p.MaxValue), (signalData) => new MaxValueCharacteristic(signalData)},
                {GetPropertyName(p => p.PeakFactor), (signalData) => new PeakFactorCharacteristic(signalData)},
                {GetPropertyName(p => p.PeekToPeek), (signalData) => new PeekToPeekValueCharacteristic(signalData)},
                {GetPropertyName(p => p.StandardDeviation), (signalData) => new StandardDeviationCharacteristic(signalData)}
            };
        }

        private static string GetPropertyName<T>(Expression<Func<CharacteristicSelector, T>> selector)
        {
            return (selector.Body as MemberExpression).Member.Name;
        }

        public Func<SignalData, ICharacteristicBase> Builder<T>(Expression<Func<CharacteristicSelector, ICharacteristic<T>>> characteristic)
        {
            return Characteristics[GetPropertyName(characteristic)];
        }
    }
}
