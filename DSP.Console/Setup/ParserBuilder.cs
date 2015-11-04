using Fclp;

namespace DSP.Console.Setup
{
    public sealed class ParserBuilder
    {
        public static FluentCommandLineParser<Arguments> Build()
        {
            var parser = new FluentCommandLineParser<Arguments>();

            parser.Setup(p => p.Path)
                .As('p', "path")
                .Required()
                .WithDescription("The path to the data file.");

            parser.SetupHelp("?", "help")
                .Callback(text => System.Console.WriteLine("Please, specify the path to the data file."));

            return parser;
        }
    }
}
