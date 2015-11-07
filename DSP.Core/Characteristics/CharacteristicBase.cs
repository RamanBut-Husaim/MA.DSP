using System;
using DSP.Core.Signal;
using DSP.Utils;

namespace DSP.Core.Characteristics
{
    internal abstract class CharacteristicBase<T> : ICharacteristic<T>
    {
        protected CharacteristicBase(SignalData signalData)
        {
            Throw.IfNull(signalData, nameof(signalData));
            this.SignalData = signalData;
        }
        
        protected SignalData SignalData { get; }

        public T Calculate(int startPoint, int endPoint)
        {
            int actualStartPoint = Math.Min(startPoint, endPoint);
            int actualEndPoint = Math.Max(startPoint, endPoint);
            actualStartPoint = Math.Max(0, actualStartPoint);
            actualEndPoint = Math.Max(0, actualEndPoint);
            actualEndPoint = Math.Min(actualEndPoint, this.SignalData.Values.Count);

            return this.CalculateInternal(actualStartPoint, actualEndPoint);
        }

        protected abstract T CalculateInternal(int startPoint, int endPoint);
    }
}
