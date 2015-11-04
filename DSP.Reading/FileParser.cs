using System.Collections.Generic;
using System.Linq;
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

        public FileParserResult ParseFile(string fileName)
        {
            Throw.IfNullOrEmpty(fileName, nameof(fileName));

            FileParserResult fileParserResult;

            using (var fileContentProvider = _fileContentProviderFactory.Create(fileName))
            {
                FileMetadata metadata = fileContentProvider.ReadMetadata();
                IEnumerable<float> signalValues = fileContentProvider.ReadContent();
                fileParserResult = new FileParserResult(metadata, signalValues.ToList());
            }

            return fileParserResult;
        }
    }
}
