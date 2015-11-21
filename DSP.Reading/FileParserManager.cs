using System.Threading.Tasks;
using DSP.Reading.Content;
using DSP.Utils;

namespace DSP.Reading
{
    public sealed class FileParserManager : IFileParserManager
    {
        private readonly IFileParserFactory _fileParserFactory;

        public FileParserManager(IFileParserFactory fileParserFactory)
        {
            _fileParserFactory = fileParserFactory;
        }

        public async Task<FileParserResult> ParseFileAsync(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));

            IFileParser fileParser = _fileParserFactory.Create(fileName);

            FileParserResult fileParserResult = await fileParser.ParseEntireContentAsync();

            return fileParserResult;
        }
    }
}
