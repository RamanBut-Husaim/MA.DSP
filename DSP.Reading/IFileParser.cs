using System.Threading.Tasks;

namespace DSP.Reading
{
    public interface IFileParser
    {
        Task<FileParserResult> ParseFileAsync(string fileName);
    }
}
