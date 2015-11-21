namespace DSP.Web.Models.Signal
{
    public sealed class SignalDataPoint
    {
        public SignalDataPoint(string xValue, double? yValue)
        {
            this.X = xValue;
            this.Y = yValue;
        }

        public SignalDataPoint()
        {
        }

        public string X { get; set; }

        public double? Y { get; set; }
    }
}
