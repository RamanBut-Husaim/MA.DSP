using System;
using System.Linq.Expressions;
using DSP.Core.Signal;

namespace DSP.Core.Characteristics
{
    public interface ICharacteristicManager
    {
        ICharacteristic<T> Characteristic<T>(Expression<Func<CharacteristicSelector, ICharacteristic<T>>> selector);

        CharacteristicsResult Calculate(int startPoint, int endPoint);

        SignalData SignalData { get; }
    }
}
