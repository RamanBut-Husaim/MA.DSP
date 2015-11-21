using DSP.Utils;

namespace DSP.Reading.Content
{
    public sealed class FileParserFactory : IFileParserFactory
    {
        public IFileParser Create(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));

            IFileParser fileParser = this.CreateFileContentProvider(fileName);

            var loggingFileContentProvider = new LoggingFileParser(fileParser);

            return loggingFileContentProvider;
        }

        private IFileParser CreateFileContentProvider(string fileName)
        {
            return new FileParser(fileName);
        }
    }
}
