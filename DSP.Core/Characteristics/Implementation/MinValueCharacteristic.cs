using DSP.Core.Signal;

namespace DSP.Core.Characteristics.Implementation
{
    internal sealed class MinValueCharacteristic : CharacteristicBase<double>
    {
        public MinValueCharacteristic(SignalData signalData) : base(signalData)
        {
        }

        protected override double CalculateInternal(int startPoint, int endPoint)
        {
            double minValue = double.MaxValue;

            if (this.SignalData.Values.Count == 0)
            {
                return double.NegativeInfinity;
            }

            for (int i = startPoint; i < endPoint; ++i)
            {
                if (minValue > this.SignalData.Values[i])
                {
                    minValue = this.SignalData.Values[i];
                }
            }

            return minValue;
        }
    }
}
