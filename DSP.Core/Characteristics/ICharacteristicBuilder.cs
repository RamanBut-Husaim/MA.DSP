using System;
using System.Linq.Expressions;
using DSP.Core.Signal;

namespace DSP.Core.Characteristics
{
    public interface ICharacteristicBuilder
    {
        Func<SignalData, ICharacteristicBase> Builder<T>(Expression<Func<CharacteristicSelector, ICharacteristic<T>>> characteristic);
    }
}
