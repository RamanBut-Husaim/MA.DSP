namespace DSP.Services
{
    public interface ISignalProcessorServiceFactory
    {
        ISignalProcessorService Create(string fileName);
    }
}
