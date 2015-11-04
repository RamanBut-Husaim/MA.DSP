﻿using DSP.Console.Setup;
using DSP.Reading;
using Fclp;
using LightInject;

namespace DSP.Console
{
    public sealed class Program
    {
        public static void Main(string[] args)
        {
            FluentCommandLineParser<Arguments> parser = ParserBuilder.Build();
            var parserResult = parser.Parse(args);
            if (!parserResult.HasErrors && !parserResult.EmptyArgs)
            {
                Arguments argument = parser.Object;
                var container = new ServiceContainer();
                container.RegisterFrom<CompositionRoot>();
                using (var scope = container.BeginScope())
                {
                    IFileParser fileParser = container.GetInstance<IFileParser>();
                    FileParserResult parseResult = fileParser.ParseFile(argument.Path);
                }
            }
        }
    }
}
