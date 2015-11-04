using System.Collections.Generic;
using System.Threading.Tasks;

namespace DSP.Reading.Content
{
    public interface IFileContentProvider
    {
        Task<FileParserResult> ReadEntireContentAsync();

        FileMetadata ReadMetadata();

        Task<FileMetadata> ReadMetadataAsync();

        IEnumerable<float> ReadContent();

        Task<IEnumerable<float>> ReadContentAsync();
    }
}
