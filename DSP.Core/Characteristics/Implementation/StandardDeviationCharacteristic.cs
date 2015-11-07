using System;
using DSP.Core.Signal;

namespace DSP.Core.Characteristics.Implementation
{
    internal sealed class StandardDeviationCharacteristic : CharacteristicBase<double>
    {
        public StandardDeviationCharacteristic(SignalData signalData) : base(signalData)
        {
        }

        protected override double CalculateInternal(int startPoint, int endPoint)
        {
            int pointNumber = endPoint - startPoint;

            double sum = 0;
            for (int i = startPoint; i < endPoint; ++i)
            {
                sum += (this.SignalData.Values[i] * 2);
            }

            sum = sum / pointNumber;

            return Math.Sqrt(sum);
        }
    }
}
