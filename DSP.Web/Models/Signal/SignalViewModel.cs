using System.Collections.Generic;

namespace DSP.Web.Models.Signal
{
    public sealed class SignalViewModel
    {
        public SignalViewModel()
        {
            this.Points = new List<SignalDataPoint>();
        }

        public string FileName { get; set; }

        public SignalMetadataViewModel SignalMetadata { get; set; }

        public SignalCharacteristicsViewModel Characteristics { get; set; }

        public IList<SignalDataPoint> Points { get; set; }
    }
}
