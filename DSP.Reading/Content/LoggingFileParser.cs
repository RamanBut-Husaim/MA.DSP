using System.Collections.Generic;
using System.Threading.Tasks;
using NLog;

namespace DSP.Reading.Content
{
    public sealed class LoggingFileParser : IFileParser
    {
        private static readonly ILogger Logger = LogManager.GetCurrentClassLogger();

        private readonly IFileParser _fileParser;

        public LoggingFileParser(IFileParser fileParser)
        {
            _fileParser = fileParser;
        }

        public string FileName => _fileParser.FileName;

        public async Task<FileParserResult> ParseEntireContentAsync()
        {
            Logger.Trace("Start parsing file {0} asynchronously", this.FileName);

            FileParserResult parseResult = await _fileParser.ParseEntireContentAsync();

            Logger.Trace("End parsing file {0} asynchronously", this.FileName);

            return parseResult;
        }

        public FileMetadata ParseMetadata()
        {
            Logger.Trace("Start parsing metadata from file {0}", this.FileName);

            FileMetadata metadata = _fileParser.ParseMetadata();

            Logger.Trace("End parsing metadata from file {0}", this.FileName);

            return metadata;
        }

        public async Task<FileMetadata> ParseMetadataAsync()
        {
            Logger.Trace("Start parsing metadata from file {0} asynchronously", this.FileName);

            FileMetadata metadata = await _fileParser.ParseMetadataAsync();

            Logger.Trace("End parsing metadata from file {0} asynchronously", this.FileName);

            return metadata;
        }

        public IEnumerable<float> ParseContent()
        {
            Logger.Trace("Start parsing content from file {0}", this.FileName);

            IEnumerable<float> content = _fileParser.ParseContent();

            Logger.Trace("End parsing content from file {0}", this.FileName);

            return content;
        }

        public async Task<IEnumerable<float>> ParseContentAsync()
        {
            Logger.Trace("Start parsing content from file {0} asynchronously", this.FileName);

            IEnumerable<float> content = await _fileParser.ParseContentAsync();

            Logger.Trace("End parsing content from file {0} asynchronously", this.FileName);

            return content;
        }
    }
}
