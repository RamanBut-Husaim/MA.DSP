using System.Collections.Generic;
using System.Linq;
using DSP.Services;

namespace DSP.Web.Models.File
{
    public sealed class SignalViewModelBuilder
    {
        public static SignalViewModel Create(SignalInfo signalInfo, string fileName)
        {
            return new SignalViewModel
            {
                Characteristics = new SignalCharacteristicsViewModel(signalInfo.Characteristics),
                FileName = fileName,
                SignalMetadata = new SignalMetadataViewModel(signalInfo.SignalData.Metadata),
                Points = new List<SignalDataPoint>(signalInfo.SignalData.Values.Select((p, counter) => new SignalDataPoint(counter.ToString(), p)).ToList())
            };
        }
    }
}
