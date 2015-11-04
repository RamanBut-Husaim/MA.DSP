using DSP.Reading;
using DSP.Reading.Content;
using LightInject;

namespace DSP.Console.Setup
{
    public sealed class CompositionRoot : ICompositionRoot
    {
        public void Compose(IServiceRegistry serviceRegistry)
        {
            serviceRegistry.Register<IFileContentProviderFactory, FileContentProviderFactory>(new PerContainerLifetime());
            serviceRegistry.Register<IFileParser, FileParser>();
        }
    }
}
