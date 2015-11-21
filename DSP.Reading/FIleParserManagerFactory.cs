using DSP.Reading.Content;

namespace DSP.Reading
{
    public sealed class FIleParserManagerFactory
    {
        private readonly IFileParserFactory _fileParserFactory;

        public FIleParserManagerFactory(IFileParserFactory fileParserFactory)
        {
            _fileParserFactory = fileParserFactory;
        }

        public IFileParserManager Create()
        {
            return new LoggingFileParserManager(new FileParserManager(_fileParserFactory));
        }
    }
}
