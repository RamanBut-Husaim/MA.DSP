using System.Collections.Generic;
using System.Threading.Tasks;

namespace DSP.Reading.Content
{
    public interface IFileParser
    {
        string FileName { get; }

        Task<FileParserResult> ParseEntireContentAsync();

        FileMetadata ParseMetadata();

        Task<FileMetadata> ParseMetadataAsync();

        IEnumerable<float> ParseContent();

        Task<IEnumerable<float>> ParseContentAsync();
    }
}
