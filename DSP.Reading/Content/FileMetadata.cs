namespace DSP.Reading.Content
{
    public sealed class FileMetadata
    {
        internal static readonly int SignatureSize = 4;
        internal static readonly int Size = 13 * 4;

        private FileMetadata()
        {
        }

        public string Signature { get; internal set; }

        public int ChannelNumber { get; internal set; }

        public int ChannelSize { get; internal set; }

        public int SpectrumLineNumber { get; internal set; }

        public int CutoffFrequency { get; internal set; }

        public float FrequencyDefinition { get; internal set; }

        public float DataBlockReceiveTime { get; internal set; }

        public int TotalReceiveTime { get; internal set; }

        public int DataBlockNumber { get; internal set; }

        public int DataSize { get; internal set; }

        public int ReceivedBlocksNumber { get; internal set; }

        public float MaxValue { get; internal set; }

        public float MinValue { get; internal set; }

        internal static FileMetadataBuilder Builder()
        {
            return new FileMetadataBuilder(new FileMetadata());
        }

        internal class FileMetadataBuilder
        {
            private readonly FileMetadata _fileMetadata;

            internal FileMetadataBuilder(FileMetadata fileMetadata)
            {
                _fileMetadata = fileMetadata;
            }

            public FileMetadataBuilder WithSignature(char[] chars)
            {
                _fileMetadata.Signature = new string(chars);
                return this;
            }

            public FileMetadataBuilder WithSignature(string signature)
            {
                _fileMetadata.Signature = signature;
                return this;
            }

            public FileMetadataBuilder WithChannelNumber(int channelNumber)
            {
                _fileMetadata.ChannelNumber = channelNumber;
                return this;
            }

            public FileMetadataBuilder WithChannelSize(int channelSize)
            {
                _fileMetadata.ChannelSize = channelSize;
                return this;
            }

            public FileMetadataBuilder WithSpectrumLineNumber(int spectrumLineNumber)
            {
                _fileMetadata.SpectrumLineNumber = spectrumLineNumber;
                return this;
            }

            public FileMetadataBuilder WithCutoffFrequency(int cutoffFrequency)
            {
                _fileMetadata.CutoffFrequency = cutoffFrequency;
                return this;
            }

            public FileMetadataBuilder WithFrequencyDefinition(float frequencyDefinition)
            {
                _fileMetadata.FrequencyDefinition = frequencyDefinition;
                return this;
            }

            public FileMetadataBuilder WithDataBlockReceiveTime(float dataBlockReceiveTime)
            {
                _fileMetadata.DataBlockReceiveTime = dataBlockReceiveTime;
                return this;
            }

            public FileMetadataBuilder WithTotalReceiveTime(int totalReceiveTime)
            {
                _fileMetadata.TotalReceiveTime = totalReceiveTime;
                return this;
            }

            public FileMetadataBuilder WithDataBlockNumber(int dataBlockNumber)
            {
                _fileMetadata.DataBlockNumber = dataBlockNumber;
                return this;
            }

            public FileMetadataBuilder WithDataSize(int dataSize)
            {
                _fileMetadata.DataSize = dataSize;
                return this;
            }

            public FileMetadataBuilder WithReceivedBlocksNumber(int receivedBlockNumber)
            {
                _fileMetadata.ReceivedBlocksNumber = receivedBlockNumber;
                return this;
            }

            public FileMetadataBuilder WithMaxValue(float maxValue)
            {
                _fileMetadata.MaxValue = maxValue;
                return this;
            }

            public FileMetadataBuilder WithMinValue(float minValue)
            {
                _fileMetadata.MinValue = minValue;
                return this;
            }

            public FileMetadata AsMetadata()
            {
                return _fileMetadata;
            }
        }
    }
}
