using System.Threading.Tasks;

namespace DSP.Reading
{
    public interface IFileParserManager
    {
        Task<FileParserResult> ParseFileAsync(string fileName);
    }
}
