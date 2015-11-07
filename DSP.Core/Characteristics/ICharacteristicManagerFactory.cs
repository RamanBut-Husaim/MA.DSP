using DSP.Core.Signal;

namespace DSP.Core.Characteristics
{
    public interface ICharacteristicManagerFactory
    {
        ICharacteristicManager Create(SignalData signalData);
    }
}
