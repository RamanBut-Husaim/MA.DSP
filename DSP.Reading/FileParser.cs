using System.Threading.Tasks;
using DSP.Reading.Content;
using DSP.Utils;

namespace DSP.Reading
{
    public sealed class FileParser : IFileParser
    {
        private readonly IFileContentProviderFactory _fileContentProviderFactory;

        public FileParser(IFileContentProviderFactory fileContentProviderFactory)
        {
            _fileContentProviderFactory = fileContentProviderFactory;
        }

        public async Task<FileParserResult> ParseFileAsync(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));

            IFileContentProvider fileContentProvider = _fileContentProviderFactory.Create(fileName);

            FileParserResult fileParserResult = await fileContentProvider.ReadEntireContentAsync();

            return fileParserResult;
        }
    }
}
