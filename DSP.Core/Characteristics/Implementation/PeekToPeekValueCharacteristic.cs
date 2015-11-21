using DSP.Core.Signal;

namespace DSP.Core.Characteristics.Implementation
{
    internal sealed class PeekToPeekValueCharacteristic : CharacteristicBase<double>
    {
        private readonly ICharacteristic<double> _maxValueCharacteristic;
        private readonly ICharacteristic<double> _minValueCharacteristic;

        public PeekToPeekValueCharacteristic(SignalData signalData) : base(signalData)
        {
            _maxValueCharacteristic = new MaxValueCharacteristic(this.SignalData);
            _minValueCharacteristic = new MinValueCharacteristic(this.SignalData);
        }

        protected override double CalculateInternal(int startPoint, int endPoint)
        {
            double maxValue = _maxValueCharacteristic.Calculate(startPoint, endPoint);
            double minValue = _minValueCharacteristic.Calculate(startPoint, endPoint);

            return maxValue - minValue;
        }
    }
}
