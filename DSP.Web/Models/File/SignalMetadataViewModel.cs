using DSP.Core.Signal;
using DSP.Reading.Content;

namespace DSP.Web.Models.File
{
    public sealed class SignalMetadataViewModel
    {
        public SignalMetadataViewModel()
        {
        }

        public SignalMetadataViewModel(SignalMetadata metadata)
        {
            this.Signature = metadata.Signature;
            this.ChannelNumber = metadata.ChannelNumber;
            this.ChannelSize = metadata.ChannelSize;
            this.SpectrumLineNumber = metadata.SpectrumLineNumber;
            this.CutoffFrequency = metadata.CutoffFrequency;
            this.FrequencyDefinition = metadata.FrequencyDefinition;
            this.DataBlockReceiveTime = metadata.DataBlockReceiveTime;
            this.TotalReceiveTime = metadata.TotalReceiveTime;
            this.DataBlockNumber = metadata.DataBlockNumber;
            this.DataSize = metadata.DataSize;
            this.ReceivedBlocksNumber = metadata.ReceivedBlocksNumber;
            this.MaxValue = metadata.MaxValue;
            this.MinValue = metadata.MinValue;
        }

        public SignalMetadataViewModel(FileMetadata metadata)
        {
            this.Signature = metadata.Signature;
            this.ChannelNumber = metadata.ChannelNumber;
            this.ChannelSize = metadata.ChannelSize;
            this.SpectrumLineNumber = metadata.SpectrumLineNumber;
            this.CutoffFrequency = metadata.CutoffFrequency;
            this.FrequencyDefinition = metadata.FrequencyDefinition;
            this.DataBlockReceiveTime = metadata.DataBlockReceiveTime;
            this.TotalReceiveTime = metadata.TotalReceiveTime;
            this.DataBlockNumber = metadata.DataBlockNumber;
            this.DataSize = metadata.DataSize;
            this.ReceivedBlocksNumber = metadata.ReceivedBlocksNumber;
            this.MaxValue = metadata.MaxValue;
            this.MinValue = metadata.MinValue;
        }

        public string Signature { get; set; }

        public int ChannelNumber { get; set; }

        public int ChannelSize { get; set; }

        public int SpectrumLineNumber { get; set; }

        public int CutoffFrequency { get; set; }

        public float FrequencyDefinition { get; set; }

        public float DataBlockReceiveTime { get; set; }

        public int TotalReceiveTime { get; set; }

        public int DataBlockNumber { get; set; }

        public int DataSize { get; set; }

        public int ReceivedBlocksNumber { get; set; }

        public float MaxValue { get; set; }

        public float MinValue { get; set; }
    }
}
