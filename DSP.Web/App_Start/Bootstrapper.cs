using LightInject;

namespace DSP.Web.App_Start
{
    public sealed class Bootstrapper
    {
        public static void Register()
        {
            var container = new ServiceContainer();

            container.RegisterFrom<CompositionRoot>();

            container.RegisterControllers();

            container.EnableMvc();
        }
    }
}
