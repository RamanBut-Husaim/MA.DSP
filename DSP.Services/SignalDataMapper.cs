using DSP.Core.Signal;
using DSP.Reading;
using DSP.Utils;

namespace DSP.Services
{
    public sealed class SignalDataMapper
    {
        public static SignalData Map(FileParserResult fileParserResult)
        {
            Throw.IfNull(fileParserResult, nameof(fileParserResult));

            var fileMetadata = fileParserResult.FileMetadata;
            var signalMetadata = SignalMetadata.Create(
                fileMetadata.Signature,
                fileMetadata.ChannelNumber,
                fileMetadata.ChannelSize,
                fileMetadata.SpectrumLineNumber,
                fileMetadata.CutoffFrequency,
                fileMetadata.FrequencyDefinition,
                fileMetadata.DataBlockReceiveTime,
                fileMetadata.TotalReceiveTime,
                fileMetadata.DataBlockNumber,
                fileMetadata.DataSize,
                fileMetadata.ReceivedBlocksNumber,
                fileMetadata.MaxValue,
                fileMetadata.MinValue);

            return new SignalData(signalMetadata, fileParserResult.SignalValues);
        }
    }
}
