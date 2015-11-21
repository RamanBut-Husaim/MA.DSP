using System.Threading.Tasks;
using NLog;

namespace DSP.Reading
{
    public sealed class LoggingFileParserManager : IFileParserManager
    {
        private static readonly ILogger Logger = LogManager.GetCurrentClassLogger();

        private readonly IFileParserManager _fileParserManager;

        public LoggingFileParserManager(IFileParserManager fileParserManager)
        {
            _fileParserManager = fileParserManager;
        }

        public async Task<FileParserResult> ParseFileAsync(string fileName)
        {
            Logger.Trace("Start file {0} handling.", fileName);

            FileParserResult fileParserResult = await _fileParserManager.ParseFileAsync(fileName);

            Logger.Trace("End file {0} handling.", fileName);

            return fileParserResult;
        }
    }
}
