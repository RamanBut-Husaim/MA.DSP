namespace DSP.Core.Characteristics
{
    public sealed class CharacteristicsResult
    {
        public double MaxValue { get; internal set; }
        public double MinValue { get; internal set; }
        public double PeakFactor { get; internal set; }
        public double PeekToPeek { get; internal set; }
        public double StandardDeviation { get; internal set; }
    }
}
