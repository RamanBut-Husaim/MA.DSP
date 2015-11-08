using DSP.Core.Characteristics;
using DSP.Reading;
using DSP.Reading.Content;
using DSP.Services;
using LightInject;

namespace DSP.Web.App_Start
{
    public sealed class CompositionRoot : ICompositionRoot
    {
        public void Compose(IServiceRegistry serviceRegistry)
        {
            serviceRegistry.Register<IFileContentProviderFactory, FileContentProviderFactory>(new PerContainerLifetime());
            serviceRegistry.Register<IFileParser, FileParser>(new PerRequestLifeTime());
            serviceRegistry.Register<ICharacteristicBuilder, CharacteristicBuilder>(new PerContainerLifetime());
            serviceRegistry.Register<ICharacteristicManagerFactory, CharacteristicManagerFactory>();
            serviceRegistry.Register<ISignalProcessorServiceFactory, SignalProcessorServiceFactory>(new PerRequestLifeTime());
        }
    }
}
