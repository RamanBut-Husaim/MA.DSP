using DSP.Core.Characteristics;

namespace DSP.Web.Models.Signal
{
    public sealed class SignalCharacteristicsViewModel
    {
        public SignalCharacteristicsViewModel()
        {
        }

        public SignalCharacteristicsViewModel(CharacteristicsResult characteristics)
        {
            this.MaxValue = characteristics.MaxValue;
            this.MinValue = characteristics.MinValue;
            this.PeakFactor = characteristics.PeakFactor;
            this.PeekToPeek = characteristics.PeekToPeek;
            this.StandardDeviation = characteristics.StandardDeviation;
        }

        public double MaxValue { get; set; }
        public double MinValue { get; set; }
        public double PeakFactor { get; set; }
        public double PeekToPeek { get; set; }
        public double StandardDeviation { get; set; }
    }
}
