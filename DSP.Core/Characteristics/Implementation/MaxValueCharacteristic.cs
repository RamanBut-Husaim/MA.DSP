using DSP.Core.Signal;

namespace DSP.Core.Characteristics.Implementation
{
    internal sealed class MaxValueCharacteristic : CharacteristicBase<double>
    {
        public MaxValueCharacteristic(SignalData signalData) : base(signalData)
        {
        }

        protected override double CalculateInternal(int startPoint, int endPoint)
        {
            double maxValue = double.MinValue;

            if (this.SignalData.Values.Count == 0)
            {
                return double.PositiveInfinity;
            }

            for (int i = startPoint; i < endPoint; ++i)
            {
                if (maxValue < this.SignalData.Values[i])
                {
                    maxValue = this.SignalData.Values[i];
                }
            }

            return maxValue;
        }
    }
}
