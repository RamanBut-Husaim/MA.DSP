using System.Collections.Generic;
using System.Collections.ObjectModel;
using DSP.Reading.Content;

namespace DSP.Reading
{
    public sealed class FileParserResult
    {
        internal FileParserResult(FileMetadata metadata, IList<float> dataPoints)
        {
            this.FileMetadata = metadata;
            this.SignalValues = new ReadOnlyCollection<float>(dataPoints);
        }

        public FileMetadata FileMetadata { get; }

        public IReadOnlyCollection<float> SignalValues { get; }
    }
}
