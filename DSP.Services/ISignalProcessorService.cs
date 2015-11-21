using System.Threading.Tasks;

namespace DSP.Services
{
    public interface ISignalProcessorService : IService
    {
        string FileName { get; }

        Task<SignalInfo> ProcessFileAsync(int startPoint, int endPoint);

        Task<SignalInfo> ProcessFileAsync();
    }
}
