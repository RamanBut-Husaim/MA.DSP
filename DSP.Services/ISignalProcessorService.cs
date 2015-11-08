using System.Threading.Tasks;

namespace DSP.Services
{
    public interface ISignalProcessorService : IService
    {
        Task<SignalInfo> ProcessFileAsync(int startPoint, int endPoint);

        Task<SignalInfo> ProcessFileAsync();
    }
}
