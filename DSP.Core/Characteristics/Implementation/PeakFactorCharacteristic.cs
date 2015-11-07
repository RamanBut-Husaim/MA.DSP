using System;
using DSP.Core.Signal;

namespace DSP.Core.Characteristics.Implementation
{
    internal sealed class PeakFactorCharacteristic : CharacteristicBase<double>
    {
        private readonly ICharacteristic<double> _maxValueCharacteristic;
        private readonly ICharacteristic<double> _minValueCharacteristic;
        private readonly ICharacteristic<double> _standardDeviationCharacteristic; 

        public PeakFactorCharacteristic(SignalData signalData) : base(signalData)
        {
            _maxValueCharacteristic = new MaxValueCharacteristic(this.SignalData);
            _minValueCharacteristic = new MinValueCharacteristic(this.SignalData);
            _standardDeviationCharacteristic = new StandardDeviationCharacteristic(this.SignalData);
        }

        protected override double CalculateInternal(int startPoint, int endPoint)
        {
            double maxValue = _maxValueCharacteristic.Calculate(startPoint, endPoint);
            double minValue = _minValueCharacteristic.Calculate(startPoint, endPoint);
            double standardDeviation = _standardDeviationCharacteristic.Calculate(startPoint, endPoint);

            double peakFactor = Math.Max(Math.Abs(maxValue), Math.Abs(minValue)) / standardDeviation;

            return peakFactor;
        }
    }
}
