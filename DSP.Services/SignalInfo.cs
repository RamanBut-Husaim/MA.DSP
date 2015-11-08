using DSP.Core.Characteristics;
using DSP.Core.Signal;
using DSP.Utils;

namespace DSP.Services
{
    public sealed class SignalInfo
    {
        public SignalInfo(SignalData signalData, CharacteristicsResult characteristics)
        {
            Throw.IfNull(signalData, nameof(signalData));
            Throw.IfNull(characteristics, nameof(characteristics));

            this.SignalData = signalData;
            this.Characteristics = characteristics;
        }

        public SignalData SignalData { get; }

        public CharacteristicsResult Characteristics { get; }
    }
}
